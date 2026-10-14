"use client"

import { useQuery } from '@tanstack/react-query'
import { ApplicantsStatsSchema, JobsStatsSchema, ApplicationsStatsSchema, HireRateStatsSchema } from '../schemas/adminStatsSchema'
import { useAdminApplicantsStore, useAdminJobsStore, useAdminApplicationsStore, useAdminHireRateStore } from '@/lib/stores/admin/applicantsStore'

const fetchApplicantsStats = async (): Promise<ApplicantsStatsSchema> => {
  const response = await fetch('/api/admin/applicants/stats')
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to applicants stats: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const fetchJobsStats = async (): Promise<JobsStatsSchema> => {
  const response = await fetch('/api/admin/jobs/stats')
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to fetch jobs stats: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const fetchApplicationsStats = async (): Promise<ApplicationsStatsSchema> => {
  const response = await fetch('/api/admin/applications/stats')
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to fetch applications stats: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

const fetchHireRateStats = async (): Promise<HireRateStatsSchema> => {
  const response = await fetch('/api/admin/hire-rate/stats')
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message ||
        `Failed to fetch hire rate stats: ${response.status} ${response.statusText}`
    )
  }
  return response.json()
}

export const useGetApplicantsStats = () => {
  const { setApplicantsStats } = useAdminApplicantsStore()
  return useQuery<ApplicantsStatsSchema>({
    queryKey: ['applicantsStats'],
    queryFn: async () => {
        const data = await fetchApplicantsStats()
        if(data) {
            setApplicantsStats(data)
        }
        return data
    }
  })
}

export const useGetJobsStats = () => {
  const { setJobsStats } = useAdminJobsStore()
  return useQuery<JobsStatsSchema>({
    queryKey: ['jobsStats'],
    queryFn: async () => {
        const data = await fetchJobsStats()
        if(data) {
            setJobsStats(data)
        }
        return data
    }
  })
}

export const useGetApplicationsStats = () => {
  const { setApplicationsStats } = useAdminApplicationsStore()
  return useQuery<ApplicationsStatsSchema>({
    queryKey: ['applicationsStats'],
    queryFn: async () => {
        const data = await fetchApplicationsStats()
        if(data) {
            setApplicationsStats(data)
        }
        return data
    }
  })
}

export const useGetHireRateStats = () => {
  const { setHireRateStats } = useAdminHireRateStore()
  return useQuery<HireRateStatsSchema>({
    queryKey: ['hireRateStats'],
    queryFn: async () => {
        const data = await fetchHireRateStats()
        if(data) {
            setHireRateStats(data)
        }
        return data
    }
  })
}
