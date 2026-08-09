'use client'

import { useQuery } from '@tanstack/react-query'

interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  details: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface UseAuditOptions {
  entityType?: string
  entityId?: string
  limit?: number
}

export function useAudit({ entityType, entityId, limit = 50 }: UseAuditOptions = {}) {
  return useQuery<AuditLog[]>({
    queryKey: ['audit', entityType, entityId, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (entityType) params.set('entityType', entityType)
      if (entityId) params.set('entityId', entityId)
      params.set('limit', limit.toString())

      const res = await fetch(`/api/audit?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch audit logs')
      return res.json()
    },
  })
}
