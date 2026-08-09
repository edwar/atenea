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
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  // Verify current user is the owner
  const currentMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id,
        userId: session.user.id,
      },
    },
  })

  if (!currentMember || currentMember.role !== 'OWNER') {
    return NextResponse.json({ error: 'Solo el propietario puede transferir la propiedad' }, { status: 403 })
  }

  // Verify target user is a member
  const targetMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id,
        userId,
      },
    },
  })

  if (!targetMember) {
    return NextResponse.json({ error: 'El usuario no es miembro del proyecto' }, { status: 404 })
  }

  // Transfer ownership: downgrade current owner to admin, upgrade target to owner
  await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId: id,
        userId: session.user.id,
      },
    },
    data: { role: 'ADMIN' },
  })

  await prisma.projectMember.update({
    where: {
      projectId_userId: {
        projectId: id,
        userId,
      },
    },
    data: { role: 'OWNER' },
  })

  await prisma.auditLog.create({
    data: {
      action: 'transfer',
      entityType: 'project',
      entityId: id,
      userId: session.user.id,
      details: { transferredTo: userId },
    },
  })

  return NextResponse.json({ success: true })
}
