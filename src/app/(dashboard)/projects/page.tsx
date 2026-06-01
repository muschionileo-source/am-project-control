'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, ArrowUpDown, Briefcase,
  Calendar, DollarSign, Users, MoreHorizontal,
  TrendingUp, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockEngagements } from '@/lib/mock-data'
import {
  formatCurrencyShort, formatDateShort, statusConfig, practiceAreaConfig
} from '@/lib/utils'
import type { EngagementStatus, PracticeArea } from '@/types'

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [practiceFilter, setPracticeFilter] = useState<string>('all')
  const [view, setView] = useState<'table' | 'cards'>('cards')

  const filtered = useMemo(() => {
    return mockEngagements.filter(e => {
      const matchSearch = search === '' ||
        e.client.toLowerCase().includes(search.toLowerCase()) ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.code.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || e.status === statusFilter
      const matchPractice = practiceFilter === 'all' || e.practiceArea === practiceFilter
      return matchSearch && matchStatus && matchPractice
    })
  }, [search, statusFilter, practiceFilter])

  const stats = {
    total: mockEngagements.length,
    active: mockEngagements.filter(e => e.status === 'active').length,
    totalBudget: mockEngagements.reduce((s, e) => s + e.budget, 0),
    avgProgress: Math.round(mockEngagements.filter(e => e.status === 'active').reduce((s, e) => s + e.progress, 0) / mockEngagements.filter(e => e.status === 'active').length),
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} engagements · {stats.active} ativos</p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Novo Engagement
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total de Engagements', value: stats.total.toString(), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Em Andamento', value: stats.active.toString(), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Budget Total', value: formatCurrencyShort(stats.totalBudget), icon: DollarSign, color: 'text-am-gold', bg: 'bg-amber-50' },
          { label: 'Progresso Médio', value: `${stats.avgProgress}%`, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`${bg} ${color} w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, nome ou código..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="on_hold">Suspenso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={practiceFilter} onValueChange={setPracticeFilter}>
              <SelectTrigger className="h-9 w-48">
                <SelectValue placeholder="Área de Prática" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                <SelectItem value="restructuring">Reestruturação</SelectItem>
                <SelectItem value="performance">Melhoria de Desempenho</SelectItem>
                <SelectItem value="disputes">Disputas & Inv.</SelectItem>
                <SelectItem value="tax">Tributário</SelectItem>
                <SelectItem value="strategy">Estratégia</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:flex items-center gap-1 ml-auto">
              <span className="text-xs text-gray-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(eng => (
          <Link key={eng.id} href={`/projects/${eng.id}`}>
            <Card className="h-full hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{eng.code}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusConfig[eng.status].bg}`}>
                        {statusConfig[eng.status].label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-am-gold transition-colors">{eng.client}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{eng.name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-am-gold transition-colors shrink-0 mt-1" />
                </div>

                {/* Practice area */}
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-medium ${practiceAreaConfig[eng.practiceArea].color}`}>
                    {practiceAreaConfig[eng.practiceArea].label}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{eng.office}</span>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progresso</span>
                    <span className="font-semibold text-gray-700">{eng.progress}%</span>
                  </div>
                  <Progress value={eng.progress} className="h-1.5" />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Budget</p>
                    <p className="text-sm font-bold text-gray-800">{formatCurrencyShort(eng.budget)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Faturado</p>
                    <p className="text-sm font-bold text-gray-800">{formatCurrencyShort(eng.billedToDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Lead MD</p>
                    <p className="text-xs font-semibold text-gray-700 truncate">{eng.leadMD.split(' ')[0]} {eng.leadMD.split(' ')[1]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Prazo</p>
                    <p className="text-xs font-semibold text-gray-700">{formatDateShort(eng.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nenhum engagement encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  )
}
