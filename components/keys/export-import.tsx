'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Download, Upload, FileJson, Clipboard } from 'lucide-react'
import { sileo } from 'sileo'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ExportImportProps {
  projectId: string
  projectName: string
}

export function ExportImport({ projectId, projectName }: ExportImportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [showPasteDialog, setShowPasteDialog] = useState(false)
  const [pasteContent, setPasteContent] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportEnv = async () => {
    try {
      const res = await fetch(`/api/keys/export?projectId=${projectId}&format=env`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-keys.env`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      sileo.success({ title: 'Archivo .env exportado' })
    } catch {
      sileo.error({ title: 'Error al exportar' })
    }
  }

  const handleExportJson = async () => {
    try {
      const res = await fetch(`/api/keys/export?projectId=${projectId}&format=json`)
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-keys.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      sileo.success({ title: 'Archivo JSON exportado' })
    } catch {
      sileo.error({ title: 'Error al exportar' })
    }
  }

  const importKeys = async (keys: { name: string; value: string }[]) => {
    if (keys.length === 0) {
      sileo.error({ title: 'No se encontraron claves' })
      return
    }

    const res = await fetch('/api/keys/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys, projectId }),
    })

    const data = await res.json()
    sileo.success({ title: `${data.imported.length} claves importadas` })
    window.location.reload()
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const content = await file.text()
      const keys = parseEnvContent(content)

      if (keys.length === 0) {
        sileo.error({ title: 'No se encontraron claves en el archivo' })
        return
      }

      await importKeys(keys)
    } catch (error) {
      console.error('Import error:', error)
      sileo.error({ title: 'Error al importar el archivo' })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handlePasteImport = async () => {
    if (!pasteContent.trim()) {
      sileo.error({ title: 'Pega el contenido del archivo .env' })
      return
    }

    const keys = parseEnvContent(pasteContent)
    if (keys.length === 0) {
      sileo.error({ title: 'No se encontraron claves en el contenido' })
      return
    }

    await importKeys(keys)
    setPasteContent('')
    setShowPasteDialog(false)
  }

  const parseEnvContent = (content: string): { name: string; value: string }[] => {
    return content
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim()
        return trimmed && !trimmed.startsWith('#')
      })
      .map((line) => {
        const eqIndex = line.indexOf('=')
        if (eqIndex === -1) return null
        const name = line.substring(0, eqIndex).trim()
        let value = line.substring(eqIndex + 1).trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        return { name, value }
      })
      .filter((k): k is { name: string; value: string } => k !== null && k.name !== '' && k.value !== '')
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportEnv}
        className="cursor-pointer border-[#1E293B] bg-[#111827] hover:bg-[#1A2035] text-[#94A3B8] hover:text-[#F8FAFC]"
      >
        <Download className="mr-2 h-3.5 w-3.5" />
        Exportar .env
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportJson}
        className="cursor-pointer border-[#1E293B] bg-[#111827] hover:bg-[#1A2035] text-[#94A3B8] hover:text-[#F8FAFC]"
      >
        <FileJson className="mr-2 h-3.5 w-3.5" />
        Exportar JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileImport}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="cursor-pointer border-[#1E293B] bg-[#111827] hover:bg-[#1A2035] text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-50"
      >
        <Upload className="mr-2 h-3.5 w-3.5" />
        {isImporting ? 'Importando...' : 'Importar archivo'}
      </Button>
      <Dialog open={showPasteDialog} onOpenChange={setShowPasteDialog}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPasteDialog(true)}
          className="cursor-pointer border-[#1E293B] bg-[#111827] hover:bg-[#1A2035] text-[#94A3B8] hover:text-[#F8FAFC]"
        >
          <Clipboard className="mr-2 h-3.5 w-3.5" />
          Pegar .env
        </Button>
        <DialogContent className="border-[#1E293B] bg-[#111827]">
          <DialogHeader>
            <DialogTitle>Importar desde texto</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              Pega el contenido de tu archivo .env aquí
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder={`STRIPE_API_KEY=sk_live_1234567890\nOPENAI_API_KEY="sk-proj-abcdef"\nSENDGRID_KEY='sg.xyz123'`}
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            className="min-h-[200px] font-code text-sm bg-[#0A0E17] border-[#1E293B]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowPasteDialog(false)} className="cursor-pointer text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1A2035]">
              Cancelar
            </Button>
            <Button onClick={handlePasteImport} className="cursor-pointer bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0A0E17] font-semibold">
              Importar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
