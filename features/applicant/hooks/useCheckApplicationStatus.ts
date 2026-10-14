import { useQuery } from '@tanstack/react-query'
import { useApplicantStore } from '@/lib/stores/applicantStore'

interface ApplicationStatus {
  hasApplied: boolean
  application?: any
}

const checkApplicationStatus = async (jobId: string, applicantId?: string): Promise<ApplicationStatus> => {
  if (!applicantId) {
    return { hasApplied: false }
  }

  try {
    const response = await fetch(`/api/applications/check?jobId=${encodeURIComponent(jobId)}&applicantId=${encodeURIComponent(applicantId)}`)
    
    if (!response.ok) {
      return { hasApplied: false }
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error checking application status:', error)
    return { hasApplied: false }
  }
}

export const useCheckApplicationStatus = (jobId: string) => {
  const { applicantBasicInformation } = useApplicantStore()
  const applicantId = applicantBasicInformation?.id

  return useQuery<ApplicationStatus>({
    queryKey: ['applicationStatus', jobId, applicantId],
    queryFn: () => checkApplicationStatus(jobId, applicantId),
    enabled: !!jobId && !!applicantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 