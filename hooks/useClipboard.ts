'use client'

import { useState, useCallback } from 'react'
import { sileo } from 'sileo'

export function useClipboard() {
  const [isCopied, setIsCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      sileo.success({ title: 'Copiado al portapapeles' })
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      sileo.error({ title: 'Error al copiar' })
    }
  }, [])

  return { copy, isCopied }
}
