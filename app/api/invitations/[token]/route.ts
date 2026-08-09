import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await params

  // Find the invitation
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { project: true },
  })

  if (!invitation) {
    return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 })
  }

  // Check if invitation has expired
  if (new Date() > invitation.expiresAt) {
    return NextResponse.json({ error: 'Invitación expirada' }, { status: 400 })
  }

  // Check if the invitation email matches the current user's email
  if (invitation.email !== session.user.email) {
    return NextResponse.json({ error: 'Esta invitación no es para tu correo electrónico' }, { status: 403 })
  }

  // Check if already a member
  const existingMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: invitation.projectId,
        userId: session.user.id,
      },
    },
  })

  if (existingMember) {
    // Delete the invitation since they're already a member
    await prisma.invitation.delete({ where: { id: invitation.id } })
    return NextResponse.json({ message: 'Ya eres miembro del proyecto', projectId: invitation.projectId })
  }

  // Add user to project
  const member = await prisma.projectMember.create({
    data: {
      projectId: invitation.projectId,
      userId: session.user.id,
      role: invitation.role,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      action: 'share',
      entityType: 'project',
      entityId: invitation.projectId,
      userId: session.user.id,
      details: { acceptedInvitation: invitation.email, role: invitation.role },
    },
  })

  // Delete the invitation
  await prisma.invitation.delete({ where: { id: invitation.id } })

  return NextResponse.json({ message: 'Invitación aceptada', projectId: invitation.projectId, member })
}
