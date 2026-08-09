'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateKey } from '@/hooks/useKeys'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RefreshCw, FolderOpen } from 'lucide-react'

type Algorithm = 'hex-32' | 'hex-64' | 'uuid' | 'base64' | 'nanoid' | 'alphnum'

const algorithms: { value: Algorithm; label: string; description: string }[] = [
  { value: 'hex-32', label: 'Hex 32 bytes', description: '64 caracteres hexadecimales' },
  { value: 'hex-64', label: 'Hex 64 bytes', description: '128 caracteres hexadecimales' },
  { value: 'uuid', label: 'UUID v4', description: 'Formato estándar UUID' },
  { value: 'base64', label: 'Base64', description: '44 caracteres en base64' },
  { value: 'nanoid', label: 'NanoID', description: '21 caracteres alfanuméricos' },
  { value: 'alphnum', label: 'Alfanumérico', description: '32 caracteres [a-zA-Z0-9]' },
]

const environments = [
  { value: 'DEVELOPMENT', label: 'Development', color: 'bg-amber-500/10 text-amber-400' },
  { value: 'STAGING', label: 'Staging', color: 'bg-sky-500/10 text-sky-400' },
  { value: 'QA', label: 'QA', color: 'bg-purple-500/10 text-purple-400' },
  { value: 'PRODUCTION', label: 'Production', color: 'bg-emerald-500/10 text-emerald-400' },
]

function generateKey(algorithm: Algorithm): string {
  switch (algorithm) {
    case 'hex-32': {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
    }
    case 'hex-64': {
      const array = new Uint8Array(64)
      crypto.getRandomValues(array)
      return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
    }
    case 'uuid': {
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)
      array[6] = (array[6] & 0x0f) | 0x40
      array[8] = (array[8] & 0x3f) | 0x80
      const hex = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    }
    case 'base64': {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return btoa(String.fromCharCode(...array))
    }
    case 'nanoid': {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const array = new Uint8Array(21)
      crypto.getRandomValues(array)
      return Array.from(array, (b) => chars[b % chars.length]).join('')
    }
    case 'alphnum': {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return Array.from(array, (b) => chars[b % chars.length]).join('')
    }
  }
}

const keySchema = z.object({
  projectId: z.string().min(1),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  environment: z.string().min(1),
  value: z.string().min(1),
})

type KeyFormData = z.infer<typeof keySchema>

interface KeyFormProps {
  onSuccess?: () => void
  defaultProjectId?: string
}

export function KeyForm({ onSuccess, defaultProjectId }: KeyFormProps) {
  const { data: projects } = useProjects()
  const createKey = useCreateKey()
  const [algorithm, setAlgorithm] = useState<Algorithm>('hex-32')

  const form = useForm<KeyFormData>({
    resolver: zodResolver(keySchema),
    defaultValues: {
      projectId: defaultProjectId || '',
      name: '',
      description: '',
      environment: 'DEVELOPMENT',
      value: '',
    },
  })

  useEffect(() => {
    form.setValue('value', generateKey(algorithm))
  }, [form, algorithm])

  const regenerateValue = () => {
    form.setValue('value', generateKey(algorithm))
  }

  const onSubmit = (data: KeyFormData) => {
    createKey.mutate(data, {
      onSuccess: () => {
        form.reset()
        onSuccess?.()
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {defaultProjectId ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#94A3B8]">Proyecto</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#1E293B] bg-[#0A0E17] p-3">
              <FolderOpen className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-[#F8FAFC]">{projects?.find((p) => p.id === defaultProjectId)?.name || 'Proyecto'}</span>
            </div>
            <input type="hidden" {...form.register('projectId')} />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#94A3B8]">Proyecto</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#94A3B8]">Nombre de la clave</FormLabel>
              <FormControl>
                <Input placeholder="Ej: API Key Principal, Backend Auth" {...field} className="bg-[#0A0E17] border-[#1E293B]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#94A3B8]">Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe para qué se usa esta clave" {...field} className="bg-[#0A0E17] border-[#1E293B]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="environment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#94A3B8]">Ambiente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el ambiente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env.value} value={env.value}>
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", env.color.split(' ')[0])} />
                        {env.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {algorithms.map((alg) => (
                  <SelectItem key={alg.value} value={alg.value}>
                    <div>
                      <p className="font-medium">{alg.label}</p>
                      <p className="text-xs text-[#64748B]">{alg.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={regenerateValue} className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
            <RefreshCw className="mr-2 h-3 w-3" />
            Regenerar
          </Button>
        </div>

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#94A3B8]">Valor</FormLabel>
              <FormControl>
                <Input type="password" readOnly {...field} className="font-code bg-[#0A0E17] border-[#1E293B]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={createKey.isPending || (!defaultProjectId && !form.watch('projectId'))} className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold disabled:opacity-50">
            {createKey.isPending ? 'Creando...' : 'Crear Clave'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
