export interface DiscResult {
  naturalProfile: { D: number; I: number; S: number; C: number }
  adaptedProfile: { D: number; I: number; S: number; C: number }
}

export interface Applicant {
  id: string
  name: string
  email: string | null
  mobile: string
  city: string
  country: string
  birthDate: string
  avatar?: string
  skills: Array<{ name: string; years: number }>
  resumeFileName?: string
  resumeFileSize?: number
  discResult?: DiscResult | null
  createdAt: string
  applications: Application[]
}

export interface InterviewResponse {
  id: string
  questionId: string
  questionText: string
  questionIndex: number
  transcript: string
  acknowledgement: string | null
  videoId: string | null
  isFollowUp: boolean
  isRetry: boolean
  retryCount: number
  score: number | null
  analysis: string | null
  answeredAt: string
  createdAt: string
}

export interface InterviewSession {
  id: string
  status: string
  startedAt: string
  completedAt: string | null
  averageScore: number | null
  isAnalyzed: boolean
  responses: InterviewResponse[]
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  status: 'applied' | 'psychological-test' | 'ai-interview' | 'second-rating' | 'personal-interview' | 'approved' | 'rejected' | 'resigned'
  appliedAt: string
  lastUpdated: string
  notes?: string
  jobLocation?: string
  jobType?: string
  jobIsActive?: boolean
  interviewSession?: InterviewSession | null
}

export interface Job {
  id: string
  title: string
  category: string
  location: string
  type: string
  isActive: boolean
  postedDate: string
  applicationCount: number
  displayName: string
}

export interface ApplicantsResponse {
  applicants: Applicant[]
  availableJobs: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface RankingCriteria {
  skillMatch: number
  experienceLevel: number
  resumeCompleteness: number
  applicationRecency: number
  totalScore: number
}

export interface RankedApplicant extends Omit<Applicant, 'applications'> {
  applications: Array<{
    id: string
    jobId: string
    jobTitle: string
    status: string
    appliedAt: string
    lastUpdated: string
    jobLocation?: string
    jobType?: string
    jobIsActive?: boolean
  }>
  ranking: RankingCriteria
  jobMatchScore?: number
}

export interface RankingResponse {
  applicants: RankedApplicant[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
  }
  job?: {
    id: string
    title: string
    essentialSkills: string[]
    category: string
    location: string
    type: string
  }
  rankingCriteria: {
    skillMatch: string
    experienceLevel: string
    resumeCompleteness: string
    applicationRecency: string
  }
}

export type ApplicationStatus = Application['status']
export type ViewMode = 'list' | 'ranking'
export type SortOrder = 'asc' | 'desc'
