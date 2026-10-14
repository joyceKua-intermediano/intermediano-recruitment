import { ApplicantsStatsSchema, JobsStatsSchema, ApplicationsStatsSchema, HireRateStatsSchema } from '@/features/admin/schemas/adminStatsSchema'
import { create } from 'zustand'

interface AdminApplicantsStore {
  applicantsStats?: ApplicantsStatsSchema
  setApplicantsStats: (data: ApplicantsStatsSchema) => void
}

interface AdminJobsStore {
  jobsStats?: JobsStatsSchema
  setJobsStats: (data: JobsStatsSchema) => void
}

interface AdminApplicationsStore {
  applicationsStats?: ApplicationsStatsSchema
  setApplicationsStats: (data: ApplicationsStatsSchema) => void
}

interface AdminHireRateStore {
  hireRateStats?: HireRateStatsSchema
  setHireRateStats: (data: HireRateStatsSchema) => void
}

export const useAdminApplicantsStore = create<AdminApplicantsStore>((set) => ({
  applicantsStats: undefined,
  setApplicantsStats: (data) => set({ applicantsStats: data }),
}))

export const useAdminJobsStore = create<AdminJobsStore>((set) => ({
  jobsStats: undefined,
  setJobsStats: (data) => set({ jobsStats: data }),
}))

export const useAdminApplicationsStore = create<AdminApplicationsStore>((set) => ({
  applicationsStats: undefined,
  setApplicationsStats: (data) => set({ applicationsStats: data }),
}))

export const useAdminHireRateStore = create<AdminHireRateStore>((set) => ({
  hireRateStats: undefined,
  setHireRateStats: (data) => set({ hireRateStats: data }),
}))
