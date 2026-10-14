import { useQuery } from '@tanstack/react-query'
import { ResumeBuilderFormSchemaType } from '../schemas/resumeBuilderSchema'

const fetchResumeData = async (): Promise<ResumeBuilderFormSchemaType | null> => {
  try {
    const response = await fetch('/api/applicant/resume')
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.error ||
          `Failed to fetch resume data: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data.data as ResumeBuilderFormSchemaType
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch resume data')
  }
}

export const useGetResumeData = () => {
  return useQuery<ResumeBuilderFormSchemaType | null>({
    queryKey: ['resumeData'],
    queryFn: fetchResumeData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
