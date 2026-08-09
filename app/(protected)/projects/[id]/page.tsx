'use client'

import { useState, useMemo } from 'react'
import { use } from 'react'
import { cn } from '@/lib/utils'
import { useProject } from '@/hooks/useProjects'
import { useSession } from '@/hooks/useSession'
import { useDeleteKey, useCopyKeyValue } from '@/hooks/useKeys'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MoreVertical, Copy, Trash2, Eye, Key, ArrowLeft, FolderOpen, Pencil, Filter } from 'lucide-react'
import { KeyForm } from '@/components/keys/key-form'
import { KeyDetail } from '@/components/keys/key-detail'
import { KeyEditForm } from '@/components/keys/key-edit-form'
import { ProjectEditForm } from '@/components/projects/project-edit-form'
import { ExportImport } from '@/components/keys/export-import'
import { MembersManager } from '@/components/projects/members-manager'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: project, isLoading } = useProject(id)
  const { user } = useSession()
  const deleteKey = useDeleteKey()
  const copyKeyValue = useCopyKeyValue()
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false)
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false)
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null)
  const [viewingKeyId, setViewingKeyId] = useState<string | null>(null)
  const [editingKeyId, setEditingKeyId] = useState<string | null>(null)
  const [filterEnvironment, setFilterEnvironment] = useState('ALL')

  const filteredKeys = useMemo(() => {
    if (!project?.keys) return []
    if (filterEnvironment === 'ALL') return project.keys
    return project.keys.filter((key) => key.environment === filterEnvironment)
  }, [project, filterEnvironment])

  const envCounts = useMemo(() => {
    if (!project?.keys) return {}
    const counts: Record<string, number> = {}
    for (const key of project.keys) {
      const env = key.environment || 'UNKNOWN'
      counts[env] = (counts[env] || 0) + 1
    }
    return counts
  }, [project])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-[#1A2035]" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-[#1A2035]" />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#F8FAFC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Link>
        <Card className="border-[#1E293B] bg-[#111827]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A2035]">
              <Key className="h-7 w-7 text-[#64748B]" />
            </div>
            <h3 className="text-lg font-semibold">Proyecto no encontrado</h3>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link
            href="/projects"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[#64748B] transition-colors hover:text-[#F8FAFC]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
              <FolderOpen className="h-6 w-6 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">{project.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1A2035]"
                  onClick={() => setShowEditProjectDialog(true)}
                  aria-label="Editar proyecto"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {project.description && (
                <p className="text-sm text-[#94A3B8] md:text-base">{project.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <ExportImport projectId={id} projectName={project.name} />
          <Button
            onClick={() => setShowCreateKeyDialog(true)}
            className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold shadow-lg shadow-amber-500/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Clave
          </Button>
        </div>
      </div>

      {project.keys && project.keys.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#64748B]" />
          <Select
            value={filterEnvironment}
            onValueChange={(v) => setFilterEnvironment(v ?? 'ALL')}
            items={[
              { value: 'ALL', label: 'Todos' },
              ...Object.keys(environmentConfig).map((env) => ({ value: env, label: environmentConfig[env].label })),
            ]}
          >
            <SelectTrigger className="w-[180px] border-[#1E293B] bg-[#111827] text-[#F8FAFC]">
              <SelectValue placeholder="Filtrar por entorno" />
            </SelectTrigger>
            <SelectContent className="border-[#1E293B] bg-[#111827]">
              <SelectItem value="ALL" className="text-[#94A3B8] focus:bg-[#1A2035] focus:text-[#F8FAFC]">
                Todos ({project.keys.length})
              </SelectItem>
              {Object.keys(environmentConfig).map((env) => (
                <SelectItem key={env} value={env} className="text-[#94A3B8] focus:bg-[#1A2035] focus:text-[#F8FAFC]">
                  {environmentConfig[env].label} ({envCounts[env] || 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {project.keys && project.keys.length > 0 ? (
        filteredKeys.length > 0 ? (
          <div className="space-y-3">
            {filteredKeys.map((key, i) => (
              <Card key={key.id} className={cn("group border-[#1E293B] bg-[#111827] transition-all hover:border-[#334155] animate-slide-up opacity-0", `stagger-${Math.min(i + 1, 5)}`)}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
                      <Key className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{key.name}</p>
                        <EnvironmentBadge environment={key.environment} />
                      </div>
                      {key.description && (
                        <p className="truncate text-sm text-[#64748B]">{key.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
                    <code className="hidden rounded-lg bg-[#0A0E17] px-3 py-1.5 text-xs font-code text-[#94A3B8] lg:inline-block">
                      {key.key.slice(0, 16)}...
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1A2035]"
                      onClick={() => copyKeyValue.mutate({ id: key.id })}
                      aria-label={`Copiar ${key.name}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <p className="hidden text-xs text-[#64748B] sm:inline">
                      {formatDate(key.updatedAt)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-[#1E293B] bg-[#111827]">
                        <DropdownMenuItem onClick={() => setViewingKeyId(key.id)} className="cursor-pointer text-[#94A3B8] hover:bg-[#1A2035] hover:text-[#F8FAFC] focus:bg-[#1A2035] focus:text-[#F8FAFC]">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingKeyId(key.id)} className="cursor-pointer text-[#94A3B8] hover:bg-[#1A2035] hover:text-[#F8FAFC] focus:bg-[#1A2035] focus:text-[#F8FAFC]">
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#1E293B]" />
                        <DropdownMenuItem
                          onClick={() => setSelectedKeyId(key.id)}
                          className="cursor-pointer text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-[#1E293B] bg-[#111827]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
                <Key className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No hay claves en este entorno</h3>
              <p className="mb-6 text-center text-[#94A3B8]">
                No se encontraron claves para el filtro seleccionado
              </p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card className="border-[#1E293B] bg-[#111827]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
              <Key className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No hay claves</h3>
            <p className="mb-6 text-center text-[#94A3B8]">
              Crea tu primera API key para este proyecto
            </p>
            <Button
              onClick={() => setShowCreateKeyDialog(true)}
              className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold shadow-lg shadow-amber-500/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Clave
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Members Section */}
      <Card className="border-[#1E293B] bg-[#111827]">
        <CardContent className="p-5">
          {user && <MembersManager projectId={id} currentUserId={user.id} />}
        </CardContent>
      </Card>

      {/* Create Key Dialog */}
      <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
        <DialogContent className="sm:max-w-2xl border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Clave</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Se generará una API key automáticamente
            </DialogDescription>
          </DialogHeader>
          <KeyForm onSuccess={() => setShowCreateKeyDialog(false)} defaultProjectId={id} />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProjectDialog} onOpenChange={setShowEditProjectDialog}>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Editar Proyecto</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Actualiza la información del proyecto
            </DialogDescription>
          </DialogHeader>
          <ProjectEditForm project={project} onSuccess={() => setShowEditProjectDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* View Key Dialog */}
      <Dialog open={!!viewingKeyId} onOpenChange={() => setViewingKeyId(null)}>
        <DialogContent className="sm:max-w-2xl border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Detalle de Clave</DialogTitle>
          </DialogHeader>
          {viewingKeyId && <KeyDetail id={viewingKeyId} />}
        </DialogContent>
      </Dialog>

      {/* Edit Key Dialog */}
      <Dialog open={!!editingKeyId} onOpenChange={() => setEditingKeyId(null)}>
        <DialogContent className="sm:max-w-2xl border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Editar Clave</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Actualiza la información de la clave
            </DialogDescription>
          </DialogHeader>
          {editingKeyId && (() => {
            const keyToEdit = project.keys.find((k) => k.id === editingKeyId)
            if (!keyToEdit) return null
            return <KeyEditForm apiKey={keyToEdit} onSuccess={() => setEditingKeyId(null)} />
          })()}
        </DialogContent>
      </Dialog>

      {/* Delete Key Dialog */}
      <Dialog open={!!selectedKeyId} onOpenChange={() => setSelectedKeyId(null)}>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Eliminar Clave</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              ¿Estás seguro? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSelectedKeyId(null)} className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
              onClick={() => {
                if (selectedKeyId) {
                  deleteKey.mutate(selectedKeyId, {
                    onSuccess: () => setSelectedKeyId(null),
                  })
                }
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const environmentConfig: Record<string, { label: string; color: string }> = {
  DEVELOPMENT: { label: 'Dev', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  STAGING: { label: 'Staging', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  QA: { label: 'QA', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  PRODUCTION: { label: 'Prod', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

function EnvironmentBadge({ environment }: { environment: string }) {
  const config = environmentConfig[environment] || environmentConfig.DEVELOPMENT
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", config.color)}>
      {config.label}
    </span>
  )
}
