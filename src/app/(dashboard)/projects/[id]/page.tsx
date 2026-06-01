'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Briefcase, Calendar, DollarSign, Users,
  CheckCircle2, Circle, Clock, AlertCircle, MapPin,
  TrendingUp, FileText
} from 'lucide-react'
import { mockEngagements, mockUsers } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  formatCurrencyShort, formatDate, formatDateShort,
  statusConfig, practiceAreaConfig, levelConfig,
  taskStatusConfig, taskPriorityConfig, daysUntil
} from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const engagement = mockEngagements.find(e => e.id === params.id)
  if (!engagement) notFound()

  const teamMembers = mockUsers.filter(u => engagement.team.includes(u.id))
  const billedPercent = Math.round((engagement.billedToDate / engagement.budget) * 100)
  const daysLeft = daysUntil(engagement.endDate)

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Back + Header */}
      <div>
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Engagements
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{engagement.code}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusConfig[engagement.status].bg}`}>
                {statusConfig[engagement.status].label}
              </span>
              <span className={`text-xs font-medium ${practiceAreaConfig[engagement.practiceArea].color}`}>
                {practiceAreaConfig[engagement.practiceArea].label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{engagement.client}</h1>
            <p className="text-gray-500">{engagement.name}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm">Editar</Button>
            <Button size="sm">Nova Atividade</Button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Progresso', value: `${engagement.progress}%`,
            sub: 'do escopo concluído', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50',
          },
          {
            label: 'Budget Total', value: formatCurrencyShort(engagement.budget),
            sub: `${formatCurrencyShort(engagement.billedToDate)} faturado`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50',
          },
          {
            label: 'Lead MD', value: engagement.leadMD.split(' ')[0],
            sub: engagement.leadMD.split(' ').slice(1).join(' '), icon: Users, color: 'text-am-gold', bg: 'bg-amber-50',
          },
          {
            label: daysLeft > 0 ? 'Dias Restantes' : 'Prazo',
            value: daysLeft > 0 ? daysLeft.toString() : 'Encerrado',
            sub: formatDateShort(engagement.endDate), icon: Calendar,
            color: daysLeft < 30 ? 'text-red-600' : 'text-gray-600',
            bg: daysLeft < 30 ? 'bg-red-50' : 'bg-gray-50',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`${bg} ${color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-base font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="deliverables">
            <TabsList className="mb-4">
              <TabsTrigger value="deliverables">Entregas ({engagement.deliverables.length})</TabsTrigger>
              <TabsTrigger value="milestones">Marcos ({engagement.milestones.length})</TabsTrigger>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            </TabsList>

            <TabsContent value="deliverables">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-50">
                    {engagement.deliverables.map(d => (
                      <div key={d.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                        <div className="shrink-0">
                          {d.status === 'completed'
                            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            : d.status === 'blocked'
                            ? <AlertCircle className="w-4 h-4 text-red-500" />
                            : <Circle className="w-4 h-4 text-gray-300" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${d.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {d.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{d.assignedTo}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${taskStatusConfig[d.status].bg}`}>
                            {taskStatusConfig[d.status].label}
                          </span>
                          <span className={`text-[10px] font-medium ${taskPriorityConfig[d.priority].color}`}>
                            {taskPriorityConfig[d.priority].label}
                          </span>
                        </div>
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="text-xs text-gray-400">{formatDateShort(d.dueDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones">
              <Card>
                <CardContent className="p-5">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100" />
                    <div className="space-y-5">
                      {engagement.milestones.map((m, i) => (
                        <div key={m.id} className="flex gap-4 relative">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${m.completed ? 'bg-am-gold border-am-gold' : 'bg-white border-gray-200'}`}>
                            {m.completed
                              ? <CheckCircle2 className="w-4 h-4 text-white" />
                              : <Circle className="w-4 h-4 text-gray-300" />
                            }
                          </div>
                          <div className="pt-1">
                            <p className={`text-sm font-semibold ${m.completed ? 'text-gray-700' : 'text-gray-400'}`}>{m.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(m.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview">
              <Card>
                <CardContent className="p-5 space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Descrição</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{engagement.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Início</h4>
                      <p className="text-sm font-medium text-gray-800">{formatDate(engagement.startDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Término Previsto</h4>
                      <p className="text-sm font-medium text-gray-800">{formatDate(engagement.endDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Escritório</h4>
                      <p className="text-sm font-medium text-gray-800">{engagement.office}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">% Faturado</h4>
                      <p className="text-sm font-medium text-gray-800">{billedPercent}% do budget</p>
                    </div>
                  </div>
                  {/* Budget progress */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Faturamento</h4>
                    <div className="space-y-1.5">
                      <Progress value={billedPercent} className="h-2.5" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Faturado: {formatCurrencyShort(engagement.billedToDate)}</span>
                        <span>Budget: {formatCurrencyShort(engagement.budget)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right — team */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Equipe do Engagement</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-[10px] bg-am-navy text-white">{member.avatarInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{member.name}</p>
                    <p className="text-[10px] text-gray-400">{levelConfig[member.level].label}</p>
                  </div>
                  <span className={`text-xs font-bold shrink-0 ${member.utilization >= 95 ? 'text-red-500' : 'text-gray-600'}`}>
                    {member.utilization}%
                  </span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full gap-1.5 mt-2">
                <Users className="w-3.5 h-3.5" />
                Gerenciar Equipe
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Resumo do Progresso</h4>
              {[
                { label: 'Escopo', value: engagement.progress },
                { label: 'Faturamento', value: billedPercent },
                { label: 'Marcos', value: Math.round((engagement.milestones.filter(m => m.completed).length / engagement.milestones.length) * 100) },
                { label: 'Entregas', value: Math.round((engagement.deliverables.filter(d => d.status === 'completed').length / engagement.deliverables.length) * 100) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-700">{value}%</span>
                  </div>
                  <Progress value={value} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
