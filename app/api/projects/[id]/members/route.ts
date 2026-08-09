import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendInvitationEmail } from '@/lib/email'
import crypto from 'crypto'

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

  if (user) {
    // User exists, add directly to project
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
  } else {
    // User doesn't exist, create invitation
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        email_projectId: {
          email,
          projectId: id,
        },
      },
    })

    if (existingInvitation) {
      // Update existing invitation
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await prisma.invitation.update({
        where: { id: existingInvitation.id },
        data: {
          role: memberRole,
          token,
          expiresAt,
        },
      })

      // Get project name
      const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true },
      })

      // Send invitation email
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://atenea.cognilab.dev'}/auth/signin?invitation=${token}`
      await sendInvitationEmail({
        to: email,
        projectName: project?.name || 'Proyecto',
        invitedBy: session.user.name || session.user.email,
        role: memberRole === 'OWNER' ? 'Propietario' : memberRole === 'ADMIN' ? 'Administrador' : 'Visualizador',
        inviteUrl,
      })

      await prisma.auditLog.create({
        data: {
          action: 'share',
          entityType: 'project',
          entityId: id,
          userId: session.user.id,
          details: { invitedEmail: email, role: memberRole, invitationToken: token },
        },
      })

      return NextResponse.json({ message: 'Invitación enviada por correo electrónico', invitationId: existingInvitation.id })
    } else {
      // Create new invitation
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const invitation = await prisma.invitation.create({
        data: {
          email,
          projectId: id,
          role: memberRole,
          token,
          expiresAt,
        },
      })

      // Get project name
      const project = await prisma.project.findUnique({
        where: { id },
        select: { name: true },
      })

      // Send invitation email
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://atenea.cognilab.dev'}/auth/signin?invitation=${token}`
      await sendInvitationEmail({
        to: email,
        projectName: project?.name || 'Proyecto',
        invitedBy: session.user.name || session.user.email,
        role: memberRole === 'OWNER' ? 'Propietario' : memberRole === 'ADMIN' ? 'Administrador' : 'Visualizador',
        inviteUrl,
      })

      await prisma.auditLog.create({
        data: {
          action: 'share',
          entityType: 'project',
          entityId: id,
          userId: session.user.id,
          details: { invitedEmail: email, role: memberRole, invitationToken: token },
        },
      })

      return NextResponse.json({ message: 'Invitación enviada por correo electrónico', invitationId: invitation.id })
    }
  }
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
