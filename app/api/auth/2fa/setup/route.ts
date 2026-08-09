import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as OTPAuth from 'otpauth'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Create TOTP secret
  const totp = new OTPAuth.TOTP({
    issuer: 'Atenea',
    label: user.email || 'user@atenea.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  })

  const secret = totp.secret.base32
  const otpauthUrl = totp.toString()

  // Store the secret temporarily (not enabled yet)
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorSecret: secret,
      twoFactorEnabled: false,
    },
  })

  return NextResponse.json({
    secret,
    otpauthUrl,
  })
}
