'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Plus, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockEngagements } from '@/lib/mock-data'
import { formatDateShort, taskStatusConfig, taskPriorityConfig, daysUntil } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAudit } from '@/contexts/AuditContext'
import type { Deliverable } from '@/types'

// ── Types ────────────────────────────────────────────────────────────
interface Task {
  id: string
  title: string
  assignedTo: string
  dueDate: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked'
  clientName: string
}

const mockDeliverables: Task[] = mockEngagements.flatMap(e =>
  e.deliverables.map(d => ({
    id: d.id,
    title: d.title,
    assignedTo: d.assignedTo,
    dueDate: d.dueDate,
    priority: d.priority as Task['priority'],
    status: d.status as Task['status'],
    clientName: e.client,
  }))
)

// ── Nova Atividade Modal ─────────────────────────────────────────────
function NovaAtividadeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Task) => void }) {
  const [form, setForm] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    status: 'pending' as Task['status'],
    clientName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const id = `task${Date.now()}`
    const task: Task = { id, ...form }
    await supabase.from('tasks').insert({
      id,
      title: form.title,
      assigned_to: form.assignedTo,
      due_date: form.dueDate,
      priority: form.priority,
      status: form.status,
      client_name: form.clientName,
    })
    onAdd(task)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ background: '#1B3461' }}>
          <div>
            <h3 className="font-bold text-white">Nova Atividade</h3>
            <p className="text-xs text-white/50">Adicionar tarefa ao painel</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título *</label>
            <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Relatório de diagnóstico"
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Responsável</label>
              <input type="text" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                placeholder="Nome ou sigla"
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Entrega</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Prioridade</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task['priority'] }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy bg-white">
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Task['status'] }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy bg-white">
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="review">Em Revisão</option>
                <option value="completed">Concluído</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Cliente / Projeto</label>
            <input type="text" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
              placeholder="Ex: Rio Verde"
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-9 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 h-9 rounded-lg text-xs font-bold text-white hover:brightness-110 transition-all"
              style={{ background: '#1B3461' }}>
              + Adicionar Atividade
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────
export default function TasksPage() {
  const { logChange } = useAudit()
  const [tasks, setTasks] = useState<Task[]>(mockDeliverables)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Load tasks from Supabase on mount
  useEffect(() => {
    const loadTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
      if (data && data.length > 0) {
        const supabaseTasks: Task[] = data.map((t: any) => ({
          id: t.id,
          title: t.title,
          assignedTo: t.assigned_to ?? '',
          dueDate: t.due_date ?? '',
          priority: t.priority as Task['priority'],
          status: t.status as Task['status'],
          clientName: t.client_name ?? '',
        }))
        setTasks([...supabaseTasks, ...mockDeliverables])
      }
    }
    loadTasks()
  }, [])

  const handleAddTask = async (task: Task) => {
    setTasks(prev => [task, ...prev])
    await logChange('Criou atividade', 'task', task.title, task.clientName)
  }

  const filtered = useMemo(() =>
    tasks.filter(d => {
      const matchSearch = search === '' ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.clientName.toLowerCase().includes(search.toLowerCase()) ||
        d.assignedTo.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      const matchPriority = priorityFilter === 'all' || d.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    }),
    [search, statusFilter, priorityFilter, tasks]
  )

  const grouped = {
    pending: filtered.filter(d => d.status === 'pending'),
    in_progress: filtered.filter(d => d.status === 'in_progress'),
    review: filtered.filter(d => d.status === 'review'),
    completed: filtered.filter(d => d.status === 'completed'),
    blocked: filtered.filter(d => d.status === 'blocked'),
  }

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(d => d.status === 'in_progress').length,
    overdue: tasks.filter(d => d.status !== 'completed' && d.dueDate && daysUntil(d.dueDate) < 0).length,
    completed: tasks.filter(d => d.status === 'completed').length,
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atividades</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestão de entregas e tarefas de todos os engagements</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white hover:brightness-110 transition-all self-start"
          style={{ background: '#C4973B' }}
        >
          <Plus className="w-4 h-4" />
          Nova Atividade
        </button>
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
            <SelectTrigger className="h-9 w-44"><SelectValue placeholder="Status" /></SelectTrigger>
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
            <SelectTrigger className="h-9 w-36"><SelectValue placeholder="Prioridade" /></SelectTrigger>
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

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {(Object.entries(grouped) as [string, Task[]][]).map(([status, items]) => (
          <div key={status} className="space-y-2">
            <div className="flex items-center gap-1.5 px-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${taskStatusConfig[status as keyof typeof taskStatusConfig].bg}`}>
                {taskStatusConfig[status as keyof typeof taskStatusConfig].label}
              </span>
              <span className="text-xs text-gray-400">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(task => {
                const days = task.dueDate ? daysUntil(task.dueDate) : 0
                const isOverdue = task.dueDate && days < 0 && task.status !== 'completed'
                return (
                  <Card key={task.id} className="hover:shadow-md transition-shadow duration-150">
                    <CardContent className="p-3 space-y-2">
                      <p className={`text-xs font-semibold leading-snug ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                      {task.clientName && <p className="text-[10px] text-gray-400 truncate">{task.clientName}</p>}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-medium ${taskPriorityConfig[task.priority].color}`}>
                          {taskPriorityConfig[task.priority].label}
                        </span>
                        {task.dueDate && (
                          <span className={`text-[10px] ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                            {isOverdue ? `${Math.abs(days)}d atrasado` : formatDateShort(task.dueDate)}
                          </span>
                        )}
                      </div>
                      {task.assignedTo && <p className="text-[10px] text-gray-400 truncate">{task.assignedTo}</p>}
                    </CardContent>
                  </Card>
                )
              })}
              {items.length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-300">Nenhuma atividade</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <NovaAtividadeModal onClose={() => setShowModal(false)} onAdd={handleAddTask} />
      )}
    </div>
  )
}
