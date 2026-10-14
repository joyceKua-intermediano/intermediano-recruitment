import { z } from 'zod'
import type { IntiLanguage } from '@/features/ai-interview/types/language'

export const createJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  title: z.string().min(1, 'Job title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  type: z.string().min(1, 'Job type is required'),
  salary: z.string().min(1, 'Salary information is required'),
  essentialSkills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one essential skill is required'),
  responsibilities: z.array(z.string().min(1, 'Responsibility cannot be empty')).min(1, 'At least one responsibility is required'),
  qualifications: z.array(z.string().min(1, 'Qualification cannot be empty')).min(1, 'At least one qualification is required'),
  isActive: z.boolean().default(true),
})

export const createJobInterviewQuestions = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  interviewQuestions: z.array(z.string().min(1, 'Interview Questions cannot be empty')).min(1, 'At least one question is required'),
  intiLanguage: z.enum(['en', 'pt', 'es']).default('en'),
})

export const updateJobSchema = createJobSchema.partial().extend({
  id: z.string().min(1, 'Job ID is required'),
})

export const jobStatusSchema = z.object({
  id: z.string().min(1, 'Job ID is required'),
  isActive: z.boolean(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
export type JobStatusInput = z.infer<typeof jobStatusSchema>
export type CreateJobInterviewQuestionsInput = z.infer<typeof createJobInterviewQuestions>

export interface Job {
  id: string
  jobId: string
  title: string
  category: string
  description: string
  location: string
  type: string
  salary: string
  essentialSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count?: {
    applications: number
  }
}

export interface JobsListResponse {
  jobs: Job[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface JobInterviewQuestions {
  id: string
  jobId: string
  interviewQuestions: string[]
  intiLanguage: IntiLanguage
}
