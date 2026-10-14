import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Target } from 'lucide-react'
import { RANKING_SORT_OPTIONS, SORT_ORDER_OPTIONS } from '../constants/applicant'

interface RankingControlsProps {
  sortBy: string
  sortOrder: string
  onSortByChange: (sortBy: string) => void
  onSortOrderChange: (sortOrder: string) => void
  jobFilter: string
  rankingData?: {
    job?: {
      id: string
      title: string
    }
    rankingCriteria?: {
      skillMatch: string
      experienceLevel: string
      resumeCompleteness: string
      applicationRecency: string
    }
  }
}

export function RankingControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  jobFilter,
  rankingData
}: RankingControlsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">Ranking Controls</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RANKING_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                      {option.label}
                    </SelectItem>
                  ))}
                  {jobFilter !== 'all' && (
                    <SelectItem value="jobMatchScore">Job Match Score</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Order:</label>
              <Select value={sortOrder} onValueChange={onSortOrderChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_ORDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {rankingData?.job && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">Ranking for:</span>
                <span className="text-sm text-gray-700">{rankingData.job.title}</span>
              </div>
            </div>
          )}
        </div>

        {rankingData?.rankingCriteria && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{rankingData.rankingCriteria.skillMatch}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{rankingData.rankingCriteria.experienceLevel}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{rankingData.rankingCriteria.resumeCompleteness}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{rankingData.rankingCriteria.applicationRecency}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
