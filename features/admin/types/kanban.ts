import type { ApplicationStatus, DiscResult } from '../types/applicant'

export type KanbanColumn = ApplicationStatus

export interface KanbanApplication {
  id: string
  applicantId: string
  applicantName: string
  applicantEmail: string | null
  jobId: string
  jobTitle: string
  stage: KanbanColumn
  appliedAt: string
  lastUpdated: string
  avatar?: string
  discResult?: DiscResult | null
  interviewScore?: number | null
  interviewAnalysis?: string | null
  isInterviewAnalyzed?: boolean
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  'applied',
  'psychological-test',
  'ai-interview',
  'second-rating',
  'personal-interview',
  'approved',
  'rejected',
  'resigned',
]

export const KANBAN_COLUMN_LABELS: Record<KanbanColumn, string> = {
  applied: 'Applied (First Rating)',
  'psychological-test': 'Psychological test',
  'ai-interview': 'AI interview',
  'second-rating': 'Second rating',
  'personal-interview': 'Personal interview',
  approved: 'Approved',
  rejected: 'Rejected',
  resigned: 'Resigned',
}

export const KANBAN_COLUMN_COLORS: Record<KanbanColumn, string> = {
  applied: 'bg-gray-50',
  'psychological-test': 'bg-gray-50',
  'ai-interview': 'bg-gray-50',
  'second-rating': 'bg-gray-50',
  'personal-interview': 'bg-gray-50',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  resigned: 'bg-orange-100 text-orange-700 border-orange-200',
}

export const KANBAN_COLUMN_ORDER: KanbanColumn[] = [
  'applied',
  'psychological-test',
  'ai-interview',
  'second-rating',
  'personal-interview',
  'approved',
  'rejected',
  'resigned',
]

export const isKanbanColumn = (column: string): column is KanbanColumn => {
  return KANBAN_COLUMNS.includes(column as KanbanColumn)
}

export const KANBAN_STAGE_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  'psychological-test': 'Psychological test',
  'ai-interview': 'AI interview',
  'second-rating': 'Second rating',
  'personal-interview': 'Personal interview',
  approved: 'Approved',
  rejected: 'Rejected',
  resigned: 'Resigned',
}
