'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sileo } from 'sileo'

interface ApiKey {
  id: string
  name: string
  description: string | null
  key: string
  environment: string
  projectId: string
  ownerUserId: string
  createdAt: string
  updatedAt: string
  project: {
    id: string
    name: string
  }
  owner: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface ApiKeyDetail extends ApiKey {
  value: string
}

interface CreateKeyInput {
  name: string
  description?: string
  projectId: string
  value: string
  environment?: string
}

interface UpdateKeyInput {
  name?: string
  description?: string
  value?: string
  environment?: string
}

export function useKeys(projectId?: string) {
  return useQuery<ApiKey[]>({
    queryKey: ['keys', projectId],
    queryFn: async () => {
      const params = projectId ? `?projectId=${projectId}` : ''
      const res = await fetch(`/api/keys${params}`)
      if (!res.ok) throw new Error('Failed to fetch keys')
      return res.json()
    },
  })
}

export function useKey(id: string) {
  return useQuery<ApiKeyDetail>({
    queryKey: ['key', id],
    queryFn: async () => {
      const res = await fetch(`/api/keys/${id}`)
      if (!res.ok) throw new Error('Failed to fetch key')
      return res.json()
    },
    enabled: !!id,
  })
}

export function useCreateKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateKeyInput) => {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create key')
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['keys'] })
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      sileo.success({ title: 'Clave creada exitosamente' })
    },
    onError: () => {
      sileo.error({ title: 'Error al crear la clave' })
    },
  })
}

export function useUpdateKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateKeyInput }) => {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update key')
      return res.json()
    },
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: ['keys'] })
      queryClient.invalidateQueries({ queryKey: ['key', id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      sileo.success({ title: 'Clave actualizada exitosamente' })
    },
    onError: () => {
      sileo.error({ title: 'Error al actualizar la clave' })
    },
  })
}

export function useDeleteKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete key')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      sileo.success({ title: 'Clave eliminada exitosamente' })
    },
    onError: () => {
      sileo.error({ title: 'Error al eliminar la clave' })
    },
  })
}

export function useCopyKeyValue() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/keys/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to copy key value')
      const data = await res.json()
      return `${data.key}="${data.value}"`
    },
    onSuccess: (formatted) => {
      navigator.clipboard.writeText(formatted)
      sileo.success({ title: 'Clave copiada al portapapeles' })
    },
    onError: () => {
      sileo.error({ title: 'Error al copiar la clave' })
    },
  })
}
