'use client'

import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Shield, Key, User, Monitor, Smartphone, Globe, Copy, Check } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'

export default function SettingsPage() {
  const { user } = useSession()
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState<Array<{ id: string; device: string; browser: string; lastActive: string; current: boolean }>>([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [copiedSecret, setCopiedSecret] = useState(false)

  useEffect(() => {
    setTwoFAEnabled(user?.twoFactorEnabled || false)
  }, [user])

  useEffect(() => {
    setSessions([
      {
        id: '1',
        device: 'MacBook Pro',
        browser: 'Chrome',
        lastActive: 'Ahora',
        current: true,
      },
    ])
    setLoadingSessions(false)
  }, [])

  const setup2FA = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' })
      const data = await res.json()

      if (data.otpauthUrl) {
        setSecret(data.secret)
        const qrDataUrl = await QRCode.toDataURL(data.otpauthUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#0A0E17',
            light: '#FFFFFF',
          },
        })
        setQrCodeUrl(qrDataUrl)
      }
    } catch (err) {
      console.error('Error setting up 2FA:', err)
    }
  }, [])

  const handleEnable2FA = async () => {
    setShow2FASetup(true)
    await setup2FA()
  }

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      setError('El código debe tener 6 dígitos')
      return
    }

    setVerifying(true)
    setError('')

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode, action: 'verify' }),
      })

      const data = await res.json()

      if (data.success) {
        setTwoFAEnabled(true)
        setShow2FASetup(false)
        setVerificationCode('')
      } else {
        setError(data.error || 'Código inválido')
      }
    } catch (err) {
      setError('Error al verificar el código')
    } finally {
      setVerifying(false)
    }
  }

  const handleDisable2FA = async () => {
    try {
      await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: '', action: 'disable' }),
      })
      setTwoFAEnabled(false)
    } catch (err) {
      console.error('Error disabling 2FA:', err)
    }
  }

  const copySecret = async () => {
    await navigator.clipboard.writeText(secret)
    setCopiedSecret(true)
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Configuración</h1>
        <p className="text-[#94A3B8]">
          Administra tu cuenta y preferencias
        </p>
      </div>

      {/* Profile */}
      <Card className="border-[#1E293B] bg-[#111827]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-400" />
            Perfil
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Información de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
              <AvatarFallback className="bg-linear-to-br from-amber-400/20 to-amber-600/20 text-amber-400 text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{user?.name}</p>
              <p className="text-sm text-[#64748B]">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card className="border-[#1E293B] bg-[#111827]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-400" />
            Autenticación de dos factores
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Añade una capa extra de seguridad a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {show2FASetup ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <p className="text-sm text-amber-400 font-medium mb-4">
                  Configuración de 2FA
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-[#94A3B8] mb-3">Escanea este código QR</p>
                    <div className="rounded-xl bg-white p-3">
                      {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="QR Code para 2FA" className="h-48 w-48" />
                      ) : (
                        <div className="h-48 w-48 flex items-center justify-center bg-[#1A2035]">
                          <span className="text-sm text-[#64748B]">Generando QR...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-[#94A3B8] mb-2">O copia esta clave secreta:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg bg-[#0A0E17] px-3 py-2 text-sm font-mono text-amber-400 break-all">
                          {secret}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={copySecret}
                          className="cursor-pointer shrink-0"
                          aria-label={copiedSecret ? 'Copiado' : 'Copiar clave secreta'}
                        >
                          {copiedSecret ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4 text-[#94A3B8]" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-[#94A3B8]">Pasos:</p>
                      <ol className="text-sm text-[#94A3B8] space-y-1 list-decimal list-inside">
                        <li>Abre tu aplicación de autenticación</li>
                        <li>Escanea el código QR o ingresa la clave manualmente</li>
                        <li>Ingresa el código de 6 dígitos para verificar</li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#94A3B8]">Código de verificación</label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        className="h-12 text-center text-lg font-mono tracking-widest bg-[#0A0E17] border-[#334155] focus:border-amber-500 focus:ring-amber-500/20"
                      />
                      {error && (
                        <p className="text-sm text-rose-400">{error}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleVerify2FA}
                  disabled={verificationCode.length !== 6 || verifying}
                  className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold disabled:opacity-50"
                >
                  {verifying ? 'Verificando...' : 'Verificar y Activar'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShow2FASetup(false)
                    setVerificationCode('')
                    setError('')
                    setQrCodeUrl('')
                    setSecret('')
                  }}
                  className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
                  <Shield className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">
                    {twoFAEnabled ? 'Habilitada' : 'Deshabilitada'}
                  </p>
                  <p className="text-sm text-[#64748B]">
                    {twoFAEnabled ? 'Tu cuenta está protegida con 2FA' : 'Recomendado para mayor seguridad'}
                  </p>
                </div>
              </div>
              {twoFAEnabled ? (
                <Button
                  variant="outline"
                  onClick={handleDisable2FA}
                  className="cursor-pointer border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  Deshabilitar
                </Button>
              ) : (
                <Button
                  onClick={handleEnable2FA}
                  className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold"
                >
                  Habilitar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card className="border-[#1E293B] bg-[#111827]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-400" />
            Sesiones activas
          </CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Gestiona tus sesiones activas en diferentes dispositivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-[#0A0E17] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A0E17] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-sky-400/20 to-sky-600/20">
                      {session.device.includes('Mac') ? (
                        <Monitor className="h-5 w-5 text-sky-400" />
                      ) : session.device.includes('iPhone') || session.device.includes('Android') ? (
                        <Smartphone className="h-5 w-5 text-sky-400" />
                      ) : (
                        <Globe className="h-5 w-5 text-sky-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-[#64748B]">{session.browser} · {session.lastActive}</p>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      Actual
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      Cerrar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
