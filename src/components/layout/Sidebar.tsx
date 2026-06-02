'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ChevronDown, ChevronRight, Crosshair, CalendarDays,
  List, Activity, AlertTriangle, BarChart2, TrendingUp, AlertOctagon, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const planejamentoItems = [
  { href: '/pull-planning', label: 'Pull Planning', icon: CalendarDays },
  { href: '/tasks', label: 'Atividades', icon: Activity },
  { href: '/tasks?view=restricoes', label: 'Restrições', icon: AlertTriangle },
]

const UNITS = ['Todas as unidades', 'Rio Verde', 'Dourados', 'São Paulo', 'Curitiba']

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [planejamentoOpen, setPlanejamentoOpen] = useState(true)
  const [unit, setUnit] = useState('Todas as unidades')
  const isAdmin = user?.id === 'admin'

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm shrink-0">
      {/* Unit selector */}
      <div className="px-3 pt-4 pb-3 border-b border-gray-100">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Unidade</p>
        <div className="relative">
          <select
            value={unit}
            onChange={e => setUnit(e.target.value)}
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-700 pr-7 focus:outline-none focus:ring-1 focus:ring-am-navy cursor-pointer"
          >
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* Central de Comando */}
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors mx-2 rounded-md',
            pathname === '/dashboard'
              ? 'bg-orange-50 text-orange-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          )}
        >
          <span className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
            pathname === '/dashboard' ? 'bg-orange-500' : 'bg-gray-300'
          )}>
            <Crosshair className="w-3 h-3 text-white" />
          </span>
          Central de Comando
        </Link>

        {/* Planejamento section */}
        <div className="mt-2">
          <button
            onClick={() => setPlanejamentoOpen(v => !v)}
            className="flex items-center justify-between w-full px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            Planejamento
            {planejamentoOpen
              ? <ChevronDown className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />
            }
          </button>

          {planejamentoOpen && (
            <div className="space-y-0.5">
              {planejamentoItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors mx-2 rounded-md',
                      active
                        ? 'bg-am-blue-pale text-am-navy'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', active ? 'text-am-navy' : 'text-gray-400')} />
                    {label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        {/* Auditoria — admin only */}
        {isAdmin && (
          <div className="mt-2 border-t border-gray-100 pt-2">
            <Link
              href="/auditoria"
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors mx-2 rounded-md',
                pathname === '/auditoria'
                  ? 'bg-am-blue-pale text-am-navy'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              )}
            >
              <Shield className={cn('w-4 h-4 shrink-0', pathname === '/auditoria' ? 'text-am-navy' : 'text-gray-400')} />
              Auditoria
            </Link>
          </div>
        )}
      </nav>
    </aside>
  )
}
