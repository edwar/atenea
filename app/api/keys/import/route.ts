import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/crypto'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { keys, projectId } = body

  if (!keys || !Array.isArray(keys) || !projectId) {
    return NextResponse.json({ error: 'keys array and projectId are required' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const imported = []

  for (const key of keys) {
    const { name, value } = key

    if (!name || !value) {
      continue
    }

    const existingKey = await prisma.apiKey.findFirst({
      where: {
        name,
        projectId,
      },
    })

    if (existingKey) {
      await prisma.apiKey.update({
        where: { id: existingKey.id },
        data: {
          value: encrypt(value),
        },
      })
      imported.push({ name, action: 'updated' })
    } else {
      await prisma.apiKey.create({
        data: {
          name,
          key: `ak_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`,
          value: encrypt(value),
          projectId,
          ownerUserId: session.user.id,
        },
      })
      imported.push({ name, action: 'created' })
    }
  }

  await prisma.auditLog.create({
    data: {
      action: 'import',
      entityType: 'key',
      entityId: projectId,
      userId: session.user.id,
      details: { count: imported.length },
    },
  })

  return NextResponse.json({ imported })
}
