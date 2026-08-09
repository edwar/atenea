'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useKeys } from '@/hooks/useKeys'
import { useProjects } from '@/hooks/useProjects'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Key, FolderOpen, Shield, ArrowRight, Plus, Clock, Copy } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { sileo } from 'sileo'

const environmentConfig: Record<string, { label: string; color: string }> = {
  DEVELOPMENT: { label: 'Development', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  STAGING: { label: 'Staging', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  QA: { label: 'QA', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  PRODUCTION: { label: 'Production', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-[#1E293B] bg-[#111827]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-[#1A2035]" />
                <Skeleton className="h-8 w-12 bg-[#1A2035]" />
              </div>
              <Skeleton className="h-12 w-12 rounded-2xl bg-[#1A2035]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function KeysSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A0E17] p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl bg-[#1A2035]" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-[#1A2035]" />
              <Skeleton className="h-3 w-20 bg-[#1A2035]" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-md bg-[#1A2035]" />
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { data: keys, isLoading: keysLoading } = useKeys()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const isLoading = keysLoading || projectsLoading

  const stats = [
    {
      title: 'Claves',
      value: keys?.length || 0,
      icon: Key,
      gradient: 'from-amber-400 to-amber-600',
    },
    {
      title: 'Proyectos',
      value: projects?.length || 0,
      icon: FolderOpen,
      gradient: 'from-sky-400 to-sky-600',
    },
    {
      title: 'Encriptadas',
      value: keys?.length || 0,
      icon: Shield,
      gradient: 'from-rose-400 to-rose-600',
    },
  ]

  const copyKey = async (id: string, keyName: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      await navigator.clipboard.writeText(`${data.key}="${data.value}"`)
      sileo.success({ title: 'Clave copiada al portapapeles' })
    } catch {
      sileo.error({ title: 'Error al copiar la clave' })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-[#94A3B8]">
          Bienvenido a Atenea — Tu gestor seguro de API keys
        </p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={stat.title} className={cn("border-[#1E293B] bg-[#111827] animate-slide-up opacity-0", `stagger-${i + 1}`)}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748B] font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br", stat.gradient)}>
                    <stat.icon className="h-5 w-5 text-[#0A0E17]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-[#1E293B] bg-[#111827]">
        <div className="flex items-center justify-between p-5 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold">Claves Recientes</h2>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
              Ver todas
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardContent className="p-5">
          {isLoading ? (
            <KeysSkeleton />
          ) : keys && keys.length > 0 ? (
            <div className="space-y-3">
              {keys.slice(0, 5).map((key) => {
                const env = environmentConfig[key.environment] || environmentConfig.DEVELOPMENT
                return (
                  <div
                    key={key.id}
                    className="group flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#0A0E17] p-4 transition-all hover:border-[#334155]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
                        <Key className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-[#64748B]">{key.project.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium", env.color)}>
                        {env.label}
                      </span>
                      <code className="rounded-lg bg-[#111827] px-3 py-1.5 text-xs font-code text-[#94A3B8]">
                        {key.key.slice(0, 14)}...
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1A2035]"
                        onClick={() => copyKey(key.id, key.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1A2035]">
                <Key className="h-6 w-6 text-[#64748B]" />
              </div>
              <p className="text-[#94A3B8] font-medium">No hay claves aún</p>
              <Link href="/projects" className="mt-4">
                <Button className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold shadow-lg shadow-amber-500/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera clave
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
