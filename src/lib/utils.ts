import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { EngagementStatus, PracticeArea, ConsultantLevel, TaskStatus, TaskPriority } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`
  return formatCurrency(value)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateStr))
}

export function daysUntil(dateStr: string): number {
  const today = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export const statusConfig: Record<EngagementStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Ativo', color: 'text-emerald-700', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Concluído', color: 'text-blue-700', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  on_hold: { label: 'Suspenso', color: 'text-amber-700', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bg: 'bg-red-50 text-red-700 border-red-200' },
}

export const practiceAreaConfig: Record<PracticeArea, { label: string; color: string }> = {
  restructuring: { label: 'Reestruturação', color: 'text-purple-700' },
  performance: { label: 'Melhoria de Desempenho', color: 'text-blue-700' },
  disputes: { label: 'Disputas & Investigações', color: 'text-red-700' },
  tax: { label: 'Tributário', color: 'text-green-700' },
  real_estate: { label: 'Imobiliário', color: 'text-orange-700' },
  strategy: { label: 'Estratégia', color: 'text-indigo-700' },
  healthcare: { label: 'Healthcare', color: 'text-teal-700' },
}

export const levelConfig: Record<ConsultantLevel, { label: string; short: string }> = {
  managing_director: { label: 'Managing Director', short: 'MD' },
  senior_director: { label: 'Senior Director', short: 'SD' },
  director: { label: 'Director', short: 'Dir' },
  manager: { label: 'Manager', short: 'Mgr' },
  associate: { label: 'Associate', short: 'Assoc' },
  analyst: { label: 'Analyst', short: 'AN' },
}

export const taskStatusConfig: Record<TaskStatus, { label: string; bg: string }> = {
  pending: { label: 'Pendente', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
  in_progress: { label: 'Em Andamento', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  review: { label: 'Em Revisão', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  completed: { label: 'Concluído', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  blocked: { label: 'Bloqueado', bg: 'bg-red-50 text-red-700 border-red-200' },
}

export const taskPriorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Baixa', color: 'text-gray-500' },
  medium: { label: 'Média', color: 'text-amber-600' },
  high: { label: 'Alta', color: 'text-orange-600' },
  critical: { label: 'Crítica', color: 'text-red-600' },
}
