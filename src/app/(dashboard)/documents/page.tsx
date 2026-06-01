'use client'

import { FileText, Download, Upload, Search, Folder, File, FilePlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDateShort } from '@/lib/utils'
import { mockEngagements } from '@/lib/mock-data'

const docs = [
  { id: 'd1', name: 'Contrato de Prestação de Serviços', engagement: 'TechCorp Brasil S.A.', type: 'pdf', size: '1.2 MB', date: '2024-01-15', category: 'Contrato' },
  { id: 'd2', name: 'Diagnóstico Financeiro Completo v2.0', engagement: 'TechCorp Brasil S.A.', type: 'pdf', size: '4.8 MB', date: '2024-04-02', category: 'Entrega' },
  { id: 'd3', name: 'Plano de Reestruturação FINAL', engagement: 'TechCorp Brasil S.A.', type: 'pdf', size: '6.1 MB', date: '2024-06-18', category: 'Entrega' },
  { id: 'd4', name: 'Proposta Comercial — Banco Nacional', engagement: 'Banco Nacional Unido', type: 'pdf', size: '2.4 MB', date: '2024-02-28', category: 'Proposta' },
  { id: 'd5', name: 'Mapeamento As-Is Processos', engagement: 'Banco Nacional Unido', type: 'xlsx', size: '3.2 MB', date: '2024-05-12', category: 'Análise' },
  { id: 'd6', name: 'Relatório de Due Diligence Forense', engagement: 'Grupo Energia Renovável', type: 'pdf', size: '8.7 MB', date: '2024-05-31', category: 'Entrega' },
  { id: 'd7', name: 'Business Case — Transformação Digital', engagement: 'Agro Invest S.A.', type: 'pptx', size: '5.5 MB', date: '2024-08-15', category: 'Apresentação' },
  { id: 'd8', name: 'Diagnóstico Tributário', engagement: 'Manufatura Global Ltda.', type: 'pdf', size: '2.1 MB', date: '2024-09-01', category: 'Entrega' },
]

const typeColors: Record<string, string> = {
  pdf: 'bg-red-50 text-red-600',
  xlsx: 'bg-emerald-50 text-emerald-600',
  pptx: 'bg-orange-50 text-orange-600',
  docx: 'bg-blue-50 text-blue-600',
}

export default function DocumentsPage() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Repositório de documentos dos engagements</p>
        </div>
        <Button className="gap-2 self-start">
          <Upload className="w-4 h-4" />
          Fazer Upload
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Buscar documentos..." className="pl-9 h-9" />
          </div>
        </CardContent>
      </Card>

      {/* Folders by engagement */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pastas por Engagement</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {mockEngagements.slice(0, 5).map(e => (
            <button key={e.id} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 bg-white hover:border-am-gold/30 hover:shadow-sm transition-all group text-center">
              <Folder className="w-10 h-10 text-am-gold group-hover:scale-105 transition-transform" />
              <p className="text-xs font-semibold text-gray-700 leading-snug">{e.client}</p>
              <p className="text-[10px] text-gray-400">{e.code}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Documentos Recentes</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${typeColors[doc.type] ?? 'bg-gray-100 text-gray-600'}`}>
                    {doc.type.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.engagement}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">{doc.category}</Badge>
                  <span className="text-xs text-gray-400 hidden md:block w-14 text-right shrink-0">{doc.size}</span>
                  <span className="text-xs text-gray-400 hidden lg:block w-20 text-right shrink-0">{formatDateShort(doc.date)}</span>
                  <button className="p-1.5 rounded-md text-gray-300 hover:text-am-gold hover:bg-amber-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
