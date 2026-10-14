'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAdminJobStore } from '@/lib/stores/admin/jobStore'
import {
  CreateJobInput,
  UpdateJobInput,
  JobStatusInput,
  JobsListResponse,
  Job,
  CreateJobInterviewQuestionsInput,
  JobInterviewQuestions,
} from '../schemas/jobSchema'

const fetchJobs = async (
  page: number = 1,
  limit: number = 10
): Promise<JobsListResponse> => {
  const response = await fetch(`/api/admin/jobs?page=${page}&limit=${limit}`)
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to fetch jobs: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const createJob = async (data: CreateJobInput): Promise<Job> => {
  const response = await fetch('/api/admin/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to create job: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const updateJobApi = async ({ id, ...data }: UpdateJobInput): Promise<Job> => {
  const response = await fetch(`/api/admin/jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to update job: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const deleteJobApi = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/jobs/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to delete job: ${response.status} ${response.statusText}`
    )
  }
  return
}

const toggleJobStatus = async (data: JobStatusInput): Promise<Job> => {
  const response = await fetch(`/api/admin/jobs/${data.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive: data.isActive }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to update job status: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

export const useGetJobs = (page: number = 1, limit: number = 10) => {
  const { setJobs, setPagination, setLoading, setError } = useAdminJobStore()

  return useQuery<JobsListResponse>({
    queryKey: ['jobs', page, limit],
    queryFn: async () => {
      setLoading(true)
      try {
        const data = await fetchJobs(page, limit)
        setJobs(data.jobs)
        setPagination(data.pagination)
        setError(null)
        return data
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch jobs'
        setError(errorMessage)
        throw error
      } finally {
        setLoading(false)
      }
    },
    placeholderData: (previousData) => previousData,
  })
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()
  const { addJob } = useAdminJobStore()

  return useMutation<Job, Error, CreateJobInput>({
    mutationFn: createJob,
    onSuccess: (newJob) => {
      addJob(newJob)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobsStats'] })
    },
  })
}

export const useUpdateJob = () => {
  const queryClient = useQueryClient()
  const { updateJob } = useAdminJobStore()

  return useMutation<Job, Error, UpdateJobInput>({
    mutationFn: updateJobApi,
    onSuccess: (updatedJob) => {
      updateJob(updatedJob.id, updatedJob)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobsStats'] })
    },
  })
}

export const useDeleteJob = () => {
  const queryClient = useQueryClient()
  const { deleteJob } = useAdminJobStore()

  return useMutation<void, Error, string>({
    mutationFn: deleteJobApi,
    onSuccess: (_, deletedJobId) => {
      deleteJob(deletedJobId)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobsStats'] })
    },
  })
}

export const useToggleJobStatus = () => {
  const queryClient = useQueryClient()
  const { toggleJobStatus: toggleStatus } = useAdminJobStore()

  return useMutation<Job, Error, JobStatusInput>({
    mutationFn: toggleJobStatus,
    onSuccess: (updatedJob) => {
      toggleStatus(updatedJob.id)
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobsStats'] })
    },
  })
}

const createJobInterviewQuestions = async (
  data: CreateJobInterviewQuestionsInput
): Promise<JobInterviewQuestions> => {
  const response = await fetch('/api/admin/jobs/interview-questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to create job interview questions: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

export const useCreateJobInterviewQuestions = () => {
  const queryClient = useQueryClient()

  return useMutation<
    JobInterviewQuestions,
    Error,
    CreateJobInterviewQuestionsInput
  >({
    mutationFn: createJobInterviewQuestions,
    onSuccess: (newQuestions, data) => {
      queryClient.invalidateQueries({ queryKey: ['jobInterviewQuestions', data.jobId] })
    },
  })
}

const fetchJobInterviewQuestions = async (
  jobId: string
): Promise<JobInterviewQuestions> => {
  const response = await fetch(`/api/admin/jobs/${jobId}/interview-questions`)
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to fetch jobs: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

export const useGetJobInterviewQuestions = (jobId: string) => {
  const { setJobInterviewQuestions } = useAdminJobStore()

  return useQuery({
    queryKey: ['jobInterviewQuestions', jobId],
    queryFn: async () => {
      const data = await fetchJobInterviewQuestions(jobId)
      setJobInterviewQuestions(data)

      return data
    },
    enabled: !!jobId,
  })
}
