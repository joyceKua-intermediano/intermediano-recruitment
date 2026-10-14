import { Card, CardContent } from '@/components/ui/card'
import { Applicant, ApplicationStatus } from '../types/applicant'

interface ApplicantStatsCardsProps {
  filteredApplicants: Applicant[]
  totalApplicants: number
  totalApplications: number
  availableJobs: any[]
  getStatusCount: (status: ApplicationStatus | 'registered') => number
  getTotalApplicationsCount: () => number
  hasActiveFilters: boolean
}

export function ApplicantStatsCards({
  filteredApplicants,
  totalApplicants,
  availableJobs,
  getStatusCount,
  hasActiveFilters
}: ApplicantStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {hasActiveFilters ? 'Filtered Applicants' : 'Total Applicants'}
              </p>
              <p className="text-2xl font-bold text-gray-900">{filteredApplicants.length}</p>
              {hasActiveFilters && filteredApplicants.length !== totalApplicants && (
                <p className="text-xs text-gray-500">
                  of {totalApplicants} total
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered</p>
              <p className="text-2xl font-bold text-gray-900">{getStatusCount('registered')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{getStatusCount('approved')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{getStatusCount('rejected')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{availableJobs?.length || 0}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  {availableJobs?.filter(j => j.isActive).length || 0} active
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  {availableJobs?.filter(j => !j.isActive).length || 0} closed
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
