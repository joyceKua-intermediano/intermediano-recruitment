import { useQuery } from '@tanstack/react-query'

interface JobDetails {
  id: string
  jobId: string
  title: string
  essentialSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  description: string
  location: string
  type: string
  salary: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface JobDetailsResponse {
  job: JobDetails
}

export const useGetJobDetails = (jobId: string | null) => {
  return useQuery<JobDetailsResponse>({
    queryKey: ['jobDetails', jobId],
    queryFn: async () => {
      if (!jobId) {
        throw new Error('Job ID is required')
      }

      const response = await fetch(`/api/job/job-details?jobId=${encodeURIComponent(jobId)}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch job details')
      }

      return response.json()
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
