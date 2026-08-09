'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'

interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

export function useProjectMembers(projectId: string) {
  return useQuery<ProjectMember[]>({
    queryKey: ['projectMembers', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/members`)
      if (!res.ok) throw new Error('Failed to fetch members')
      return res.json()
    },
    enabled: !!projectId,
  })
}

export function useAddProjectMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, email, role }: { projectId: string; email: string; role: string }) => {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add member')
      return data
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      sileo.success({ title: 'Miembro agregado exitosamente' })
    },
    onError: (error: Error) => {
      sileo.error({ title: error.message || 'Error al agregar miembro' })
    },
  })
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const res = await fetch(`/api/projects/${projectId}/members?userId=${userId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to remove member')
      return res.json()
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      sileo.success({ title: 'Miembro eliminado exitosamente' })
    },
    onError: () => {
      sileo.error({ title: 'Error al eliminar miembro' })
    },
  })
}

export function useTransferOwnership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const res = await fetch(`/api/projects/${projectId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) throw new Error('Failed to transfer ownership')
      return res.json()
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] })
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      sileo.success({ title: 'Propiedad transferida exitosamente' })
    },
    onError: () => {
      sileo.error({ title: 'Error al transferir la propiedad' })
    },
  })
}
