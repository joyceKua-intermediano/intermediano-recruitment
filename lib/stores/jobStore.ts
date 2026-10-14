import { create } from 'zustand'

export interface JobDetails {
  id: string
  jobId: string
  title: string
  category: string
  description: string
  location: string
  salary: string
  type: string
  essentialSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface JobStore {
  jobDetails?: JobDetails[]
  setJobDetails: (data: JobDetails[]) => void
}

export const useJobStore = create<JobStore>((set) => ({
  jobDetails: undefined,
  setJobDetails: (data) => set({ jobDetails: data }),
}))
