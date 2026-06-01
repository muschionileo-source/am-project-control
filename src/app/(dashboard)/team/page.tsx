'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Mail, MapPin, Briefcase, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { mockUsers } from '@/lib/mock-data'
import { levelConfig, practiceAreaConfig } from '@/lib/utils'

export default function TeamPage() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [practiceFilter, setPracticeFilter] = useState('all')

  const filtered = useMemo(() =>
    mockUsers.filter(u => {
      const matchSearch = search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
      const matchLevel = levelFilter === 'all' || u.level === levelFilter
      const matchPractice = practiceFilter === 'all' || u.practiceArea === practiceFilter
      return matchSearch && matchLevel && matchPractice
    }),
    [search, levelFilter, practiceFilter]
  )

  const avgUtil = Math.round(mockUsers.reduce((s, u) => s + u.utilization, 0) / mockUsers.length)
  const overutilized = mockUsers.filter(u => u.utilization >= 95).length

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockUsers.length} consultores · {avgUtil}% utilização média</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="w-4 h-4" />
          Adicionar Consultor
        </Button>
      </div>

      {/* Team stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total de Consultores', value: mockUsers.length },
          { label: 'Utilização Média', value: `${avgUtil}%` },
          { label: 'Sobreutilizados (≥95%)', value: overutilized },
          { label: 'Áreas de Prática', value: new Set(mockUsers.map(u => u.practiceArea)).size },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar consultor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="h-9 w-48">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="managing_director">Managing Director</SelectItem>
              <SelectItem value="senior_director">Senior Director</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="associate">Associate</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
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
        </CardContent>
      </Card>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(user => (
          <Card key={user.id} className="hover:shadow-card-hover transition-all duration-200 cursor-pointer group">
            <CardContent className="p-5 space-y-4">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11 shrink-0">
                  <AvatarFallback className="text-sm bg-am-navy text-white font-semibold">
                    {user.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{levelConfig[user.level].label}</p>
                </div>
              </div>

              {/* Practice + Office */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className={`font-medium ${practiceAreaConfig[user.practiceArea].color} truncate`}>
                    {practiceAreaConfig[user.practiceArea].label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{user.office}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              {/* Utilization */}
              <div className="space-y-1.5 pt-2 border-t border-gray-50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Utilização
                  </span>
                  <span className={`font-bold ${user.utilization >= 95 ? 'text-red-500' : user.utilization >= 85 ? 'text-emerald-600' : 'text-gray-700'}`}>
                    {user.utilization}%
                  </span>
                </div>
                <Progress
                  value={user.utilization}
                  className="h-1.5"
                  indicatorClassName={user.utilization >= 95 ? 'bg-red-400' : user.utilization >= 85 ? 'bg-emerald-500' : undefined}
                />
              </div>

              {/* Active engagements badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Engagements ativos</span>
                <span className="font-bold text-gray-700">{user.activeEngagements}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">Nenhum consultor encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros</p>
        </div>
      )}
    </div>
  )
}
