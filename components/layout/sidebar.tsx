'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { X, LayoutDashboard, FolderOpen, History } from 'lucide-react'

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

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  const content = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-[#1E293B] px-6">
        <div className="flex items-center gap-2.5">
          <Logo size="md" />
          <span className="text-lg font-bold tracking-tight">Atenea</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC] md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200',
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
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-[#1E293B] bg-[#0A0E17] md:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {onClose && (
        <div className={cn('fixed inset-0 z-50 md:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}>
          {/* Backdrop */}
          <div
            className={cn(
              'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
              open ? 'opacity-100' : 'opacity-0'
            )}
            onClick={onClose}
          />
          {/* Drawer */}
          <aside
            className={cn(
              'absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-[#1E293B] bg-[#0A0E17] shadow-2xl transition-transform duration-300 ease-out',
              open ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
