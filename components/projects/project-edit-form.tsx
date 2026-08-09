'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const projectSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface ProjectEditFormProps {
  project: {
    id: string
    name: string
    description: string | null
  }
  onSuccess?: () => void
}

export function ProjectEditForm({ project, onSuccess }: ProjectEditFormProps) {
  const updateProject = useUpdateProject()

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || '',
    },
  })

  useEffect(() => {
    form.reset({
      name: project.name,
      description: project.description || '',
    })
  }, [project, form])

  const onSubmit = (data: ProjectFormData) => {
    updateProject.mutate(
      { id: project.id, data },
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={updateProject.isPending} className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold disabled:opacity-50">
            {updateProject.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
