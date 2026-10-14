'use client';
import { JobDetails, useJobStore } from '@/lib/stores/jobStore'
import { useQuery } from '@tanstack/react-query'

const fetchJobData = async (): Promise<JobDetails[]> => {
  try {
    const response = await fetch('/api/job/open-jobs')
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.error ||
          `Failed to fetch job data: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data as JobDetails[]
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch job data')
  }
}
export const useGetOpenJob = () => {
  const { setJobDetails } = useJobStore()

  return useQuery<JobDetails[]>({
    queryKey: ['jobDetails'],
    queryFn: async () => {
      const data = await fetchJobData()
      setJobDetails(data)
      return data

    },
  })
}
