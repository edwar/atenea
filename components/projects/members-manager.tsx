'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useProjectMembers, useAddProjectMember, useRemoveProjectMember, useTransferOwnership } from '@/hooks/useMembers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { UserPlus, MoreVertical, Trash2, Users, Crown } from 'lucide-react'

const roleLabels: Record<string, string> = {
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
  VIEWER: 'Visualizador',
}

const roleColors: Record<string, string> = {
  OWNER: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ADMIN: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  VIEWER: 'bg-[#1E293B] text-[#94A3B8] border-[#334155]',
}

interface MembersManagerProps {
  projectId: string
  currentUserId: string
}

export function MembersManager({ projectId, currentUserId }: MembersManagerProps) {
  const { data: members, isLoading } = useProjectMembers(projectId)
  const addMember = useAddProjectMember()
  const removeMember = useRemoveProjectMember()
  const transferOwnership = useTransferOwnership()
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('VIEWER')

  const currentUserRole = useMemo(() => {
    const current = members?.find((m) => m.userId === currentUserId)
    return current?.role || 'VIEWER'
  }, [members, currentUserId])

  const isOwner = currentUserRole === 'OWNER'
  const isAdmin = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN'
  const canEdit = isAdmin

  const handleInvite = () => {
    if (!email) return
    addMember.mutate(
      { projectId, email, role },
      {
        onSuccess: () => {
          setEmail('')
          setRole('VIEWER')
          setShowInviteDialog(false)
        },
      }
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-400" />
          <h3 className="font-medium">Miembros del Proyecto</h3>
          {members && (
            <span className="text-sm text-[#64748B]">({members.length})</span>
          )}
        </div>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInviteDialog(true)}
            className="cursor-pointer border-[#1E293B] bg-[#111827] hover:bg-[#1A2035] text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            <UserPlus className="mr-2 h-3.5 w-3.5" />
            Invitar
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#0A0E17] p-3">
              <div className="h-10 w-10 rounded-full bg-[#1A2035] animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-[#1A2035] rounded animate-pulse" />
                <div className="h-3 w-24 bg-[#1A2035] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : members && members.length > 0 ? (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col gap-3 rounded-xl border border-[#1E293B] bg-[#0A0E17] p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={member.user.image || undefined} alt={member.user.name || ''} />
                  <AvatarFallback className="bg-linear-to-br from-amber-400/20 to-amber-600/20 text-amber-400 text-sm font-medium">
                    {member.user.name
                      ? member.user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
                      : member.user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{member.user.name || member.user.email}</p>
                  <p className="truncate text-xs text-[#64748B]">{member.user.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end">
                <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", roleColors[member.role])}>
                  {member.role === 'OWNER' && <Crown className="h-3.5 w-3.5" />}
                  {roleLabels[member.role] || member.role}
                </span>
                {canEdit && member.userId !== currentUserId && member.role !== 'OWNER' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-[#64748B] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-[#1E293B] bg-[#111827]">
                      {isOwner && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              if (confirm(`¿Transferir la propiedad del proyecto a ${member.user.name || member.user.email}?`)) {
                                transferOwnership.mutate({ projectId, userId: member.userId })
                              }
                            }}
                            className="cursor-pointer text-amber-400 hover:bg-amber-500/10 hover:text-amber-400 focus:bg-amber-500/10 focus:text-amber-400"
                          >
                            <Crown className="mr-2 h-4 w-4" />
                            Transferir propiedad
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#1E293B]" />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => removeMember.mutate({ projectId, userId: member.userId })}
                        className="cursor-pointer text-rose-400 hover:bg-rose-500/10 hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#64748B] text-center py-4">
          No hay miembros adicionales. Invita a tu equipo para colaborar.
        </p>
      )}

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Invitar Miembro</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Invita a un usuario por su correo electrónico
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#94A3B8]">Correo electrónico</label>
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#0A0E17] border-[#1E293B]"
              />
            </div>
              <div className="space-y-2">
                <label className="text-sm text-[#94A3B8]">Rol</label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v ?? 'VIEWER')}
                  items={[
                    { value: 'VIEWER', label: 'Visualizador' },
                    ...(isOwner ? [{ value: 'ADMIN', label: 'Administrador' }] : []),
                  ]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEWER">Visualizador</SelectItem>
                    {isOwner && <SelectItem value="ADMIN">Administrador</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowInviteDialog(false)}
                className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!email || addMember.isPending}
                className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold disabled:opacity-50"
              >
                {addMember.isPending ? 'Invitando...' : 'Invitar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
