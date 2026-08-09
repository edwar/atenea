import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('[AUTH] GET:', request.url)
  try {
    const response = await auth.handler(request as unknown as Request)
    return response as Response
  } catch (error) {
    console.error('[AUTH] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('[AUTH] POST:', request.url)
  try {
    const response = await auth.handler(request as unknown as Request)
    return response as Response
  } catch (error) {
    console.error('[AUTH] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
