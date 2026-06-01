import type { Engagement, User, Deliverable, Activity, ChartDataPoint, RevenueByPractice } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'u1', name: 'Ricardo Almeida', email: 'r.almeida@alvarezandmarsal.com',
    level: 'managing_director', practiceArea: 'restructuring', office: 'São Paulo',
    avatarInitials: 'RA', utilization: 92, activeEngagements: 3, joinDate: '2018-03-01',
  },
  {
    id: 'u2', name: 'Fernanda Costa', email: 'f.costa@alvarezandmarsal.com',
    level: 'senior_director', practiceArea: 'performance', office: 'Rio de Janeiro',
    avatarInitials: 'FC', utilization: 88, activeEngagements: 2, joinDate: '2019-07-15',
  },
  {
    id: 'u3', name: 'Carlos Mendes', email: 'c.mendes@alvarezandmarsal.com',
    level: 'director', practiceArea: 'strategy', office: 'São Paulo',
    avatarInitials: 'CM', utilization: 78, activeEngagements: 2, joinDate: '2020-01-10',
  },
  {
    id: 'u4', name: 'Ana Paula Santos', email: 'ap.santos@alvarezandmarsal.com',
    level: 'manager', practiceArea: 'restructuring', office: 'São Paulo',
    avatarInitials: 'AS', utilization: 95, activeEngagements: 3, joinDate: '2021-04-20',
  },
  {
    id: 'u5', name: 'Thiago Oliveira', email: 't.oliveira@alvarezandmarsal.com',
    level: 'manager', practiceArea: 'performance', office: 'Brasília',
    avatarInitials: 'TO', utilization: 85, activeEngagements: 2, joinDate: '2021-09-01',
  },
  {
    id: 'u6', name: 'Mariana Lima', email: 'm.lima@alvarezandmarsal.com',
    level: 'associate', practiceArea: 'restructuring', office: 'São Paulo',
    avatarInitials: 'ML', utilization: 100, activeEngagements: 2, joinDate: '2022-06-13',
  },
  {
    id: 'u7', name: 'Pedro Souza', email: 'p.souza@alvarezandmarsal.com',
    level: 'analyst', practiceArea: 'strategy', office: 'São Paulo',
    avatarInitials: 'PS', utilization: 90, activeEngagements: 2, joinDate: '2023-01-16',
  },
  {
    id: 'u8', name: 'Beatriz Ferreira', email: 'b.ferreira@alvarezandmarsal.com',
    level: 'senior_director', practiceArea: 'disputes', office: 'São Paulo',
    avatarInitials: 'BF', utilization: 82, activeEngagements: 2, joinDate: '2019-11-05',
  },
  {
    id: 'u9', name: 'Rodrigo Barros', email: 'r.barros@alvarezandmarsal.com',
    level: 'director', practiceArea: 'tax', office: 'Curitiba',
    avatarInitials: 'RB', utilization: 74, activeEngagements: 1, joinDate: '2020-08-22',
  },
  {
    id: 'u10', name: 'Isabela Rocha', email: 'i.rocha@alvarezandmarsal.com',
    level: 'associate', practiceArea: 'healthcare', office: 'São Paulo',
    avatarInitials: 'IR', utilization: 88, activeEngagements: 2, joinDate: '2022-03-07',
  },
]

export const mockEngagements: Engagement[] = [
  {
    id: 'e1', code: 'BR-2024-001',
    name: 'Reestruturação Financeira', client: 'TechCorp Brasil S.A.',
    practiceArea: 'restructuring', status: 'active',
    leadMD: 'Ricardo Almeida', team: ['u1', 'u4', 'u6'],
    startDate: '2024-01-15', endDate: '2024-09-30',
    budget: 4_800_000, billedToDate: 3_920_000, progress: 85,
    office: 'São Paulo', description: 'Reestruturação abrangente de passivos financeiros e otimização de estrutura de capital para grupo de tecnologia com R$ 2,1B em dívidas.',
    deliverables: [
      { id: 'd1', title: 'Diagnóstico Financeiro Completo', dueDate: '2024-03-30', status: 'completed', assignedTo: 'Ana Paula Santos', engagementId: 'e1', priority: 'high' },
      { id: 'd2', title: 'Plano de Reestruturação de Dívida', dueDate: '2024-06-15', status: 'completed', assignedTo: 'Ricardo Almeida', engagementId: 'e1', priority: 'critical' },
      { id: 'd3', title: 'Negociação com Credores', dueDate: '2024-08-30', status: 'in_progress', assignedTo: 'Mariana Lima', engagementId: 'e1', priority: 'critical' },
      { id: 'd4', title: 'Relatório Final & Implementação', dueDate: '2024-09-30', status: 'pending', assignedTo: 'Ricardo Almeida', engagementId: 'e1', priority: 'high' },
    ],
    milestones: [
      { id: 'm1', title: 'Kick-off e coleta de dados', date: '2024-01-20', completed: true, engagementId: 'e1' },
      { id: 'm2', title: 'Aprovação do diagnóstico', date: '2024-04-05', completed: true, engagementId: 'e1' },
      { id: 'm3', title: 'Acordo com credores principais', date: '2024-07-31', completed: true, engagementId: 'e1' },
      { id: 'm4', title: 'Entrega final', date: '2024-09-30', completed: false, engagementId: 'e1' },
    ],
  },
  {
    id: 'e2', code: 'BR-2024-002',
    name: 'Transformação Operacional', client: 'Banco Nacional Unido',
    practiceArea: 'performance', status: 'active',
    leadMD: 'Fernanda Costa', team: ['u2', 'u5', 'u7'],
    startDate: '2024-03-01', endDate: '2024-12-31',
    budget: 6_200_000, billedToDate: 3_844_000, progress: 62,
    office: 'Rio de Janeiro', description: 'Programa de transformação operacional focado em redução de custos de 30% e digitalização de processos de back-office em instituição financeira de médio porte.',
    deliverables: [
      { id: 'd5', title: 'Mapeamento de Processos As-Is', dueDate: '2024-04-30', status: 'completed', assignedTo: 'Thiago Oliveira', engagementId: 'e2', priority: 'high' },
      { id: 'd6', title: 'Business Case de Transformação', dueDate: '2024-06-30', status: 'completed', assignedTo: 'Fernanda Costa', engagementId: 'e2', priority: 'high' },
      { id: 'd7', title: 'Implementação Fase 1 (Processos)', dueDate: '2024-09-30', status: 'in_progress', assignedTo: 'Pedro Souza', engagementId: 'e2', priority: 'critical' },
      { id: 'd8', title: 'Implementação Fase 2 (TI)', dueDate: '2024-12-15', status: 'pending', assignedTo: 'Thiago Oliveira', engagementId: 'e2', priority: 'high' },
    ],
    milestones: [
      { id: 'm5', title: 'Diagnóstico operacional', date: '2024-04-01', completed: true, engagementId: 'e2' },
      { id: 'm6', title: 'Aprovação do roadmap', date: '2024-06-30', completed: true, engagementId: 'e2' },
      { id: 'm7', title: 'Go-live Fase 1', date: '2024-10-01', completed: false, engagementId: 'e2' },
      { id: 'm8', title: 'Entrega final', date: '2024-12-31', completed: false, engagementId: 'e2' },
    ],
  },
  {
    id: 'e3', code: 'BR-2024-003',
    name: 'Due Diligence Forense', client: 'Grupo Energia Renovável',
    practiceArea: 'disputes', status: 'completed',
    leadMD: 'Beatriz Ferreira', team: ['u8'],
    startDate: '2024-01-10', endDate: '2024-05-31',
    budget: 2_100_000, billedToDate: 2_100_000, progress: 100,
    office: 'São Paulo', description: 'Investigação forense e due diligence em operação de M&A de R$ 800M no setor de energia renovável.',
    deliverables: [
      { id: 'd9', title: 'Relatório de Investigação Forense', dueDate: '2024-04-30', status: 'completed', assignedTo: 'Beatriz Ferreira', engagementId: 'e3', priority: 'critical' },
      { id: 'd10', title: 'Parecer Final de Due Diligence', dueDate: '2024-05-31', status: 'completed', assignedTo: 'Beatriz Ferreira', engagementId: 'e3', priority: 'high' },
    ],
    milestones: [
      { id: 'm9', title: 'Início da investigação', date: '2024-01-15', completed: true, engagementId: 'e3' },
      { id: 'm10', title: 'Conclusão da fase documental', date: '2024-03-31', completed: true, engagementId: 'e3' },
      { id: 'm11', title: 'Entrega final', date: '2024-05-31', completed: true, engagementId: 'e3' },
    ],
  },
  {
    id: 'e4', code: 'BR-2024-004',
    name: 'Otimização de Rede Logística', client: 'Varejo Premium Brasil',
    practiceArea: 'performance', status: 'active',
    leadMD: 'Fernanda Costa', team: ['u2', 'u5', 'u10'],
    startDate: '2024-04-01', endDate: '2025-01-31',
    budget: 3_500_000, billedToDate: 1_575_000, progress: 45,
    office: 'São Paulo', description: 'Redesenho da rede de distribuição e otimização de estoque para varejista com 320 lojas em todo o Brasil.',
    deliverables: [
      { id: 'd11', title: 'Análise da Rede Atual', dueDate: '2024-06-30', status: 'completed', assignedTo: 'Thiago Oliveira', engagementId: 'e4', priority: 'high' },
      { id: 'd12', title: 'Modelo de Otimização', dueDate: '2024-09-30', status: 'in_progress', assignedTo: 'Isabela Rocha', engagementId: 'e4', priority: 'high' },
      { id: 'd13', title: 'Plano de Implementação', dueDate: '2024-11-30', status: 'pending', assignedTo: 'Fernanda Costa', engagementId: 'e4', priority: 'medium' },
    ],
    milestones: [
      { id: 'm12', title: 'Diagnóstico concluído', date: '2024-06-30', completed: true, engagementId: 'e4' },
      { id: 'm13', title: 'Validação do modelo', date: '2024-10-15', completed: false, engagementId: 'e4' },
    ],
  },
  {
    id: 'e5', code: 'BR-2024-005',
    name: 'Reestruturação de Passivo', client: 'Industrial Pesada S.A.',
    practiceArea: 'restructuring', status: 'on_hold',
    leadMD: 'Ricardo Almeida', team: ['u1', 'u4'],
    startDate: '2024-02-01', endDate: '2024-10-31',
    budget: 5_100_000, billedToDate: 1_530_000, progress: 30,
    office: 'São Paulo', description: 'Reestruturação de passivo trabalhista e financeiro de empresa industrial com mais de R$ 3B em obrigações.',
    deliverables: [
      { id: 'd14', title: 'Inventário de Passivos', dueDate: '2024-04-30', status: 'completed', assignedTo: 'Ana Paula Santos', engagementId: 'e5', priority: 'high' },
      { id: 'd15', title: 'Estratégia de Reestruturação', dueDate: '2024-07-31', status: 'blocked', assignedTo: 'Ricardo Almeida', engagementId: 'e5', priority: 'critical' },
    ],
    milestones: [
      { id: 'm14', title: 'Mapeamento de passivos', date: '2024-04-30', completed: true, engagementId: 'e5' },
      { id: 'm15', title: 'Aprovação da estratégia', date: '2024-07-31', completed: false, engagementId: 'e5' },
    ],
  },
  {
    id: 'e6', code: 'BR-2024-006',
    name: 'Estratégia de Crescimento', client: 'Saúde Plus Hospitais',
    practiceArea: 'healthcare', status: 'active',
    leadMD: 'Carlos Mendes', team: ['u3', 'u7', 'u10'],
    startDate: '2024-05-01', endDate: '2024-11-30',
    budget: 2_800_000, billedToDate: 2_184_000, progress: 78,
    office: 'São Paulo', description: 'Definição de estratégia de expansão e modelo operacional para rede hospitalar com 18 unidades e planos de crescimento para 35 unidades até 2027.',
    deliverables: [
      { id: 'd16', title: 'Análise de Mercado', dueDate: '2024-06-30', status: 'completed', assignedTo: 'Carlos Mendes', engagementId: 'e6', priority: 'high' },
      { id: 'd17', title: 'Estratégia de Expansão', dueDate: '2024-09-30', status: 'completed', assignedTo: 'Pedro Souza', engagementId: 'e6', priority: 'high' },
      { id: 'd18', title: 'Plano de Execução 3 Anos', dueDate: '2024-11-30', status: 'in_progress', assignedTo: 'Isabela Rocha', engagementId: 'e6', priority: 'high' },
    ],
    milestones: [
      { id: 'm16', title: 'Validação diagnóstico', date: '2024-07-01', completed: true, engagementId: 'e6' },
      { id: 'm17', title: 'Apresentação ao board', date: '2024-10-01', completed: true, engagementId: 'e6' },
      { id: 'm18', title: 'Entrega do plano final', date: '2024-11-30', completed: false, engagementId: 'e6' },
    ],
  },
  {
    id: 'e7', code: 'BR-2024-007',
    name: 'Planejamento Tributário', client: 'Manufatura Global Ltda.',
    practiceArea: 'tax', status: 'active',
    leadMD: 'Rodrigo Barros', team: ['u9'],
    startDate: '2024-06-01', endDate: '2024-12-31',
    budget: 1_800_000, billedToDate: 900_000, progress: 50,
    office: 'Curitiba', description: 'Revisão e otimização da estrutura tributária de grupo industrial com operações em 8 estados.',
    deliverables: [
      { id: 'd19', title: 'Diagnóstico Tributário', dueDate: '2024-08-31', status: 'completed', assignedTo: 'Rodrigo Barros', engagementId: 'e7', priority: 'high' },
      { id: 'd20', title: 'Plano de Otimização Fiscal', dueDate: '2024-12-15', status: 'in_progress', assignedTo: 'Rodrigo Barros', engagementId: 'e7', priority: 'high' },
    ],
    milestones: [
      { id: 'm19', title: 'Diagnóstico aprovado', date: '2024-09-01', completed: true, engagementId: 'e7' },
      { id: 'm20', title: 'Entrega do plano', date: '2024-12-15', completed: false, engagementId: 'e7' },
    ],
  },
  {
    id: 'e8', code: 'BR-2024-008',
    name: 'Transformação Digital', client: 'Agro Invest S.A.',
    practiceArea: 'strategy', status: 'active',
    leadMD: 'Carlos Mendes', team: ['u3', 'u7'],
    startDate: '2024-07-01', endDate: '2025-03-31',
    budget: 3_200_000, billedToDate: 800_000, progress: 25,
    office: 'São Paulo', description: 'Desenvolvimento de roadmap de transformação digital para grupo agroindustrial com faturamento de R$ 4B.',
    deliverables: [
      { id: 'd21', title: 'Assessment Digital', dueDate: '2024-09-30', status: 'in_progress', assignedTo: 'Carlos Mendes', engagementId: 'e8', priority: 'high' },
      { id: 'd22', title: 'Roadmap de Transformação', dueDate: '2024-12-31', status: 'pending', assignedTo: 'Pedro Souza', engagementId: 'e8', priority: 'high' },
    ],
    milestones: [
      { id: 'm21', title: 'Kick-off realizado', date: '2024-07-05', completed: true, engagementId: 'e8' },
      { id: 'm22', title: 'Assessment concluído', date: '2024-09-30', completed: false, engagementId: 'e8' },
    ],
  },
]

export const revenueChartData: ChartDataPoint[] = [
  { month: 'Jan', value: 1_800_000, secondary: 1_400_000 },
  { month: 'Fev', value: 2_100_000, secondary: 1_600_000 },
  { month: 'Mar', value: 2_400_000, secondary: 1_900_000 },
  { month: 'Abr', value: 2_200_000, secondary: 2_100_000 },
  { month: 'Mai', value: 3_100_000, secondary: 2_300_000 },
  { month: 'Jun', value: 2_800_000, secondary: 2_500_000 },
  { month: 'Jul', value: 3_400_000, secondary: 2_700_000 },
  { month: 'Ago', value: 3_200_000, secondary: 2_900_000 },
  { month: 'Set', value: 3_600_000, secondary: 3_100_000 },
]

export const engagementsByStatus: ChartDataPoint[] = [
  { month: 'Jan', value: 5 },
  { month: 'Fev', value: 5 },
  { month: 'Mar', value: 6 },
  { month: 'Abr', value: 7 },
  { month: 'Mai', value: 7 },
  { month: 'Jun', value: 8 },
  { month: 'Jul', value: 8 },
  { month: 'Ago', value: 8 },
  { month: 'Set', value: 8 },
]

export const revenueByPractice: RevenueByPractice[] = [
  { name: 'Reestruturação', value: 38, color: '#C4973B' },
  { name: 'Melhoria de Desempenho', value: 27, color: '#1A2D3F' },
  { name: 'Estratégia', value: 16, color: '#3B82F6' },
  { name: 'Disputas & Inv.', value: 10, color: '#8B5CF6' },
  { name: 'Outros', value: 9, color: '#9CA3AF' },
]

export const recentActivities: Activity[] = [
  { id: 'a1', type: 'milestone_reached', description: 'Acordo com credores principais atingido', engagement: 'TechCorp Brasil S.A.', user: 'Ricardo Almeida', timestamp: '2024-09-10T14:30:00Z' },
  { id: 'a2', type: 'deliverable_completed', description: 'Entrega: Estratégia de Expansão aprovada', engagement: 'Saúde Plus Hospitais', user: 'Carlos Mendes', timestamp: '2024-09-09T11:15:00Z' },
  { id: 'a3', type: 'engagement_created', description: 'Novo engagement iniciado', engagement: 'Agro Invest S.A.', user: 'Carlos Mendes', timestamp: '2024-09-08T09:00:00Z' },
  { id: 'a4', type: 'team_added', description: 'Isabela Rocha alocada ao projeto', engagement: 'Varejo Premium Brasil', user: 'Fernanda Costa', timestamp: '2024-09-07T16:45:00Z' },
  { id: 'a5', type: 'deliverable_completed', description: 'Diagnóstico Tributário entregue e aprovado', engagement: 'Manufatura Global Ltda.', user: 'Rodrigo Barros', timestamp: '2024-09-06T13:20:00Z' },
  { id: 'a6', type: 'status_changed', description: 'Engagement suspenso aguardando documentação judicial', engagement: 'Industrial Pesada S.A.', user: 'Ricardo Almeida', timestamp: '2024-09-05T10:30:00Z' },
]

export const currentUser = {
  id: 'u1',
  name: 'Ricardo Almeida',
  email: 'r.almeida@alvarezandmarsal.com',
  level: 'managing_director' as const,
  practiceArea: 'restructuring' as const,
  office: 'São Paulo',
  avatarInitials: 'RA',
}
