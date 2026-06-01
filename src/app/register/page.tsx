'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, User, Mail, Building2, Briefcase, MapPin, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AMLogoFull } from '@/components/shared/AMLogoFull'

const practiceAreas = [
  { value: 'restructuring', label: 'Reestruturação' },
  { value: 'performance', label: 'Melhoria de Desempenho' },
  { value: 'disputes', label: 'Disputas & Investigações' },
  { value: 'tax', label: 'Tributário' },
  { value: 'real_estate', label: 'Imobiliário' },
  { value: 'strategy', label: 'Estratégia' },
  { value: 'healthcare', label: 'Healthcare' },
]

const levels = [
  { value: 'managing_director', label: 'Managing Director' },
  { value: 'senior_director', label: 'Senior Director' },
  { value: 'director', label: 'Director' },
  { value: 'manager', label: 'Manager' },
  { value: 'associate', label: 'Associate' },
  { value: 'analyst', label: 'Analyst' },
]

const offices = [
  { value: 'sao_paulo', label: 'São Paulo' },
  { value: 'rio_de_janeiro', label: 'Rio de Janeiro' },
  { value: 'brasilia', label: 'Brasília' },
  { value: 'belo_horizonte', label: 'Belo Horizonte' },
  { value: 'curitiba', label: 'Curitiba' },
  { value: 'porto_alegre', label: 'Porto Alegre' },
]

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', practiceArea: '', level: '', office: '', password: '', confirm: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-card p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Solicitação enviada</h2>
            <p className="text-sm text-gray-500 mt-2">
              Sua solicitação de acesso foi enviada para aprovação. Você receberá um e-mail de confirmação quando seu acesso for ativado.
            </p>
          </div>
          <Link href="/login">
            <Button variant="dark" className="w-full">Voltar ao Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex justify-center">
          <div className="bg-am-black rounded-2xl px-8 py-4">
            <AMLogoFull variant="light" size="md" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Link href="/login" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Solicitar Acesso</h1>
              <p className="text-sm text-gray-500">Preencha os dados para solicitar acesso ao sistema</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label>Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Seu nome completo"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label>E-mail corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="nome@alvarezandmarsal.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Área de Prática</Label>
                <Select onValueChange={v => setForm(f => ({ ...f, practiceArea: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreas.map(a => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Nível</Label>
                <Select onValueChange={v => setForm(f => ({ ...f, level: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(l => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <Label>Escritório</Label>
                <Select onValueChange={v => setForm(f => ({ ...f, office: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o escritório..." />
                  </SelectTrigger>
                  <SelectContent>
                    {offices.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="pl-9"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Repita a senha"
                    value={form.confirm}
                    onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <Button type="submit" className="w-full h-11 text-base font-semibold">
                Solicitar Acesso
              </Button>
              <p className="text-xs text-center text-gray-400">
                Seu acesso passará por aprovação do administrador antes de ser ativado.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
