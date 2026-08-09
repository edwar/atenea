'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateKey } from '@/hooks/useKeys'
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

const environments = [
  { value: 'DEVELOPMENT', label: 'Development', color: 'bg-amber-500/10 text-amber-400' },
  { value: 'STAGING', label: 'Staging', color: 'bg-sky-500/10 text-sky-400' },
  { value: 'QA', label: 'QA', color: 'bg-purple-500/10 text-purple-400' },
  { value: 'PRODUCTION', label: 'Production', color: 'bg-emerald-500/10 text-emerald-400' },
]

const keySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  environment: z.string().min(1),
})

type KeyFormData = z.infer<typeof keySchema>

interface KeyEditFormProps {
  apiKey: {
    id: string
    name: string
    description: string | null
    environment: string
  }
  onSuccess?: () => void
}

export function KeyEditForm({ apiKey, onSuccess }: KeyEditFormProps) {
  const updateKey = useUpdateKey()

  const form = useForm<KeyFormData>({
    resolver: zodResolver(keySchema),
    defaultValues: {
      name: apiKey.name,
      description: apiKey.description || '',
      environment: apiKey.environment,
    },
  })

  useEffect(() => {
    form.reset({
      name: apiKey.name,
      description: apiKey.description || '',
      environment: apiKey.environment,
    })
  }, [apiKey, form])

  const onSubmit = (data: KeyFormData) => {
    updateKey.mutate(
      { id: apiKey.id, data },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#94A3B8]">Nombre</FormLabel>
              <FormControl>
                <Input {...field} className="bg-[#0A0E17] border-[#1E293B]" />
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
                <Textarea {...field} className="bg-[#0A0E17] border-[#1E293B]" />
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                items={environments.map((env) => ({ value: env.value, label: env.label }))}
              >
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={updateKey.isPending} className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold disabled:opacity-50">
            {updateKey.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
