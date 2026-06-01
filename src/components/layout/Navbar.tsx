'use client'

import { Bell, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AMInfraLogoCompact } from '@/components/shared/AMLogoFull'

interface NavbarProps {
  onMobileMenuToggle?: () => void
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  const { user, logout } = useAuth()

  return (
    <header
      className="h-14 flex items-center px-4 gap-4 sticky top-0 z-40 shrink-0"
      style={{ background: 'linear-gradient(90deg, #1B3461 0%, #1F3D75 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <AMInfraLogoCompact variant="light" />
      </div>

      {/* App name + version */}
      <div className="flex items-center gap-2 ml-2">
        <span className="text-white/80 font-semibold text-sm tracking-wide uppercase">Controle Obras</span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 text-white/60"
        >
          v1.0.0
        </span>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* User */}
        <div className="hidden sm:flex items-center gap-1.5 text-sm text-white/70">
          <span className="text-white/40 text-xs">Logado como</span>
          <span className="font-semibold text-white">{user?.name ?? 'Admin'}</span>
        </div>

        {/* Notification */}
        <button className="relative p-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Sair */}
        <button
          onClick={logout}
          className="text-xs font-semibold border border-white/30 text-white/80 hover:text-white hover:border-white/60 px-3 py-1.5 rounded transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
