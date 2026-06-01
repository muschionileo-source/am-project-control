export type EngagementStatus = 'active' | 'completed' | 'on_hold' | 'cancelled'
export type PracticeArea = 'restructuring' | 'performance' | 'disputes' | 'tax' | 'real_estate' | 'strategy' | 'healthcare'
export type ConsultantLevel = 'managing_director' | 'senior_director' | 'director' | 'manager' | 'associate' | 'analyst'
export type TaskStatus = 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface User {
  id: string
  name: string
  email: string
  level: ConsultantLevel
  practiceArea: PracticeArea
  office: string
  avatarInitials: string
  utilization: number
  activeEngagements: number
  phone?: string
  joinDate: string
}

export interface Engagement {
  id: string
  code: string
  name: string
  client: string
  practiceArea: PracticeArea
  status: EngagementStatus
  leadMD: string
  team: string[]
  startDate: string
  endDate: string
  budget: number
  billedToDate: number
  progress: number
  office: string
  description: string
  deliverables: Deliverable[]
  milestones: Milestone[]
}

export interface Deliverable {
  id: string
  title: string
  dueDate: string
  status: TaskStatus
  assignedTo: string
  engagementId: string
  priority: TaskPriority
  description?: string
}

export interface Milestone {
  id: string
  title: string
  date: string
  completed: boolean
  engagementId: string
}

export interface KPI {
  label: string
  value: string | number
  change: number
  changeLabel: string
  trend: 'up' | 'down' | 'neutral'
}

export interface ChartDataPoint {
  month: string
  value: number
  secondary?: number
}

export interface RevenueByPractice {
  name: string
  value: number
  color: string
}

export interface Activity {
  id: string
  type: 'engagement_created' | 'deliverable_completed' | 'team_added' | 'milestone_reached' | 'status_changed'
  description: string
  engagement: string
  user: string
  timestamp: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  level: ConsultantLevel
  practiceArea: PracticeArea
  office: string
  avatarInitials: string
}
