import { useQuery } from '@tanstack/react-query'
import {
  BasicInformationFormSchemaType,
  BasicInformationWithMetadata,
} from '@/features/applicant/schemas/basicInformationSchema'

const fetchAdminApplicantData = async (
  applicantId: string
): Promise<BasicInformationWithMetadata> => {
  try {
    const response = await fetch(`/api/admin/applicants/basic-information/${encodeURIComponent(applicantId)}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Failed to fetch applicant data: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data as BasicInformationWithMetadata
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch applicant data')
  }
}

export const useGetAdminApplicantInformation = (applicantId: string | null) => {
  return useQuery<BasicInformationFormSchemaType>({
    queryKey: ['adminApplicantInformation', applicantId],
    queryFn: () => fetchAdminApplicantData(applicantId!),
    enabled: !!applicantId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
