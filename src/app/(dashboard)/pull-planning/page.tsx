'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Plus, Users, MapPin, AlertTriangle, ChevronDown, ChevronLeft, ChevronRight,
  X, CalendarDays, Check, BarChart2, List, Activity, TrendingUp, Layers
} from 'lucide-react'
import {
  initialProjects, disciplineConfig,
  type PullProject, type WorkPackage, type PlanCard, type Discipline
} from '@/lib/pull-planning-data'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useAudit } from '@/contexts/AuditContext'

// ── Timeline helpers ────────────────────────────────────────────────
const CELL_W = 44 // px per day column
const ROW_H = 56  // px per work-package row

function buildWeeks(startDate: Date, totalDays: number) {
  const weeks: { label: string; days: { label: string; idx: number }[] }[] = []
  let currentWeek: typeof weeks[0] | null = null
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const weekNum = getWeekNumber(d)
    const weekLabel = `SEMANA${weekNum}`
    if (!currentWeek || currentWeek.label !== weekLabel) {
      currentWeek = { label: weekLabel, days: [] }
      weeks.push(currentWeek)
    }
    currentWeek.days.push({ label: d.getDate().toString(), idx: i })
  }
  return weeks
}

function getWeekNumber(d: Date) {
  const onejan = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
}

// ── Card component ──────────────────────────────────────────────────
function TimelineCard({ card, onClick }: { card: PlanCard; onClick: () => void }) {
  const cfg = disciplineConfig[card.discipline]
  return (
    <div
      onClick={onClick}
      title={`${card.title} — ${card.responsible}`}
      className={cn(
        'absolute top-1.5 rounded border cursor-pointer select-none transition-all hover:brightness-95 active:scale-[0.97]',
        cfg.bg, cfg.border,
        card.status === 'in_progress' && 'ring-2 ring-offset-1 ring-am-navy',
        card.status === 'restricted' && 'opacity-60'
      )}
      style={{
        left: card.startDay * CELL_W + 2,
        width: Math.max(card.duration * CELL_W - 4, CELL_W - 4),
        height: ROW_H - 12,
      }}
    >
      <div className="p-1 h-full flex flex-col justify-between overflow-hidden">
        <p className={cn('text-[9px] font-semibold leading-tight truncate', cfg.color)}>{card.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-am-navy/20 flex items-center justify-center">
              <span className="text-[8px] font-bold text-am-navy">{card.responsible.slice(0, 2)}</span>
            </div>
            {card.predecessorId && (
              <span title="Possui predecessora" className="text-[9px] text-gray-400">🔗</span>
            )}
          </div>
          {card.status === 'in_progress' && (
            <span className="text-[8px] font-bold text-am-navy uppercase">Em And.</span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Add Card Modal ──────────────────────────────────────────────────
interface AddCardModalProps {
  packages: WorkPackage[]
  allCards: PlanCard[]
  projectStartDate: string
  onClose: () => void
  onAdd: (card: Omit<PlanCard, 'id'>) => void
}

function AddCardModal({ packages, allCards, projectStartDate, onClose, onAdd }: AddCardModalProps) {
  const [form, setForm] = useState({
    title: '',
    discipline: 'civil' as Discipline,
    responsible: '',
    packageId: packages[0]?.id ?? '',
    startDate: projectStartDate,
    duration: 3,
    observations: '',
    status: 'pending' as PlanCard['status'],
    predecessorId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.responsible.trim()) return
    const startDay = Math.max(0, Math.round(
      (new Date(form.startDate).getTime() - new Date(projectStartDate).getTime()) / 86400000
    ))
    onAdd({
      title: form.title,
      discipline: form.discipline,
      responsible: form.responsible,
      packageId: form.packageId,
      startDay,
      duration: form.duration,
      observations: form.observations,
      status: form.status,
      projectId: packages.find(p => p.id === form.packageId)?.projectId ?? '',
      predecessorId: form.predecessorId || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0" style={{ background: '#1B3461' }}>
          <div>
            <h3 className="font-bold text-white">Novo Card</h3>
            <p className="text-xs text-white/50">Adicionar atividade ao pull planning</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título da Atividade *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Montagem da estrutura metálica"
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Package */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pacote de Trabalho</label>
              <select
                value={form.packageId}
                onChange={e => setForm(f => ({ ...f, packageId: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy bg-white"
              >
                {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {/* Discipline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Disciplina</label>
              <select
                value={form.discipline}
                onChange={e => setForm(f => ({ ...f, discipline: e.target.value as Discipline }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy bg-white"
              >
                {Object.entries(disciplineConfig).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Responsible */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Responsável *</label>
              <input
                type="text"
                required
                value={form.responsible}
                onChange={e => setForm(f => ({ ...f, responsible: e.target.value }))}
                placeholder="Nome ou sigla"
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as PlanCard['status'] }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy bg-white"
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="restricted">Restrito</option>
              </select>
            </div>

            {/* Start date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Início</label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Duração (dias)</label>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 1 }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
              />
            </div>
          </div>

          {/* Predecessor */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Predecessora</label>
            <select
              value={form.predecessorId}
              onChange={e => setForm(f => ({ ...f, predecessorId: e.target.value }))}
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy bg-white"
            >
              <option value="">— Nenhuma —</option>
              {allCards.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Observations */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observações</label>
            <textarea
              value={form.observations}
              onChange={e => setForm(f => ({ ...f, observations: e.target.value }))}
              rows={2}
              placeholder="Notas, restrições, dependências..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy resize-none"
            />
          </div>

          {/* Discipline preview */}
          {form.discipline && (
            <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium', disciplineConfig[form.discipline].bg, disciplineConfig[form.discipline].border, disciplineConfig[form.discipline].color)}>
              <span className="font-bold">Disciplina:</span> {disciplineConfig[form.discipline].label}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
              style={{ background: '#1B3461' }}
            >
              <Plus className="w-4 h-4" />
              Adicionar Card
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Add Line Modal ──────────────────────────────────────────────────
interface AddLineModalProps {
  projectId: string
  projectStartDate: string
  projectEndDate: string
  onClose: () => void
  onAdd: (pkg: Omit<WorkPackage, 'id' | 'cards'>) => void
}

function AddLineModal({ projectId, projectStartDate, projectEndDate, onClose, onAdd }: AddLineModalProps) {
  const [form, setForm] = useState({
    name: '',
    startDate: projectStartDate,
    endDate: projectEndDate,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ ...form, projectId })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ background: '#1B3461' }}>
          <div>
            <h3 className="font-bold text-white">Nova Linha</h3>
            <p className="text-xs text-white/50">Adicionar linha ao pull planning</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome da Linha *</label>
            <input
              type="text"
              required
              autoFocus
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Moega, Transportador TR01..."
              className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data Início</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data Fim</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-10 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110"
              style={{ background: '#1B3461' }}
            >
              <Plus className="w-4 h-4" />
              Criar Linha
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Card Detail Modal ───────────────────────────────────────────────
function CardDetailModal({ card, allCards, onClose, onDelete }: { card: PlanCard; allCards: PlanCard[]; onClose: () => void; onDelete: () => void }) {
  const predecessor = card.predecessorId ? allCards.find(c => c.id === card.predecessorId) : null
  const cfg = disciplineConfig[card.discipline]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className={cn('px-5 py-4 border-b', cfg.bg, cfg.border)}>
          <div className="flex items-start justify-between">
            <div>
              <span className={cn('text-[10px] font-bold uppercase tracking-wide', cfg.color)}>{cfg.label}</span>
              <h3 className="font-bold text-gray-800 mt-0.5">{card.title}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Responsável</p>
              <p className="font-semibold text-gray-800">{card.responsible}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Status</p>
              <p className="font-semibold text-gray-800 capitalize">{card.status.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Início (dia)</p>
              <p className="font-semibold text-gray-800">{card.startDay}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Duração</p>
              <p className="font-semibold text-gray-800">{card.duration} dia{card.duration !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {predecessor && (
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
              <span className="text-sm">🔗</span>
              <div>
                <p className="text-[10px] text-blue-400 uppercase">Predecessora</p>
                <p className="font-semibold text-blue-800 text-xs">{predecessor.title}</p>
              </div>
            </div>
          )}
          {card.observations && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase mb-1">Observações</p>
              <p className="text-gray-700">{card.observations}</p>
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={onDelete} className="flex-1 h-9 border border-red-200 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
              Remover
            </button>
            <button onClick={onClose} className="flex-1 h-9 rounded-lg text-xs font-bold text-white" style={{ background: '#1B3461' }}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── New Project Modal ───────────────────────────────────────────────
function NewProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (data: { name: string; location: string; startDate: string; endDate: string; team: number }) => void }) {
  const [form, setForm] = useState({ name: '', location: '', startDate: '', endDate: '', team: 1 })
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.startDate || !form.endDate) return
    onAdd(form)
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ background: '#1B3461' }}>
          <div>
            <h3 className="font-bold text-white">Novo Projeto</h3>
            <p className="text-xs text-white/50">Preencha os dados do projeto</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome do Projeto *</label>
            <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Rio Verde - Entrega 30%" className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Localização</label>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Ex: Rio Verde, GO" className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Equipe (pessoas)</label>
              <input type="number" min={1} value={form.team} onChange={e => setForm(f => ({ ...f, team: parseInt(e.target.value) || 1 }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Início *</label>
              <input type="date" required value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Data de Fim *</label>
              <input type="date" required value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-am-navy/30 focus:border-am-navy" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-9 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 h-9 rounded-lg text-xs font-bold text-white transition-all hover:brightness-110" style={{ background: '#1B3461' }}>
              + Criar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────────
export default function PullPlanningPage() {
  const { user, isGuest } = useAuth()
  const { logChange } = useAudit()
  const [projects, setProjects] = useState<PullProject[]>([])
  const [dbLoading, setDbLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [activeTab, setActiveTab] = useState<'board' | 'cards' | 'atividades' | 'restricoes' | 'dashboard' | 'grafico' | 'desvios'>('board')
  const [horizonte, setHorizonte] = useState(6)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddLineModal, setShowAddLineModal] = useState(false)
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showDeleteProjectConfirm, setShowDeleteProjectConfirm] = useState(false)
  const [selectedCard, setSelectedCard] = useState<PlanCard | null>(null)
  const [activeDisciplines, setActiveDisciplines] = useState<Set<Discipline>>(new Set())
  const timelineRef = useRef<HTMLDivElement>(null)

  // ── Load from Supabase ──────────────────────────────────────────
  const loadProjects = useCallback(async () => {
    setDbLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*, packages:packages(*, cards:cards(*))')
    if (error) {
      console.error('Supabase error:', error)
      setProjects([])
      setSelectedProjectId('')
    } else if (!data || data.length === 0) {
      setProjects([])
      setSelectedProjectId('')
    } else {
      const transformed: PullProject[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        location: p.location ?? '',
        startDate: p.start_date,
        endDate: p.end_date,
        team: Number(p.team) || 0,
        packages: (p.packages ?? []).map((pkg: any) => ({
          id: pkg.id,
          name: pkg.name,
          projectId: pkg.project_id,
          startDate: p.start_date,
          endDate: p.end_date,
          cards: (pkg.cards ?? []).map((c: any) => ({
            id: c.id,
            title: c.title,
            discipline: c.discipline as Discipline,
            responsible: c.responsible,
            startDay: c.start_day,
            duration: c.duration,
            packageId: c.package_id,
            projectId: c.project_id,
            status: c.status,
            observations: c.observations ?? '',
            predecessorId: c.predecessor_id ?? undefined,
          })),
        })),
      }))
      setProjects(transformed)
      setSelectedProjectId(transformed[0].id)
    }
    setDbLoading(false)
  }, [])

  useEffect(() => { loadProjects() }, [loadProjects])

  const project = projects.find(p => p.id === selectedProjectId) ?? projects[0]

  const handleCreateProject = async (data: { name: string; location: string; startDate: string; endDate: string; team: number }) => {
    const id = `p${Date.now()}`
    await supabase.from('projects').insert({
      id, name: data.name, location: data.location,
      start_date: data.startDate, end_date: data.endDate, team: data.team,
    })
    const newProject: PullProject = { id, ...data, packages: [] }
    setProjects(prev => [...prev, newProject])
    setSelectedProjectId(id)
    await logChange('Criou projeto', 'project', data.name, data.location)
  }

  // Guard: aguarda dados carregarem
  if (dbLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-am-navy/30 border-t-am-navy rounded-full animate-spin" />
        <p className="text-sm">Carregando dados...</p>
      </div>
    )
  }

  // Estado vazio — nenhum projeto cadastrado
  if (!project) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-6 text-gray-400">
        <div className="text-center space-y-2">
          <CalendarDays className="w-12 h-12 mx-auto text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600">Nenhum projeto cadastrado</h3>
          <p className="text-sm">Crie o primeiro projeto para começar o Pull Planning</p>
        </div>
        {!isGuest && (
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white hover:brightness-110 transition-all"
            style={{ background: '#1B3461' }}
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Projeto
          </button>
        )}
        {showNewProjectModal && (
          <NewProjectModal onClose={() => setShowNewProjectModal(false)} onAdd={handleCreateProject} />
        )}
      </div>
    )
  }

  const totalDays = horizonte * 7
  const startDate = new Date(project.startDate)
  const weeks = buildWeeks(startDate, totalDays)

  const totalCards = project.packages.reduce((s, pkg) => s + pkg.cards.length, 0)
  const totalActivities = project.packages.reduce((s, pkg) => s + pkg.cards.filter(c => c.status === 'in_progress').length, 0)
  const outOfPeriod = project.packages.reduce((s, pkg) =>
    s + pkg.cards.filter(c => c.startDay + c.duration > totalDays).length, 0)

  const allPackages = project.packages
  const visibleCards = (cards: PlanCard[]) =>
    activeDisciplines.size === 0 ? cards : cards.filter(c => activeDisciplines.has(c.discipline))

  const handleAddCard = async (cardData: Omit<PlanCard, 'id'>) => {
    const id = `c${Date.now()}`
    await supabase.from('cards').insert({
      id,
      title: cardData.title,
      discipline: cardData.discipline,
      responsible: cardData.responsible,
      start_day: cardData.startDay,
      duration: cardData.duration,
      package_id: cardData.packageId,
      project_id: cardData.projectId,
      status: cardData.status,
      observations: cardData.observations ?? '',
      predecessor_id: cardData.predecessorId ?? null,
    })
    const newCard: PlanCard = { ...cardData, id }
    setProjects(prev => prev.map(p => p.id === project.id
      ? {
        ...p,
        packages: p.packages.map(pkg => pkg.id === cardData.packageId
          ? { ...pkg, cards: [...pkg.cards, newCard] }
          : pkg
        )
      }
      : p
    ))
    const pkgName = project.packages.find(p => p.id === cardData.packageId)?.name ?? ''
    await logChange('Adicionou card', 'card', cardData.title, `Linha: ${pkgName}`)
  }

  const handleAddLine = async (pkgData: Omit<WorkPackage, 'id' | 'cards'>) => {
    const id = `pkg${Date.now()}`
    await supabase.from('packages').insert({
      id,
      project_id: pkgData.projectId,
      name: pkgData.name,
    })
    const newPkg: WorkPackage = { ...pkgData, id, cards: [] }
    setProjects(prev => prev.map(p => p.id === project.id
      ? { ...p, packages: [...p.packages, newPkg] }
      : p
    ))
    await logChange('Adicionou linha', 'package', pkgData.name, `Projeto: ${project.name}`)
  }

  const handleDeleteCard = async (card: PlanCard) => {
    await supabase.from('cards').delete().eq('id', card.id)
    setProjects(prev => prev.map(p => p.id === project.id
      ? {
        ...p,
        packages: p.packages.map(pkg => pkg.id === card.packageId
          ? { ...pkg, cards: pkg.cards.filter(c => c.id !== card.id) }
          : pkg
        )
      }
      : p
    ))
    await logChange('Removeu card', 'card', card.title, '')
    setSelectedCard(null)
  }

  const handleDeleteProject = async () => {
    if (!project) return
    await supabase.from('projects').delete().eq('id', project.id)
    await logChange('Removeu projeto', 'project', project.name, '')
    const remaining = projects.filter(p => p.id !== project.id)
    setProjects(remaining)
    setSelectedProjectId(remaining[0]?.id ?? '')
    setShowDeleteProjectConfirm(false)
  }

  const toggleDiscipline = (d: Discipline) => {
    setActiveDisciplines(prev => {
      const next = new Set(prev)
      if (next.has(d)) next.delete(d); else next.add(d)
      return next
    })
  }

  const tabs = [
    { id: 'board', label: 'Board', count: totalCards },
    { id: 'cards', label: 'Lista de Cards', count: totalCards },
    { id: 'atividades', label: 'Atividades', count: null },
    { id: 'restricoes', label: 'Restrições', count: null },
    { id: 'dashboard', label: 'Dashboard', count: null },
    { id: 'grafico', label: 'Gráfico', count: null },
    { id: 'desvios', label: 'Desvios', count: 0 },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 space-y-3 shrink-0">
        {/* Row 1: project selector + actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-am-navy" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projeto:</span>
          </div>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="text-sm font-semibold text-am-navy border border-gray-200 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-am-navy bg-white pr-7 max-w-xs"
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold border border-am-navy text-am-navy px-2.5 py-1 rounded-md hover:bg-am-blue-pale transition-colors"
          >
            <Plus className="w-3 h-3" />
            Novo
          </button>

          {!isGuest && projects.length > 0 && (
            <button
              onClick={() => setShowDeleteProjectConfirm(true)}
              className="flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-50 transition-colors border border-red-200"
              title="Excluir projeto atual"
            >
              <X className="w-3 h-3" />
              Excluir
            </button>
          )}

          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3.5 h-3.5" />
              <span className="font-semibold text-am-navy">{project.team}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="text-am-navy font-semibold">{new Date(project.startDate).toLocaleDateString('pt-BR')} → {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
              <span className="text-gray-400">· {horizonte} sem.</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>

        {/* Row 2: stats */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          {[
            { label: 'cards', value: totalCards },
            { label: 'atividades', value: totalActivities },
            { label: 'marcos', value: 0 },
            { label: 'linha(s)', value: project.packages.length },
            { label: 'relações', value: 0 },
          ].map(({ label, value }) => (
            <span key={label}>
              <strong className="text-gray-800">{value}</strong> {label}
            </span>
          ))}
          {outOfPeriod > 0 && (
            <span className="flex items-center gap-1 text-orange-600 font-semibold bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              {outOfPeriod} fora
            </span>
          )}
        </div>

        {/* Warning */}
        {outOfPeriod > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span><strong>{outOfPeriod} cards fora do período do projeto</strong></span>
            <span className="text-orange-500">Projeto: {new Date(project.startDate).toLocaleDateString('pt-BR')} → {new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
            <button className="ml-auto text-am-navy font-semibold hover:underline">Editar projeto</button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b -mb-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-am-navy text-am-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', activeTab === tab.id ? 'bg-am-blue-pale text-am-navy' : 'bg-gray-100 text-gray-500')}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      {activeTab === 'board' && (
        <div className="bg-white border-b border-gray-100 px-5 py-2 flex flex-wrap items-center gap-3 shrink-0">
          {/* Horizonte */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Horizonte</span>
            {[2, 3, 4, 5, 6].map(h => (
              <button
                key={h}
                onClick={() => setHorizonte(h)}
                className={cn(
                  'w-7 h-7 rounded text-xs font-bold transition-colors',
                  horizonte === h ? 'bg-am-navy text-white' : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                {h}
              </button>
            ))}
            <span className="text-xs text-gray-400 ml-0.5">sem.</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded text-gray-400 hover:bg-gray-100 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <button className="px-3 py-1 text-xs font-semibold border border-gray-200 rounded hover:bg-gray-50 transition-colors">Hoje</button>
            <button className="p-1.5 rounded text-gray-400 hover:bg-gray-100 transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>

          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-3">
            <button className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Baseline
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Comparar <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {!isGuest && (
              <>
                <button
                  onClick={() => setShowAddLineModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border border-am-navy text-am-navy transition-all hover:bg-am-blue-pale"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Linha
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold text-white transition-all hover:brightness-110"
                  style={{ background: '#1B3461' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Card
                </button>
              </>
            )}
            {isGuest && (
              <span className="text-xs text-gray-400 italic">Visitante — somente leitura</span>
            )}
          </div>
        </div>
      )}

      {/* Legend + Disciplines */}
      {activeTab === 'board' && (
        <div className="bg-white border-b border-gray-100 px-5 py-2 flex flex-wrap items-center gap-4 shrink-0 text-[10px]">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="font-semibold text-gray-500">LEGENDA:</span>
            <span className="flex items-center gap-1"><span className="inline-block w-6 h-0.5 bg-am-navy" /> Card</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-orange-400 rotate-45" /> Marco</span>
            <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-green-400 rotate-45" /> Início/Fim</span>
            <span className="flex items-center gap-1"><span className="inline-block w-6 border-t-2 border-dashed border-gray-400" /> Sucessão</span>
            <span className="flex items-center gap-1 text-blue-500 font-semibold">■ Iniciado</span>
            <span className="flex items-center gap-1 text-red-500 font-semibold">■ Fora período</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span className="font-semibold text-gray-500">DISCIPLINAS:</span>
            {Object.entries(disciplineConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => toggleDiscipline(key as Discipline)}
                className={cn(
                  'px-2 py-0.5 rounded-full border font-semibold transition-all text-[10px]',
                  activeDisciplines.has(key as Discipline)
                    ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                    : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                )}
              >
                {cfg.label}
              </button>
            ))}
            <button className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Board content */}
      {activeTab === 'board' && (
        <div className="flex-1 overflow-auto">
          <div className="flex min-w-max">
            {/* Frozen left column — package names */}
            <div className="sticky left-0 z-20 bg-gray-50 border-r border-gray-200 shrink-0" style={{ width: 200 }}>
              {/* Header placeholder */}
              <div className="border-b border-gray-200 bg-gray-50" style={{ height: 56 }} />
              {allPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className="flex flex-col justify-center px-3 border-b border-gray-100 bg-white hover:bg-gray-50/50 transition-colors"
                  style={{ height: ROW_H }}
                >
                  <p className="text-xs font-bold text-am-navy truncate">{pkg.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {pkg.cards.length} card{pkg.cards.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div ref={timelineRef} className="relative flex-1">
              {/* Week + day headers */}
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50" style={{ height: 56 }}>
                {/* Week row */}
                <div className="flex border-b border-gray-200" style={{ height: 22 }}>
                  {weeks.map((week, wi) => (
                    <div
                      key={wi}
                      className="flex items-center justify-center border-r border-gray-200 shrink-0"
                      style={{ width: week.days.length * CELL_W, height: 22 }}
                    >
                      <span className="text-[9px] font-bold text-am-navy uppercase tracking-wide">{week.label}</span>
                    </div>
                  ))}
                </div>
                {/* Day row */}
                <div className="flex" style={{ height: 34 }}>
                  {weeks.flatMap(week =>
                    week.days.map(day => (
                      <div
                        key={day.idx}
                        className="flex items-center justify-center border-r border-gray-100 shrink-0 text-[10px] text-gray-500 font-medium"
                        style={{ width: CELL_W, height: 34 }}
                      >
                        {day.label}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Rows */}
              {allPackages.map(pkg => {
                const cards = visibleCards(pkg.cards)
                return (
                  <div
                    key={pkg.id}
                    className="relative border-b border-gray-100 bg-white"
                    style={{ height: ROW_H, width: totalDays * CELL_W }}
                  >
                    {/* Day grid lines */}
                    {Array.from({ length: totalDays }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-r border-gray-50"
                        style={{ left: i * CELL_W }}
                      />
                    ))}
                    {/* Week separators */}
                    {weeks.slice(1).map((_, wi) => {
                      const xPos = weeks.slice(0, wi + 1).reduce((s, w) => s + w.days.length * CELL_W, 0)
                      return (
                        <div
                          key={wi}
                          className="absolute top-0 bottom-0 border-r border-gray-200"
                          style={{ left: xPos }}
                        />
                      )
                    })}
                    {/* Cards */}
                    {cards.map(card => (
                      <TimelineCard
                        key={card.id}
                        card={card}
                        onClick={() => setSelectedCard(card)}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Card list view */}
      {activeTab === 'cards' && (
        <div className="flex-1 overflow-auto p-5">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Todos os Cards — {totalCards} itens</span>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg"
                style={{ background: '#1B3461' }}
              >
                <Plus className="w-3.5 h-3.5" /> Novo Card
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="grid grid-cols-6 gap-4 px-5 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-2">Título</div>
                <div>Disciplina</div>
                <div>Responsável</div>
                <div>Duração</div>
                <div>Status</div>
              </div>
              {allPackages.flatMap(pkg => pkg.cards).map(card => {
                const cfg = disciplineConfig[card.discipline]
                return (
                  <div
                    key={card.id}
                    className="grid grid-cols-6 gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer items-center text-sm"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="col-span-2 font-medium text-gray-800">{card.title}</div>
                    <div>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', cfg.bg, cfg.color, cfg.border)}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-gray-600">{card.responsible}</div>
                    <div className="text-gray-500">{card.duration}d</div>
                    <div className="text-gray-500 capitalize">{card.status.replace('_', ' ')}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {!['board', 'cards'].includes(activeTab) && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center space-y-2">
            <BarChart2 className="w-10 h-10 mx-auto opacity-20" />
            <p className="font-medium">Funcionalidade em desenvolvimento</p>
            <p className="text-sm">Em breve disponível</p>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddCardModal
          packages={allPackages}
          allCards={allPackages.flatMap(p => p.cards)}
          projectStartDate={project.startDate}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCard}
        />
      )}
      {showAddLineModal && (
        <AddLineModal
          projectId={project.id}
          projectStartDate={project.startDate}
          projectEndDate={project.endDate}
          onClose={() => setShowAddLineModal(false)}
          onAdd={handleAddLine}
        />
      )}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          allCards={allPackages.flatMap(p => p.cards)}
          onClose={() => setSelectedCard(null)}
          onDelete={() => handleDeleteCard(selectedCard)}
        />
      )}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} onAdd={handleCreateProject} />
      )}
      {showDeleteProjectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteProjectConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900">Excluir projeto?</h3>
            <p className="text-sm text-gray-500">
              Isso vai apagar permanentemente <span className="font-semibold text-gray-800">"{project.name}"</span> com todas as linhas e cards. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteProjectConfirm(false)} className="flex-1 h-9 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleDeleteProject} className="flex-1 h-9 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
