'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Key } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/sign-in/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'github', callbackURL: '/dashboard' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0E17] px-4 md:px-6">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-amber-500/8 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#F8FAFC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        {/* Logo */}
        <div className="mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Bienvenido de nuevo</h1>
          <p className="mt-2 text-sm text-[#94A3B8] md:text-base">
            Inicia sesión para acceder a tus claves API
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-6 md:p-8 shadow-2xl shadow-black/30">
          <Button
            onClick={handleGitHubLogin}
            className="h-13 w-full cursor-pointer bg-[#F8FAFC] text-[#0A0E17] hover:bg-[#E2E8F0] font-semibold text-base transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            )}
            {isLoading ? 'Conectando...' : 'Continuar con GitHub'}
          </Button>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1E293B]" />
            <span className="text-xs text-[#64748B]">o</span>
            <div className="flex-1 h-px bg-[#1E293B]" />
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0A0E17] p-4">
            <Key className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-[#94A3B8]">
              Tus claves están encriptadas con AES-256
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-[#64748B]">
          Al continuar, aceptas nuestros{' '}
          <Link href="/terms" className="text-[#94A3B8] underline underline-offset-4 hover:text-amber-400 transition-colors">
            Términos
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-[#94A3B8] underline underline-offset-4 hover:text-amber-400 transition-colors">
            Privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}
