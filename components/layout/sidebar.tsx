'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import {
  LayoutDashboard,
  FolderOpen,
  History,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Proyectos',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    name: 'Historial',
    href: '/audit',
    icon: History,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#1E293B] bg-[#0A0E17]">
      <div className="flex h-16 items-center gap-2.5 border-b border-[#1E293B] px-6">
        <Logo size="md" />
        <span className="text-lg font-bold tracking-tight">Atenea</span>
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/5'
                  : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
