import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function generateEnvExport(keys: { name: string; value: string }[]): string {
  return keys.map(({ name, value }) => `${name}=${value}`).join('\n')
}

export function parseEnvFile(content: string): { name: string; value: string }[] {
  return content
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => {
      const [name, ...valueParts] = line.split('=')
      return {
        name: name.trim(),
        value: valueParts.join('=').trim(),
      }
    })
}
