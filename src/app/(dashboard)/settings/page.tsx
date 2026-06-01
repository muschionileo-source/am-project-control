'use client'

import { useState } from 'react'
import { Building2, User, Bell, Shield, Palette, Save, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { AMLogoFull } from '@/components/shared/AMLogoFull'
import { useAuth } from '@/contexts/AuthContext'
import { levelConfig, practiceAreaConfig } from '@/lib/utils'

export default function SettingsPage() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-0.5">Preferências do sistema e perfil do usuário</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-1.5"><User className="w-3.5 h-3.5" />Perfil</TabsTrigger>
          <TabsTrigger value="company" className="gap-1.5"><Building2 className="w-3.5 h-3.5" />Empresa</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="w-3.5 h-3.5" />Notificações</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Shield className="w-3.5 h-3.5" />Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>Dados pessoais e profissionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-am-navy flex items-center justify-center text-white text-xl font-bold">
                  {user?.avatarInitials ?? 'AM'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user ? levelConfig[user.level].label : ''}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome completo</Label>
                  <Input defaultValue={user?.name ?? ''} />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input defaultValue={user?.email ?? ''} type="email" />
                </div>
                <div className="space-y-1.5">
                  <Label>Nível</Label>
                  <Input defaultValue={user ? levelConfig[user.level].label : ''} disabled className="bg-gray-50 text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Área de Prática</Label>
                  <Input defaultValue={user ? practiceAreaConfig[user.practiceArea].label : ''} disabled className="bg-gray-50 text-gray-500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Escritório</Label>
                  <Input defaultValue={user?.office ?? ''} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? <><Check className="w-4 h-4" />Salvo!</> : <><Save className="w-4 h-4" />Salvar Alterações</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Configurações institucionais do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 bg-am-black rounded-xl inline-block">
                <AMLogoFull variant="light" size="md" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Razão Social</Label>
                  <Input defaultValue="Alvarez & Marsal Brasil Ltda." />
                </div>
                <div className="space-y-1.5">
                  <Label>CNPJ</Label>
                  <Input defaultValue="00.000.000/0001-00" />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input defaultValue="alvarezandmarsal.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>Fuso Horário</Label>
                  <Input defaultValue="America/Sao_Paulo (GMT-3)" />
                </div>
                <div className="space-y-1.5">
                  <Label>Moeda Padrão</Label>
                  <Input defaultValue="BRL — Real Brasileiro" />
                </div>
                <div className="space-y-1.5">
                  <Label>Idioma do Sistema</Label>
                  <Input defaultValue="Português (Brasil)" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Escritórios Cadastrados</h4>
                {['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte', 'Curitiba'].map(office => (
                  <div key={office} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{office}</span>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Editar</Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? <><Check className="w-4 h-4" />Salvo!</> : <><Save className="w-4 h-4" />Salvar Alterações</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure quando e como receber alertas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Novas entregas atribuídas', desc: 'Alertas quando uma entrega é atribuída a você', enabled: true },
                { label: 'Prazos se aproximando', desc: 'Notificação 3 dias antes do vencimento', enabled: true },
                { label: 'Mudanças de status', desc: 'Quando o status de um engagement muda', enabled: false },
                { label: 'Novos membros na equipe', desc: 'Quando alguém é adicionado ao seu engagement', enabled: true },
                { label: 'Relatórios semanais', desc: 'Resumo de performance toda segunda-feira', enabled: false },
                { label: 'Marcos atingidos', desc: 'Notificação quando um marco é concluído', enabled: true },
              ].map(({ label, desc, enabled }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <button
                    className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? 'bg-am-gold' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Gerencie sua senha e autenticação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Senha atual</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>Nova senha</Label>
                  <Input type="password" placeholder="Mínimo 8 caracteres" />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirmar nova senha</Label>
                  <Input type="password" placeholder="Repita a nova senha" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Autenticação de 2 Fatores</p>
                    <p className="text-xs text-emerald-600">Proteção adicional para sua conta</p>
                  </div>
                  <Badge variant="success">Ativo</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Sessões Ativas</p>
                    <p className="text-xs text-gray-500">Gerenciar dispositivos conectados</p>
                  </div>
                  <Button variant="outline" size="sm">Ver Sessões</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  {saved ? <><Check className="w-4 h-4" />Salvo!</> : <><Save className="w-4 h-4" />Atualizar Senha</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
