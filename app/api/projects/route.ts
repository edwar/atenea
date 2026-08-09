import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { members: { some: { userId: session.user.id } } },
        { keys: { some: { ownerUserId: session.user.id } } },
      ],
    },
    include: {
      _count: {
        select: { keys: true, members: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description } = body

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId: session.user.id,
          role: 'OWNER',
        },
      },
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'create',
      entityType: 'project',
      entityId: project.id,
      userId: session.user.id,
      details: { name: project.name },
    },
  })

  return NextResponse.json(project)
}
