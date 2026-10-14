import { useQuery } from '@tanstack/react-query'
import { UploadResumeDetails } from '../schemas/uploadResume'
import { useApplicantStore } from '@/lib/stores/applicantStore'

const fetchApplicantResumeDetails = async (
  applicantId: string | undefined
): Promise<UploadResumeDetails> => {
  try {
    const response = await fetch(
      `/api/applicant/upload-resume?applicantId=${encodeURIComponent(
        applicantId ?? ''
      )}`
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Failed to fetch applicant data: ${response.status} ${response.statusText}`
      )
    }
    const data = await response.json()
    return data as UploadResumeDetails
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch applicant data')
  }
}

export const useGetApplicantResumeDetails = () => {
  const {
    updateTaskStatus,
    setApplicantResumeDetails,
    applicantBasicInformation,
  } = useApplicantStore()
  const applicantId = applicantBasicInformation?.id

  return useQuery({
    queryKey: ['applicantResumeDetails', applicantId],
    queryFn: async () => {
      if (!applicantId) {
        throw new Error('Applicant ID is required')
      }
      const data = await fetchApplicantResumeDetails(applicantId)
      if (Object.keys(data).length !== 0) {
        setApplicantResumeDetails(data)

        updateTaskStatus(3, true)
      }
      return data
    },
  })
}
