import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-16 w-16',
  '2xl': 'h-24 w-24',
  '3xl': 'h-32 w-32',
  '4xl': 'h-48 w-48',
}

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Atenea"
      className={cn(sizeMap[size], className)}
    />
  )
}
