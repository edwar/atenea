import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/crypto'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')

  const where: Record<string, unknown> = {
    OR: [
      { ownerUserId: session.user.id },
      { members: { some: { userId: session.user.id } } },
      { project: { members: { some: { userId: session.user.id } } } },
    ],
  }

  if (projectId) {
    where.projectId = projectId
  }

  const keys = await prisma.apiKey.findMany({
    where,
    include: {
      project: true,
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(
    keys.map((key) => ({
      ...key,
      value: undefined,
    }))
  )
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, projectId, value, environment } = body

  if (!projectId || !value || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const validEnvironments = ['DEVELOPMENT', 'STAGING', 'QA', 'PRODUCTION']
  const env = validEnvironments.includes(environment) ? environment : 'DEVELOPMENT'

  const key = await prisma.apiKey.create({
    data: {
      name,
      description,
      key: `ak_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`,
      value: encrypt(value),
      environment: env as any,
      projectId,
      ownerUserId: session.user.id,
    },
    include: {
      project: true,
    },
  })

  await prisma.auditLog.create({
    data: {
      action: 'create',
      entityType: 'key',
      entityId: key.id,
      userId: session.user.id,
      details: { name: key.name },
    },
  })

  return NextResponse.json({ ...key, value: undefined })
}
