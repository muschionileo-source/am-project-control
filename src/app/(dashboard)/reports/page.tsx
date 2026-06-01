'use client'

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { revenueChartData, revenueByPractice, mockEngagements, mockUsers } from '@/lib/mock-data'
import { formatCurrencyShort } from '@/lib/utils'

const utilizationData = mockUsers.map(u => ({ name: u.name.split(' ')[0], util: u.utilization }))

const deliverableStats = [
  { name: 'Jan', concluidas: 8, pendentes: 4, bloqueadas: 1 },
  { name: 'Fev', concluidas: 11, pendentes: 6, bloqueadas: 0 },
  { name: 'Mar', concluidas: 9, pendentes: 5, bloqueadas: 2 },
  { name: 'Abr', concluidas: 14, pendentes: 3, bloqueadas: 1 },
  { name: 'Mai', concluidas: 16, pendentes: 7, bloqueadas: 0 },
  { name: 'Jun', concluidas: 12, pendentes: 4, bloqueadas: 1 },
  { name: 'Jul', concluidas: 18, pendentes: 5, bloqueadas: 0 },
  { name: 'Ago', concluidas: 15, pendentes: 6, bloqueadas: 2 },
  { name: 'Set', concluidas: 10, pendentes: 9, bloqueadas: 1 },
]

const performanceData = [
  { subject: 'Pontualidade', A: 88, fullMark: 100 },
  { subject: 'Qualidade', A: 92, fullMark: 100 },
  { subject: 'Utilização', A: 87, fullMark: 100 },
  { subject: 'Satisfação', A: 94, fullMark: 100 },
  { subject: 'Rentabilidade', A: 79, fullMark: 100 },
  { subject: 'Crescimento', A: 83, fullMark: 100 },
]

export default function ReportsPage() {
  const totalRevenue = mockEngagements.reduce((s, e) => s + e.billedToDate, 0)
  const totalBudget = mockEngagements.reduce((s, e) => s + e.budget, 0)
  const profitability = Math.round((totalRevenue / totalBudget) * 100)

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500 mt-0.5">Analytics e indicadores de performance — YTD 2024</p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Receita Total YTD', value: formatCurrencyShort(totalRevenue), sub: '+18% vs. 2023', positive: true },
          { label: 'Budget Total em Carteira', value: formatCurrencyShort(totalBudget), sub: '8 engagements', positive: true },
          { label: 'Taxa de Faturamento', value: `${profitability}%`, sub: 'do budget faturado', positive: profitability >= 80 },
          { label: 'NPS de Clientes', value: '72', sub: 'Excelente (meta: 60)', positive: true },
        ].map(({ label, value, sub, positive }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              <p className={`text-xs mt-1 font-medium ${positive ? 'text-emerald-600' : 'text-orange-500'}`}>{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="financial">
        <TabsList>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="operational">Operacional</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Receita Mensal — Realizado vs. Meta</CardTitle>
                <CardDescription>Valores em R$ milhões</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueChartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1e6).toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => [formatCurrencyShort(v), '']} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="value" name="Realizado" fill="#C4973B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="secondary" name="Meta" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mix de Receita</CardTitle>
                <CardDescription>Por área de prática</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={revenueByPractice} cx="50%" cy="50%" outerRadius={72} paddingAngle={2} dataKey="value">
                      {revenueByPractice.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {revenueByPractice.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        <span className="text-gray-600">{name}</span>
                      </div>
                      <span className="font-semibold text-gray-800">{value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Entregas por Mês</CardTitle>
                <CardDescription>Concluídas, pendentes e bloqueadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={deliverableStats} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="concluidas" name="Concluídas" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pendentes" name="Pendentes" fill="#C4973B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="bloqueadas" name="Bloqueadas" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicadores de Qualidade</CardTitle>
                <CardDescription>Score médio dos KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#F3F4F6" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <Radar name="Score" dataKey="A" stroke="#C4973B" fill="#C4973B" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilização por Consultor</CardTitle>
              <CardDescription>Taxa de utilização atual (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={utilizationData} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#4B5563' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Utilização']} contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="util" name="Utilização" radius={[0, 4, 4, 0]}>
                    {utilizationData.map((entry, i) => (
                      <Cell key={i} fill={entry.util >= 95 ? '#EF4444' : entry.util >= 85 ? '#C4973B' : '#10B981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
