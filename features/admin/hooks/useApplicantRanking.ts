import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RankedApplicant, RankingCriteria } from '../types/applicant'

interface RankingResponse {
  applicants: RankedApplicant[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
  }
  job?: {
    id: string
    title: string
    essentialSkills: string[]
    category: string
    location: string
    type: string
  }
  rankingCriteria: {
    skillMatch: string
    experienceLevel: string
    resumeCompleteness: string
    applicationRecency: string
  }
}

const fetchRankedApplicants = async (
  page: number = 1,
  limit: number = 50,
  jobId?: string,
  sortBy: string = 'totalScore',
  sortOrder: string = 'desc',
  statusFilter?: string,
  searchTerm?: string
): Promise<RankingResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  })

  if (jobId && jobId !== 'all') {
    params.append('jobId', jobId)
  }

  if (statusFilter && statusFilter !== 'all') {
    params.append('status', statusFilter)
  }

  if (searchTerm && searchTerm.trim() !== '') {
    params.append('search', searchTerm.trim())
  }

  const endpoint = '/api/admin/applicants/ranking'

  const response = await fetch(`${endpoint}?${params}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.error || `Failed to fetch ranked applicants: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()
  return data
}

export const useGetRankedApplicants = (
  page: number = 1,
  limit: number = 50,
  jobId?: string,
  sortBy: string = 'totalScore',
  sortOrder: string = 'desc',
  statusFilter?: string,
  searchTerm?: string
) => {
  return useQuery({
    queryKey: ['rankedApplicants', page, limit, jobId, sortBy, sortOrder, statusFilter, searchTerm],
    queryFn: () => fetchRankedApplicants(page, limit, jobId, sortBy, sortOrder, statusFilter, searchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useRefreshRanking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['rankedApplicants'] })
      return true
    },
    onError: (error) => {
      console.error('Failed to refresh ranking data:', error)
    }
  })
}

export const getRankingColor = (score: number): string => {
  if (score >= 80) return 'text-gray-800 bg-gray-100'
  if (score >= 60) return 'text-gray-700 bg-gray-50'
  if (score >= 40) return 'text-gray-600 bg-gray-50'
  return 'text-gray-500 bg-gray-50'
}

export const getRankingBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (score >= 80) return 'default'
  if (score >= 60) return 'secondary'
  if (score >= 40) return 'outline'
  return 'destructive'
}

export const formatRankingScore = (score: number): string => {
  return `${Math.round(score)}%`
}

export const getRankingDescription = (score: number): string => {
  if (score >= 80) return 'Excellent match'
  if (score >= 60) return 'Good match'
  if (score >= 40) return 'Fair match'
  return 'Poor match'
}
