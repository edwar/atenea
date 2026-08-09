import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/crypto'
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

  const key = await prisma.apiKey.findUnique({
    where: { id },
    include: {
      project: true,
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })

  if (!key) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 })
  }

  await prisma.auditLog.create({
    data: {
      action: 'view',
      entityType: 'key',
      entityId: key.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ ...key, value: undefined })
}

export async function PATCH(
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

  const existingKey = await prisma.apiKey.findUnique({
    where: { id },
  })

  if (!existingKey) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 })
  }

  const updateData: Record<string, unknown> = {}

  if (body.name) updateData.name = body.name
  if (body.description !== undefined) updateData.description = body.description
  if (body.value) updateData.value = encrypt(body.value)
  if (body.environment) {
    const validEnvironments = ['DEVELOPMENT', 'STAGING', 'QA', 'PRODUCTION']
    if (validEnvironments.includes(body.environment)) {
      updateData.environment = body.environment
    }
  }

  const key = await prisma.apiKey.update({
    where: { id },
    data: updateData,
    include: {
      project: true,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'update',
      entityType: 'key',
      entityId: key.id,
      userId: session.user.id,
      details: { updatedFields: Object.keys(updateData).filter((k) => k !== 'value') },
    },
  })

  return NextResponse.json({ ...key, value: undefined })
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

  const key = await prisma.apiKey.findUnique({
    where: { id },
  })

  if (!key) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 })
  }

  await prisma.auditLog.create({
    data: {
      action: 'delete',
      entityType: 'key',
      entityId: key.id,
      userId: session.user.id,
      details: { name: key.name },
    },
  })

  await prisma.apiKey.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
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

  const key = await prisma.apiKey.findUnique({
    where: { id },
  })

  if (!key) {
    return NextResponse.json({ error: 'Key not found' }, { status: 404 })
  }

  const decryptedValue = decrypt(key.value)

  await prisma.auditLog.create({
    data: {
      action: 'copy',
      entityType: 'key',
      entityId: key.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ key: key.key, value: decryptedValue })
}
