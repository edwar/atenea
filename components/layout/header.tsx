'use client'

import { useSession } from '@/hooks/useSession'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, Menu } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useSession()

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1E293B] bg-[#0A0E17]/80 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Abrir menú"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC] md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="hidden md:block" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#334155] bg-[#111827] transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
            <AvatarFallback className="bg-linear-to-br from-amber-400/20 to-amber-600/20 text-amber-400 text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 border-[#1E293B] bg-[#111827]" align="end">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image || undefined} alt={user?.name || ''} />
              <AvatarFallback className="bg-linear-to-br from-amber-400/20 to-amber-600/20 text-amber-400 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium text-[#F8FAFC]">{user?.name}</p>
              <p className="text-xs text-[#64748B]">{user?.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-[#1E293B]" />
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer text-[#94A3B8] hover:bg-[#1A2035] hover:text-[#F8FAFC] focus:bg-[#1A2035] focus:text-[#F8FAFC]">
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator className="bg-[#1E293B]" />
          <DropdownMenuItem
            onClick={() => fetch('/api/auth/signout', { method: 'POST' }).then(() => window.location.href = '/')}
            className="cursor-pointer text-[#94A3B8] hover:bg-rose-500/10 hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
