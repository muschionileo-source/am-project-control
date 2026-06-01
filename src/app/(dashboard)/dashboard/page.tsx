'use client'

import { RefreshCw, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const dateStr = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
}).format(new Date()).replace(/^\w/, c => c.toUpperCase())

const PROJECTS = [
  { name: '[DOURADOS] Pavimentação Flexível', progress: 0 },
  { name: 'Rio Verde - Entrega 30% armazenagem de grãos', progress: 0 },
  { name: 'Estudo Guindastes - NMT - RVD - RDN REV01', progress: 0 },
]

const kpis = [
  {
    label: 'Restrições Abertas', value: 0, color: 'text-red-500', bg: 'bg-red-100',
    icon: '🔴', sub: 'Em dia', subColor: 'text-emerald-500',
  },
  {
    label: 'Atividades a Fazer', value: 0, color: 'text-blue-500', bg: 'bg-blue-100',
    icon: '⚡', sub: '', subColor: '',
  },
  {
    label: 'Aprovações Pendentes', value: 0, color: 'text-green-500', bg: 'bg-green-100',
    icon: '✅', sub: 'Nenhuma pendente', subColor: 'text-emerald-500',
  },
  {
    label: 'Paradas Ativas', value: 0, color: 'text-amber-500', bg: 'bg-amber-100',
    icon: '⚠️', sub: 'Frota operacional', subColor: 'text-emerald-500',
  },
]

function SectionCard({ title, badge, children }: { title: string; badge?: number; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{title}</span>
        {badge !== undefined && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${badge > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting()}, {user?.name ?? 'Admin'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Aqui está um resumo do que está acontecendo hoje.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{dateStr}</span>
          <button className="p-1.5 rounded text-gray-400 hover:bg-gray-100 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon, sub, subColor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow cursor-pointer group">
            <div className="text-2xl shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 truncate">{label}</p>
              {sub && <p className={`text-xs font-medium ${subColor}`}>{sub}</p>}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          <SectionCard title="Restrições Abertas" badge={0}>
            <p className="text-sm text-gray-400 text-center py-2">✓ Nenhuma restrição aberta para você</p>
          </SectionCard>

          <SectionCard title="Atividades em Andamento" badge={0}>
            <p className="text-sm text-gray-400 text-center py-2">Nenhuma atividade atribuída a você</p>
          </SectionCard>

          <SectionCard title="Aprovações Pendentes" badge={0}>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">🔧</span>
                  <span className="text-xs font-medium text-gray-500">MEDIÇÕES</span>
                  <span className="text-[10px] bg-blue-50 text-blue-500 border border-blue-200 px-1.5 py-0.5 rounded font-medium">EM BREVE</span>
                </div>
                <span className="text-xs text-gray-300">—</span>
              </div>
              <p className="text-xs text-gray-400 text-center py-1 italic">Funcionalidade em desenvolvimento</p>
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <SectionCard title="Progresso do Projeto" badge={PROJECTS.length}>
            <div className="space-y-3">
              {PROJECTS.map(p => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700 font-medium leading-snug flex-1 pr-4">{p.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{p.progress}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full">
                    <div className="h-1 bg-am-navy rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Esta Semana" badge={0}>
            <p className="text-sm text-gray-400 text-center py-2 italic">Nada previsto para esta semana</p>
          </SectionCard>

          <SectionCard title="Paradas Ativas" badge={0}>
            <p className="text-sm text-gray-400 text-center py-2">Nenhuma parada ativa</p>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
