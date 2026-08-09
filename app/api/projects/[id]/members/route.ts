import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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

  const members = await prisma.projectMember.findMany({
    where: { projectId: id },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })

  return NextResponse.json(members)
}

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
  const { email, role } = body

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const validRoles = ['OWNER', 'ADMIN', 'VIEWER']
  const memberRole = validRoles.includes(role) ? role : 'VIEWER'

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  // Check if already a member
  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id,
        userId: user.id,
      },
    },
  })

  if (existingMember) {
    return NextResponse.json({ error: 'El usuario ya es miembro del proyecto' }, { status: 400 })
  }

  const member = await prisma.projectMember.create({
    data: {
      projectId: id,
      userId: user.id,
      role: memberRole,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'share',
      entityType: 'project',
      entityId: id,
      userId: session.user.id,
      details: { sharedWith: user.email, role: memberRole },
    },
  })

  return NextResponse.json(member)
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

  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId: id,
        userId,
      },
    },
  })

  return NextResponse.json({ success: true })
}
