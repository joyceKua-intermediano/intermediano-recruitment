import { useQuery } from '@tanstack/react-query'
import {
  BasicInformationFormSchemaType,
  BasicInformationWithMetadata,
} from '../schemas/basicInformationSchema'
import { useApplicantStore } from '@/lib/stores/applicantStore'

const fetchApplicantData = async (): Promise<BasicInformationWithMetadata> => {
  try {
    const response = await fetch('/api/applicant/basic-information')

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

export const useGetApplicantInformation = () => {
  const { updateTaskStatus, setApplicantBasicInformation } = useApplicantStore()

  return useQuery<BasicInformationFormSchemaType>({
    queryKey: ['applicantInformation'],
    queryFn: async () => {
      const data = await fetchApplicantData()
      setApplicantBasicInformation(data)
      if (!Object.values(data).includes('')) {
        updateTaskStatus(1, true)
      }
      return data
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
