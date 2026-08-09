'use client'

import { useKey, useCopyKeyValue, useUpdateKey } from '@/hooks/useKeys'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Copy, Eye, EyeOff, Save, Key } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '@/lib/utils'

interface KeyDetailProps {
  id: string
}

export function KeyDetail({ id }: KeyDetailProps) {
  const { data: key, isLoading } = useKey(id)
  const copyKeyValue = useCopyKeyValue()
  const updateKey = useUpdateKey()
  const [showValue, setShowValue] = useState(false)
  const [decryptedValue, setDecryptedValue] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')

  const fetchValue = async () => {
    if (decryptedValue) {
      setDecryptedValue(null)
      setShowValue(false)
      return
    }
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'POST' })
      const data = await res.json()
      setDecryptedValue(data.value)
      setShowValue(true)
    } catch {}
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!key) {
    return <p className="text-sm text-muted-foreground">Clave no encontrada</p>
  }

  const handleSaveName = () => {
    updateKey.mutate(
      { id: key.id, data: { name } },
      { onSuccess: () => setEditingName(false) }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {editingName ? (
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 w-64"
              />
              <Button size="sm" onClick={handleSaveName}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-medium">{key.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setName(key.name)
                  setEditingName(true)
                }}
              >
                Editar
              </Button>
            </>
          )}
        </div>
      </div>

      {key.description && (
        <p className="text-sm text-muted-foreground">{key.description}</p>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Creada {formatDate(key.createdAt)}
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">API Key</label>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 rounded-lg border p-3 bg-muted/50">
            <Key className="h-4 w-4 text-muted-foreground" />
            <code className="text-sm font-mono">{key.key}</code>
          </div>
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(key.key)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Valor</label>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={showValue && decryptedValue ? decryptedValue : '••••••••••••••••••••••••••••••••'}
            readOnly
            className="font-mono"
          />
          <Button variant="outline" onClick={fetchValue}>
            {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => copyKeyValue.mutate({ id: key.id })}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
