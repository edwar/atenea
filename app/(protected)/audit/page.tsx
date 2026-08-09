'use client'

import { cn } from '@/lib/utils'
import { useAudit } from '@/hooks/useAudit'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'
import { History, Plus, Trash2, Eye, Copy, Pencil } from 'lucide-react'

const actionLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  create: { label: 'Creó', icon: Plus, color: 'text-emerald-400' },
  update: { label: 'Actualizó', icon: Pencil, color: 'text-sky-400' },
  delete: { label: 'Eliminó', icon: Trash2, color: 'text-rose-400' },
  view: { label: 'Visualizó', icon: Eye, color: 'text-amber-400' },
  copy: { label: 'Copió', icon: Copy, color: 'text-purple-400' },
}

const entityLabels: Record<string, string> = {
  key: 'Clave',
  project: 'Proyecto',
}

export default function AuditPage() {
  const [entityType, setEntityType] = useState<string | undefined>()
  const { data: logs, isLoading } = useAudit({ entityType })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-[#1A2035]" />
        <Skeleton className="h-10 w-64 bg-[#1A2035]" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl bg-[#1A2035]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historial</h1>
          <p className="text-[#94A3B8]">
            Registro de actividades en tu cuenta
          </p>
        </div>
        <Select value={entityType} onValueChange={(value) => setEntityType(value ?? undefined)}>
          <SelectTrigger className="w-[180px] cursor-pointer border-[#1E293B] bg-[#111827] hover:border-[#334155]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent className="border-[#1E293B] bg-[#111827]">
            <SelectItem value="key" className="cursor-pointer focus:bg-[#1A2035] focus:text-[#F8FAFC]">Claves</SelectItem>
            <SelectItem value="project" className="cursor-pointer focus:bg-[#1A2035] focus:text-[#F8FAFC]">Proyectos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {logs && logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log, i) => {
            const action = actionLabels[log.action] || { label: log.action, icon: History, color: 'text-[#64748B]' }
            const ActionIcon = action.icon

            return (
              <Card key={log.id} className={cn("border-[#1E293B] bg-[#111827] animate-slide-up opacity-0", `stagger-${Math.min(i + 1, 5)}`)}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0E17]">
                    <ActionIcon className={`h-4 w-4 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium text-[#F8FAFC]">{log.user.name || log.user.email}</span>
                      {' '}
                      <span className="text-[#94A3B8]">{action.label}</span>
                      {' '}
                      <span className="font-medium text-[#F8FAFC]">{entityLabels[log.entityType] || log.entityType}</span>
                      {log.details && typeof log.details === 'object' && 'name' in log.details && (
                        <>
                          {' '}
                          <span className="text-[#64748B]">&quot;</span>
                          <span className="text-amber-400">{(log.details as { name: string }).name}</span>
                          <span className="text-[#64748B]">&quot;</span>
                        </>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[#64748B]">
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-[#1E293B] bg-[#111827]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A2035]">
              <History className="h-7 w-7 text-[#64748B]" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No hay registros</h3>
            <p className="text-[#94A3B8]">
              Las actividades aparecerán aquí cuando uses la aplicación
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

