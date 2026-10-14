"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Applicant, Application, Job, ApplicantsResponse } from '../types/applicant'

const fetchApplicants = async (
  page: number = 1,
  limit: number = 50,
  status?: string,
  jobId?: string
): Promise<ApplicantsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (status && status !== 'all') {
    params.append('status', status)
  }

  if (jobId && jobId !== 'all') {
    params.append('jobId', jobId)
  }

  const response = await fetch(`/api/admin/applicants?${params}`, {
    cache: 'no-store',
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message || `Failed to fetch applicants: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const updateApplicationStatus = async (applicationId: string, status: Application['status']): Promise<any> => {
  const response = await fetch(`/api/admin/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message || `Failed to update application status: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

export const useGetApplicants = (
  page: number = 1,
  limit: number = 50,
  status?: string,
  jobId?: string
) => {
  return useQuery<ApplicantsResponse>({
    queryKey: ['applicants', page, limit, status, jobId],
    queryFn: () => fetchApplicants(page, limit, status, jobId),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, { applicationId: string; status: Application['status'] }>({
    mutationFn: ({ applicationId, status }) => updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] })
      queryClient.invalidateQueries({ queryKey: ['applicantsStats'] })
      toast.success('Application status updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`)
    },
  })
}

export interface CreatedApplicantCredentials {
  id: string
  name: string
  email: string | null
  temporaryPassword: string | null
}

interface CreateApplicantResponse {
  applicant: {
    id: string
    name: string
    email: string | null
    createdAt: string
  }
  temporaryPassword: string | null
}

const createApplicant = async (
  formData: FormData
): Promise<CreateApplicantResponse> => {
  const response = await fetch('/api/admin/applicants', {
    method: 'POST',
    body: formData,
  })

  const errorData = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      errorData?.message ||
        `Failed to create applicant: ${response.status} ${response.statusText}`
    )
  }

  return errorData as CreateApplicantResponse
}

export const useCreateApplicant = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateApplicantResponse, Error, FormData>({
    mutationFn: createApplicant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['applicants'] })
      await queryClient.refetchQueries({ queryKey: ['applicants'] })
      queryClient.invalidateQueries({ queryKey: ['applicantsStats'] })
      toast.success('Applicant created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create applicant: ${error.message}`)
    },
  })
}

const createAdminApplication = async (data: {
  applicantId: string
  jobId: string
}): Promise<unknown> => {
  const response = await fetch('/api/admin/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const errorData = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(
      errorData?.message ||
        `Failed to create application: ${response.status} ${response.statusText}`
    )
  }

  return errorData
}

export const useAdminCreateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, Error, { applicantId: string; jobId: string }>({
    mutationFn: createAdminApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] })
      queryClient.invalidateQueries({ queryKey: ['applicantsStats'] })
      toast.success('Applicant applied to the job')
    },
    onError: (error) => {
      toast.error(`Failed to apply applicant: ${error.message}`)
    },
  })
}
