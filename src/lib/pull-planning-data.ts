export type Discipline = 'civil' | 'eletrica' | 'metalmec' | 'instrumentacao' | 'automacao' | 'execucao'

export interface PlanCard {
  id: string
  title: string
  discipline: Discipline
  responsible: string
  startDay: number  // day index from timeline start (0-based)
  duration: number  // days
  packageId: string
  projectId: string
  status: 'pending' | 'in_progress' | 'completed' | 'restricted'
  observations?: string
  predecessorId?: string  // ID do card predecessora
}

export interface WorkPackage {
  id: string
  name: string
  projectId: string
  startDate: string
  endDate: string
  cards: PlanCard[]
}

export interface PullProject {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  team: number
  packages: WorkPackage[]
}

export const disciplineConfig: Record<Discipline, { label: string; color: string; bg: string; border: string }> = {
  metalmec: { label: 'Metalmecânica', color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300' },
  eletrica: { label: 'Elétrica', color: 'text-pink-700', bg: 'bg-pink-100', border: 'border-pink-300' },
  civil: { label: 'Civil', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' },
  execucao: { label: 'Execução', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' },
  instrumentacao: { label: 'Instrumentação', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-300' },
  automacao: { label: 'Automação', color: 'text-cyan-700', bg: 'bg-cyan-100', border: 'border-cyan-300' },
}

// Initial sample data
export const initialProjects: PullProject[] = [
  {
    id: 'p1',
    name: 'Rio Verde - Entrega 30% armazenagem de grãos',
    location: 'Rio Verde',
    startDate: '2026-04-30',
    endDate: '2026-06-30',
    team: 4,
    packages: [
      {
        id: 'pkg1', name: 'Moega', projectId: 'p1',
        startDate: '2026-04-20', endDate: '2026-06-26',
        cards: [
          { id: 'c1', title: 'Fundação', discipline: 'civil', responsible: 'Ta', startDay: 0, duration: 3, packageId: 'pkg1', projectId: 'p1', status: 'in_progress' },
          { id: 'c2', title: 'Estrutura Metálica', discipline: 'metalmec', responsible: 'Ri', startDay: 5, duration: 4, packageId: 'pkg1', projectId: 'p1', status: 'pending' },
          { id: 'c3', title: 'Elétrica Geral', discipline: 'eletrica', responsible: 'Ta', startDay: 10, duration: 3, packageId: 'pkg1', projectId: 'p1', status: 'pending' },
          { id: 'c4', title: 'Finalização', discipline: 'execucao', responsible: 'M', startDay: 16, duration: 2, packageId: 'pkg1', projectId: 'p1', status: 'pending' },
        ],
      },
      {
        id: 'pkg2', name: 'TT01', projectId: 'p1',
        startDate: '2026-04-20', endDate: '2026-06-20',
        cards: [
          { id: 'c5', title: 'Instalação Base', discipline: 'civil', responsible: 'I', startDay: 2, duration: 3, packageId: 'pkg2', projectId: 'p1', status: 'in_progress' },
          { id: 'c6', title: 'Equipamentos', discipline: 'metalmec', responsible: 'Ta', startDay: 7, duration: 4, packageId: 'pkg2', projectId: 'p1', status: 'pending' },
          { id: 'c7', title: 'Instrumentação', discipline: 'instrumentacao', responsible: 'Di', startDay: 13, duration: 3, packageId: 'pkg2', projectId: 'p1', status: 'pending' },
          { id: 'c8', title: 'Comissionamento', discipline: 'execucao', responsible: 'Er', startDay: 18, duration: 2, packageId: 'pkg2', projectId: 'p1', status: 'pending' },
        ],
      },
      {
        id: 'pkg3', name: 'Transportador TR01', projectId: 'p1',
        startDate: '2026-05-01', endDate: '2026-06-25',
        cards: [
          { id: 'c9', title: 'Estrutura', discipline: 'metalmec', responsible: 'Ta', startDay: 4, duration: 5, packageId: 'pkg3', projectId: 'p1', status: 'pending' },
          { id: 'c10', title: 'Automação', discipline: 'automacao', responsible: 'Ri', startDay: 12, duration: 3, packageId: 'pkg3', projectId: 'p1', status: 'pending' },
        ],
      },
    ],
  },
  {
    id: 'p2',
    name: '[DOURADOS] Pavimentação Flexível',
    location: 'Dourados',
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    team: 3,
    packages: [
      {
        id: 'pkg4', name: 'Terraplenagem', projectId: 'p2',
        startDate: '2026-05-01', endDate: '2026-06-30',
        cards: [
          { id: 'c11', title: 'Escavação', discipline: 'civil', responsible: 'Jo', startDay: 0, duration: 5, packageId: 'pkg4', projectId: 'p2', status: 'pending' },
          { id: 'c12', title: 'Compactação', discipline: 'execucao', responsible: 'Ma', startDay: 7, duration: 4, packageId: 'pkg4', projectId: 'p2', status: 'pending' },
        ],
      },
    ],
  },
]
