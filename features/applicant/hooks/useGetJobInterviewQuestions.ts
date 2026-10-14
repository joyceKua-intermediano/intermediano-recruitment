import { useQuery } from '@tanstack/react-query'
import type { IntiLanguage } from '@/features/ai-interview/types/language'

interface JobInterviewQuestions {
  id: string | null
  jobId: string
  interviewQuestions: string[]
  intiLanguage?: IntiLanguage
}

const getJobInterviewQuestions = async (jobId: string): Promise<JobInterviewQuestions> => {
  if (!jobId) {
    return { id: null, jobId: '', interviewQuestions: [] }
  }

  try {
    const response = await fetch(`/api/applicant/job-interview-questions?jobId=${encodeURIComponent(jobId)}`)
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('You do not have access to interview questions for this job')
      }
      if (response.status === 404) {
        return { id: null, jobId, interviewQuestions: [] }
      }
      throw new Error('Failed to fetch interview questions')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching job interview questions:', error)
    throw error
  }
}

export const useGetJobInterviewQuestions = (jobId: string | undefined) => {
  return useQuery<JobInterviewQuestions>({
    queryKey: ['jobInterviewQuestions', jobId],
    queryFn: () => getJobInterviewQuestions(jobId!),
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000,
  })
}

