'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { Key, Lock, Eye, Copy, FolderOpen, ArrowRight, ChevronRight, Shield, Globe, Code2 } from 'lucide-react'

const features = [
  {
    icon: Lock,
    title: 'Encriptación AES-256',
    description: 'Tus claves API están protegidas con encriptación de nivel militar. Nadie puede leerlas sin tu autorización.',
    color: 'amber',
  },
  {
    icon: Key,
    title: 'Generación Inteligente',
    description: 'Genera valores seguros con múltiples algoritmos: UUID, hex, base64, NanoID y más.',
    color: 'sky',
  },
  {
    icon: FolderOpen,
    title: 'Organización por Proyectos',
    description: 'Agrupa tus claves por proyecto o servicio. Todo ordenado, todo accesible.',
    color: 'rose',
  },
  {
    icon: Eye,
    title: 'Control de Acceso',
    description: 'Comparte claves con tu equipo de forma segura. Cada miembro tiene permisos específicos.',
    color: 'amber',
  },
  {
    icon: Copy,
    title: 'Copia Instantánea',
    description: 'Copia cualquier clave al portapapeles con un clic. Sin errores, sin complicaciones.',
    color: 'sky',
  },
  {
    icon: Shield,
    title: 'Auditoría Completa',
    description: 'Registra quién accedió a cada clave y cuándo. Trazabilidad total de acciones.',
    color: 'rose',
  },
]

const colorMap: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-400',
  sky: 'bg-sky-500/10 text-sky-400',
  rose: 'bg-rose-500/10 text-rose-400',
}

const floatingKeys = [
  { name: 'STRIPE_API_KEY', value: 'sk_live_••••••••••••', x: -380, y: -120, rotate: -6, delay: 0 },
  { name: 'OPENAI_API_KEY', value: 'sk-proj-••••••••••••', x: 350, y: -80, rotate: 4, delay: 0.2 },
  { name: 'GITHUB_TOKEN', value: 'ghp_••••••••••••••••', x: -320, y: 140, rotate: 3, delay: 0.4 },
  { name: 'AWS_SECRET_KEY', value: 'wJalrXUtnFEMI/••••••', x: 380, y: 100, rotate: -5, delay: 0.3 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E293B]/50 bg-[#0A0E17]/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size="md" />
            <span className="text-lg font-bold tracking-tight">Atenea</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login">
              <Button className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold shadow-lg shadow-amber-500/20">
                Comenzar
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-amber-500/8 rounded-full blur-[150px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500/5 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(248,250,252,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }} />

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up stagger-1 opacity-0">
              Tus API keys,{' '}
              <span className="gradient-text">a salvo</span>
            </h1>

            <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto animate-slide-up stagger-2 opacity-0 leading-relaxed">
              Gestiona todas tus claves API de forma segura y organizada.
              Encriptación AES-256, control de acceso y colaboración en equipo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3 opacity-0">
              <Link href="/login">
                <Button size="lg" className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold px-10 h-13 text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="ghost" className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035] h-13 text-base">
                  Conocer Más
                  <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 lg:mt-24 relative animate-slide-up stagger-4 opacity-0">
            {/* Floating Key Cards */}
            {floatingKeys.map((item, i) => (
              <div
                key={item.name}
                className="hidden lg:block absolute z-10 animate-fade-in"
                style={{
                  left: `calc(50% + ${item.x}px)`,
                  top: `calc(50% + ${item.y}px)`,
                  transform: `rotate(${item.rotate}deg)`,
                  animationDelay: `${item.delay + 0.8}s`,
                }}
              >
                <div className="flex items-center gap-2 rounded-lg border border-[#1E293B] bg-[#111827]/90 backdrop-blur-sm px-3 py-2 shadow-xl shadow-black/20">
                  <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-xs font-medium text-[#F8FAFC]">{item.name}</span>
                  <span className="text-xs text-[#64748B] font-code">{item.value}</span>
                </div>
              </div>
            ))}

            {/* Main Dashboard Card */}
            <div className="mx-auto max-w-3xl rounded-2xl border border-[#1E293B] bg-[#111827]/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E293B] bg-[#0A0E17]/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#64748B] font-code">
                  <Shield className="h-3.5 w-3.5 text-amber-400" />
                  atenea — Proyecto: MiApp
                </div>
                <div className="w-16" />
              </div>

              {/* Dashboard content */}
              <div className="p-4 md:p-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-4 md:gap-4 md:mb-6">
                  <div className="rounded-xl bg-[#0A0E17] p-2.5 md:p-4 border border-[#1E293B]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#64748B]">Claves</span>
                      <Key className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold">12</p>
                  </div>
                  <div className="rounded-xl bg-[#0A0E17] p-2.5 md:p-4 border border-[#1E293B]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#64748B]">Proyectos</span>
                      <FolderOpen className="h-4 w-4 text-sky-400" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold">4</p>
                  </div>
                  <div className="rounded-xl bg-[#0A0E17] p-2.5 md:p-4 border border-[#1E293B]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#64748B]">Seguras</span>
                      <Shield className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold">12</p>
                  </div>
                </div>

                {/* Key list */}
                <div className="space-y-3">
                  {[
                    { name: 'STRIPE_API_KEY', project: 'E-commerce', env: 'Production', color: 'emerald' },
                    { name: 'OPENAI_API_KEY', project: 'AI Assistant', env: 'Development', color: 'amber' },
                    { name: 'SENDGRID_KEY', project: 'Notifications', env: 'Staging', color: 'sky' },
                  ].map((key, i) => (
                    <div
                      key={key.name}
                      className="flex items-center justify-between gap-2 rounded-xl bg-[#0A0E17] border border-[#1E293B] p-3 md:p-4 hover:border-[#334155] transition-colors"
                      style={{ animationDelay: `${i * 0.1 + 1.2}s` }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                          <Key className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{key.name}</p>
                          <p className="truncate text-xs text-[#64748B]">{key.project}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 md:gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full bg-${key.color}-500/10 text-${key.color}-400`}>
                          {key.env}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-[#64748B] hover:text-[#F8FAFC]" aria-label="Copiar clave de ejemplo">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow behind dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -z-10" />
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            {[
              { icon: Lock, text: 'AES-256 Encryption' },
              { icon: Globe, text: 'Multi-project' },
              { icon: Code2, text: 'API Access' },
              { icon: Shield, text: 'SOC 2 Ready' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-sm text-[#64748B]">
                <badge.icon className="h-4 w-4 text-amber-400/60" />
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-[#1E293B]/50">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-[#94A3B8] text-lg">
              Herramientas poderosas para mantener tus claves seguras
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  "group relative rounded-2xl border border-[#1E293B] bg-[#111827] p-6 transition-all duration-300 hover:border-[#334155] hover:bg-[#1A2035]",
                  `animate-slide-up stagger-${i + 1} opacity-0`
                )}
              >
                <div className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-xl", colorMap[feature.color])}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-[#1E293B]/50">
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <div className="relative rounded-3xl border border-amber-500/20 bg-linear-to-br from-amber-500/10 via-[#111827] to-[#111827] p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
            <div className="relative">
              <div className="inline-flex items-center justify-center">
                <Logo size="2xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Protege tus claves hoy
              </h2>
              <p className="text-[#94A3B8] text-lg mb-8 max-w-xl mx-auto">
                Únete a desarrolladores que ya confían en Atenea para gestionar sus API keys de forma segura.
              </p>
              <Link href="/login">
                <Button size="lg" className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold px-10 h-13 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#1E293B]/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-semibold">Atenea</span>
          </div>
          <p className="text-sm text-[#64748B]">
            © 2026 Atenea. Gestión segura de API keys.
          </p>
        </div>
      </footer>
    </div>
  )
}

