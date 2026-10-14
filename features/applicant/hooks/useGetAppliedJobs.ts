import { useQuery } from '@tanstack/react-query'
import { useApplicantStore, type AppliedJobsData } from '@/lib/stores/applicantStore'

const getAppliedJobs = async (applicantId?: string): Promise<AppliedJobsData> => {
  if (!applicantId) {
    return { totalApplied: 0, applications: [] }
  }

  try {
    const response = await fetch(`/api/applications/applied?applicantId=${encodeURIComponent(applicantId)}`)
    
    if (!response.ok) {
      return { totalApplied: 0, applications: [] }
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    return { totalApplied: 0, applications: [] }
  }
}

export const useGetAppliedJobs = () => {
  const { applicantBasicInformation, appliedJobsData, setAppliedJobsData } = useApplicantStore()
  const applicantId = applicantBasicInformation?.id

  return useQuery<AppliedJobsData>({
    queryKey: ['appliedJobs', applicantId],
    queryFn: async () => {
      const data = await getAppliedJobs(applicantId)
      setAppliedJobsData(data)
      return data
    },
    enabled: !!applicantId,
    staleTime: 5 * 60 * 1000, 
    initialData: appliedJobsData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
} 