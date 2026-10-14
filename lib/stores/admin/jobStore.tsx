import { Job, JobsListResponse, JobInterviewQuestions } from '@/features/admin/schemas/jobSchema'
import { create } from 'zustand'

interface AdminJobStore {
  jobs: Job[]
  selectedJob: Job | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }

  isLoading: boolean
  error: string | null
  jobInterviewQuestions: JobInterviewQuestions | null

  setJobs: (jobs: Job[]) => void
  setJobInterviewQuestions: (jobInterviewQuestions: JobInterviewQuestions) => void
  setSelectedJob: (job: Job | null) => void
  setPagination: (pagination: AdminJobStore['pagination']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addJob: (job: Job) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  deleteJob: (id: string) => void
  toggleJobStatus: (id: string) => void
  clearJobs: () => void
}

export const useAdminJobStore = create<AdminJobStore>((set, get) => ({
  jobs: [],
  selectedJob: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  jobInterviewQuestions: null,
  setJobInterviewQuestions: (jobInterviewQuestions) => set({jobInterviewQuestions}),
  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  addJob: (job) => set((state) => ({
    jobs: [job, ...state.jobs],
    total: state.pagination.total + 1
  })),

  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map(job =>
      job.id === id ? { ...job, ...updates } : job
    ),
    selectedJob: state.selectedJob?.id === id
      ? { ...state.selectedJob, ...updates }
      : state.selectedJob
  })),

  deleteJob: (id) => set((state) => ({
    jobs: state.jobs.filter(job => job.id !== id),
    total: state.pagination.total - 1,
    selectedJob: state.selectedJob?.id === id ? null : state.selectedJob
  })),

  toggleJobStatus: (id) => set((state) => ({
    jobs: state.jobs.map(job =>
      job.id === id ? { ...job, isActive: !job.isActive } : job
    ),
    selectedJob: state.selectedJob?.id === id
      ? { ...state.selectedJob, isActive: !state.selectedJob.isActive }
      : state.selectedJob
  })),

  clearJobs: () => set({
    jobs: [],
    selectedJob: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  }),
}))
