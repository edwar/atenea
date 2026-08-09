import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { userId, role } = body

  if (!userId || !role) {
    return NextResponse.json({ error: 'userId and role are required' }, { status: 400 })
  }

  if (!['OWNER', 'ADMIN', 'VIEWER'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const key = await prisma.apiKey.findUnique({
    where: { id },
  })

  if (!key) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 })
  }

  const existingMember = await prisma.keyMember.findUnique({
    where: {
      keyId_userId: {
        keyId: id,
        userId,
      },
    },
  })

  if (existingMember) {
    await prisma.keyMember.update({
      where: {
        keyId_userId: {
          keyId: id,
          userId,
        },
      },
      data: { role },
    })
  } else {
    await prisma.keyMember.create({
      data: {
        keyId: id,
        userId,
        role,
      },
    })
  }

  await prisma.auditLog.create({
    data: {
      action: 'share',
      entityType: 'key',
      entityId: id,
      userId: session.user.id,
      details: { sharedWith: userId, role },
    },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  await prisma.keyMember.delete({
    where: {
      keyId_userId: {
        keyId: id,
        userId,
      },
    },
  })

  return NextResponse.json({ success: true })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const members = await prisma.keyMember.findMany({
    where: { keyId: id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })

  return NextResponse.json(members)
}
