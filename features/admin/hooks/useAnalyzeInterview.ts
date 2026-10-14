import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface AnalyzeInterviewStatus {
  isAnalyzed: boolean
  averageScore: number | null
  analyzedCount: number
  totalCount: number
}

interface AnalyzeInterviewResponse {
  success: boolean
  message?: string
  averageScore: number | null
  analyzedCount: number
  totalCount: number
  isAnalyzed: boolean
}

async function checkAnalysisStatus(applicationId: string): Promise<AnalyzeInterviewStatus> {
  const response = await fetch(`/api/admin/analyze-interview/${applicationId}`)
  if (!response.ok) {
    throw new Error('Failed to check analysis status')
  }
  return response.json()
}

async function triggerAnalysis(applicationId: string): Promise<AnalyzeInterviewResponse> {
  const response = await fetch(`/api/admin/analyze-interview/${applicationId}`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error('Failed to trigger analysis')
  }
  return response.json()
}

export function useAnalyzeInterview(applicationId: string | null) {
  const queryClient = useQueryClient()

  const statusQuery = useQuery<AnalyzeInterviewStatus>({
    queryKey: ['interview-analysis-status', applicationId],
    queryFn: () => checkAnalysisStatus(applicationId!),
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000,
  })

  const analysisMutation = useMutation<AnalyzeInterviewResponse, Error, string>({
    mutationFn: triggerAnalysis,
    onSuccess: (data, applicationId) => {
      queryClient.setQueryData(['interview-analysis-status', applicationId], {
        isAnalyzed: data.isAnalyzed,
        averageScore: data.averageScore,
        analyzedCount: data.analyzedCount,
        totalCount: data.totalCount,
      })
      queryClient.invalidateQueries({ queryKey: ['applicants'] })
    },
  })

  const ensureAnalyzed = () => {
    if (applicationId && statusQuery.data && !statusQuery.data.isAnalyzed && !analysisMutation.isPending) {
      analysisMutation.mutate(applicationId)
    }
  }

  return {
    status: statusQuery.data,
    isLoading: statusQuery.isLoading,
    isAnalyzing: analysisMutation.isPending,
    error: statusQuery.error || analysisMutation.error,
    triggerAnalysis: () => applicationId && analysisMutation.mutate(applicationId),
    ensureAnalyzed,
  }
}

export function useAnalyzeMultipleInterviews(applicationIds: string[]) {
  const queryClient = useQueryClient()

  const analysisMutation = useMutation<
    Record<string, AnalyzeInterviewResponse>,
    Error,
    string[]
  >({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(
        ids.map(id => triggerAnalysis(id))
      )

      const response: Record<string, AnalyzeInterviewResponse> = {}
      ids.forEach((id, index) => {
        if (results[index].status === 'fulfilled') {
          response[id] = results[index].value
        } else {
          response[id] = {
            success: false,
            averageScore: null,
            analyzedCount: 0,
            totalCount: 0,
            isAnalyzed: false,
          }
        }
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] })
    },
  })

  return {
    analyzeMultiple: (ids: string[]) => analysisMutation.mutate(ids),
    isAnalyzing: analysisMutation.isPending,
    error: analysisMutation.error,
  }
}
