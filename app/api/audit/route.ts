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

  const { searchParams } = new URL(request.url)
  const entityType = searchParams.get('entityType')
  const entityId = searchParams.get('entityId')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: Record<string, unknown> = {
    userId: session.user.id,
  }

  if (entityType) where.entityType = entityType
  if (entityId) where.entityId = entityId

  const logs = await prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: Math.min(limit, 100),
  })

  return NextResponse.json(logs)
}
