'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useProjects, useDeleteProject } from '@/hooks/useProjects'
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
import { Plus, MoreVertical, FolderOpen, Trash2, Key, Users, UserPlus } from 'lucide-react'
import { ProjectForm } from '@/components/projects/project-form'
import { MembersManager } from '@/components/projects/members-manager'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useSession } from '@/hooks/useSession'

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()
  const { user } = useSession()
  const deleteProject = useDeleteProject()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [inviteProjectId, setInviteProjectId] = useState<string | null>(null)
  const [inviteProjectName, setInviteProjectName] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-[#1A2035]" />
          <Skeleton className="h-10 w-32 bg-[#1A2035]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-[#1A2035]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-[#94A3B8]">
            Selecciona un proyecto para ver sus claves
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold shadow-lg shadow-amber-500/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Card key={project.id} className={cn("group relative h-full cursor-pointer border-[#1E293B] bg-[#111827] transition-all duration-300 hover:border-[#334155] hover:bg-[#1A2035] hover-lift animate-slide-up opacity-0", `stagger-${Math.min(i + 1, 5)}`)}>
              <CardContent className="px-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
                    <FolderOpen className="h-5 w-5 text-amber-400" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      onClick={(e) => e.preventDefault()}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#2f323a]"
                    >
                      <MoreVertical className="h-4 w-4 text-[#64748B]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-full border-[#1E293B] bg-[#111827]">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          setInviteProjectId(project.id)
                          setInviteProjectName(project.name)
                        }}
                        className="flex cursor-pointer text-[#94A3B8] hover:bg-[#1A2035] hover:text-[#F8FAFC] focus:bg-[#1A2035] focus:text-[#F8FAFC]"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span className="w-full">Invitar miembros</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#1E293B]" />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedProjectId(project.id)
                        }}
                        className="cursor-pointer text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Link href={`/projects/${project.id}`} className="block">
                  <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
                  <p className="line-clamp-2 text-sm text-[#94A3B8] mb-4">
                    {project.description || 'Sin descripción'}
                  </p>
                </Link>

                <div className="flex items-center gap-4 text-sm text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    {project._count.keys} claves
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {project._count.members} miembros
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#64748B]">
                  {formatDate(project.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-[#1E293B] bg-[#111827]">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400/20 to-amber-600/20">
              <FolderOpen className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No hay proyectos</h3>
            <p className="mb-6 text-center text-[#94A3B8]">
              Crea tu primer proyecto para organizar tus claves
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold shadow-lg shadow-amber-500/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Crea un proyecto para organizar tus API keys
            </DialogDescription>
          </DialogHeader>
          <ProjectForm onSuccess={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Invite Members Dialog */}
      <Dialog open={!!inviteProjectId} onOpenChange={() => setInviteProjectId(null)}>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Invitar Miembros - {inviteProjectName}</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Invita a usuarios para que colaboren en este proyecto
            </DialogDescription>
          </DialogHeader>
          {inviteProjectId && user && <MembersManager projectId={inviteProjectId} currentUserId={user.id} />}
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={!!selectedProjectId} onOpenChange={() => setSelectedProjectId(null)}>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Eliminar Proyecto</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              ¿Estás seguro? Todas las claves asociadas también serán eliminadas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSelectedProjectId(null)} className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer bg-rose-500 hover:bg-rose-600 text-white"
              onClick={() => {
                if (selectedProjectId) {
                  deleteProject.mutate(selectedProjectId, {
                    onSuccess: () => setSelectedProjectId(null),
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
