'use client'

import { useQuery } from '@tanstack/react-query'

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  twoFactorEnabled: boolean
}

export function useSession() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session')
      if (!res.ok) return null
      const data = await res.json()
      return data?.user || null
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  return {
    user: data as User | null,
    isLoading,
    isAuthenticated: !!data,
    error,
  }
}
