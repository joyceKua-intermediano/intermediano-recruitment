import { 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle,
  Brain,
  MessageSquare,
  UserCheck,
  Briefcase,
  AlertCircle
} from 'lucide-react'
import { ApplicationStatus } from '../types/applicant'

export const statusColors: Record<ApplicationStatus, string> = {
  applied: 'bg-gray-100 text-gray-700',
  'psychological-test': 'bg-purple-100 text-purple-700',
  'ai-interview': 'bg-indigo-100 text-indigo-700',
  'second-rating': 'bg-cyan-100 text-cyan-700',
  'personal-interview': 'bg-teal-100 text-teal-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  resigned: 'bg-orange-100 text-orange-700'
}

export const statusIcons: Record<ApplicationStatus, any> = {
  applied: Clock,
  'psychological-test': Brain,
  'ai-interview': MessageSquare,
  'second-rating': UserCheck,
  'personal-interview': UserCheck,
  approved: CheckCircle,
  rejected: XCircle,
  resigned: AlertCircle
}

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'registered', label: 'Registered' },
  { value: 'applied', label: 'Applied' },
  { value: 'psychological-test', label: 'Psychological Test' },
  { value: 'ai-interview', label: 'AI Interview' },
  { value: 'second-rating', label: 'Second Rating' },
  { value: 'personal-interview', label: 'Personal Interview' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'resigned', label: 'Resigned' }
] as const

export const RANKING_SORT_OPTIONS = [
  { value: 'totalScore', label: 'Overall Score' },
  { value: 'skillMatch', label: 'Skill Match' },
  { value: 'experienceLevel', label: 'Experience Level' },
  { value: 'resumeCompleteness', label: 'Profile Completeness' },
  { value: 'applicationRecency', label: 'Recent Activity' },
  { value: 'jobMatchScore', label: 'Job Match Score' },
  { value: 'aiInterviewScore', label: 'AI Interview Score' }
] as const

export const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: 'High to Low' },
  { value: 'asc', label: 'Low to High' }
] as const

export const SUPPORTED_FILE_TYPES = {
  PDF: ['.pdf'],
  IMAGES: ['.jpg', '.jpeg', '.png'],
  DOCUMENTS: ['.txt', '.doc', '.docx']
} as const

export const DEFAULT_PAGE_SIZE = 50
export const DEFAULT_PAGE = 1
