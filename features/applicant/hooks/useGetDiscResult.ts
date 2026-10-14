import { useQuery } from '@tanstack/react-query'
import { TestResults } from '@/features/disc/types'

export interface DiscResultResponse {
  id: string
  applicantId: string
  naturalProfile: TestResults
  adaptedProfile: TestResults
  createdAt: string
  updatedAt: string
}

const fetchDiscResult = async (): Promise<DiscResultResponse | null> => {
  try {
    const response = await fetch('/api/applicant/disc-result')

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Failed to fetch DISC result: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data as DiscResultResponse
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null
    }
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch DISC result')
  }
}

export const useGetDiscResult = () => {
  return useQuery<DiscResultResponse | null>({
    queryKey: ['discResult'],
    queryFn: fetchDiscResult,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

