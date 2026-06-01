'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, Circle, AlertCircle, Clock, Search, Plus, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { mockEngagements } from '@/lib/mock-data'
import { formatDateShort, taskStatusConfig, taskPriorityConfig, daysUntil } from '@/lib/utils'
import type { Deliverable } from '@/types'

const allDeliverables: (Deliverable & { clientName: string })[] = mockEngagements.flatMap(e =>
  e.deliverables.map(d => ({ ...d, clientName: e.client }))
)

export default function TasksPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filtered = useMemo(() =>
    allDeliverables.filter(d => {
      const matchSearch = search === '' || d.title.toLowerCase().includes(search.toLowerCase()) || d.clientName.toLowerCase().includes(search.toLowerCase()) || d.assignedTo.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      const matchPriority = priorityFilter === 'all' || d.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    }),
    [search, statusFilter, priorityFilter]
  )

  const grouped = {
    pending: filtered.filter(d => d.status === 'pending'),
    in_progress: filtered.filter(d => d.status === 'in_progress'),
    review: filtered.filter(d => d.status === 'review'),
    completed: filtered.filter(d => d.status === 'completed'),
    blocked: filtered.filter(d => d.status === 'blocked'),
  }

  const stats = {
    total: allDeliverables.length,
    inProgress: allDeliverables.filter(d => d.status === 'in_progress').length,
    overdue: allDeliverables.filter(d => d.status !== 'completed' && daysUntil(d.dueDate) < 0).length,
    completed: allDeliverables.filter(d => d.status === 'completed').length,
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atividades</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestão de entregas e tarefas de todos os engagements</p>
        </div>
        <Button className="gap-2 self-start">
          <Plus className="w-4 h-4" />
          Nova Atividade
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-700', bg: 'bg-gray-100' },
          { label: 'Em Andamento', value: stats.inProgress, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Atrasadas', value: stats.overdue, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Concluídas', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
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
            <Input placeholder="Buscar atividades..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="review">Em Revisão</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Kanban-style view */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {(Object.entries(grouped) as [string, typeof filtered][]).map(([status, tasks]) => (
          <div key={status} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${taskStatusConfig[status as keyof typeof taskStatusConfig].bg}`}>
                  {taskStatusConfig[status as keyof typeof taskStatusConfig].label}
                </span>
                <span className="text-xs text-gray-400">{tasks.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              {tasks.map(task => {
                const days = daysUntil(task.dueDate)
                const isOverdue = days < 0 && task.status !== 'completed'
                return (
                  <Card key={task.id} className="hover:shadow-card-hover transition-shadow duration-150">
                    <CardContent className="p-3 space-y-2">
                      <p className={`text-xs font-semibold leading-snug ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">{task.clientName}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-medium ${taskPriorityConfig[task.priority].color}`}>
                          {taskPriorityConfig[task.priority].label}
                        </span>
                        <span className={`text-[10px] ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                          {isOverdue ? `${Math.abs(days)}d atrasado` : formatDateShort(task.dueDate)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate">{task.assignedTo}</p>
                    </CardContent>
                  </Card>
                )
              })}
              {tasks.length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-300">Nenhuma atividade</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
