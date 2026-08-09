import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/crypto'
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
  const format = searchParams.get('format') || 'env'

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
    include: { project: true },
    orderBy: { name: 'asc' },
  })

  if (format === 'json') {
    const exported = keys.map((key) => ({
      name: key.name,
      key: key.key,
      project: key.project.name,
      value: decrypt(key.value),
    }))

    return NextResponse.json(exported)
  }

  const envLines: string[] = []
  for (const key of keys) {
    envLines.push(`# ${key.name} (${key.project.name})`)
    envLines.push(`${key.key}=${decrypt(key.value)}`)
    envLines.push('')
  }

  return new NextResponse(envLines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="atenea-keys.env"',
    },
  })
}
