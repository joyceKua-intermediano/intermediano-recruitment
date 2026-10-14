'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Plus,
  Briefcase,
} from 'lucide-react'
import {
  useGetApplicants,
  useUpdateApplicationStatus,
  CreatedApplicantCredentials,
} from '../hooks/useApplicants'
import {
  useGetRankedApplicants,
  useRefreshRanking,
} from '../hooks/useApplicantRanking'
import {
  useApplicantFilters,
  useApplicantFiltering,
  useApplicationFiltering,
} from '../hooks/useApplicantFilters'
import { ApplicantRankingCard } from './ApplicantRankingCard'
import { ApplicantStatsCards } from './ApplicantStatsCards'
import { ApplicantFilterControls } from './ApplicantFilterControls'
import { ViewModeToggle } from './ViewModeToggle'
import { RankingControls } from './RankingControls'
import { Pagination } from './Pagination'
import { LoadingSpinner, ErrorState, EmptyState } from './LoadingStates'
import { ApplicantProfileDialog } from './dialogs/ApplicantProfileDialog'
import { ResumeViewerDialog } from './dialogs/ResumeViewerDialog'
import { CreateApplicantDialog } from './dialogs/CreateApplicantDialog'
import { ApplicantCredentialsDialog } from './dialogs/ApplicantCredentialsDialog'
import { ApplyToJobDialog } from './dialogs/ApplyToJobDialog'
import { Applicant, Application } from '../types/applicant'
import { statusColors } from '../constants/applicant'
import {
  getApplicationProgress,
  getStatusCount,
  getTotalApplicationsCount,
  hasActiveFilters,
  getFilteredApplications as getFilteredApplicationsUtil,
} from '../utils/statistics'
import { handleDownloadResume } from '../utils/resume'
import StandardResumeViewerDialog from './dialogs/StandardResumeViewerDialog'

export function ApplicantManagement() {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  )
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false)
  const [isStandardResumeDialogOpen, setIsStandardResumeDialogOpen] =
    useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [applyApplicant, setApplyApplicant] = useState<{
    id: string
    name: string
    applications: Array<{ jobId: string }>
  } | null>(null)
  const [credentials, setCredentials] =
    useState<CreatedApplicantCredentials | null>(null)
  const [isClient, setIsClient] = useState(false)

  const filters = useApplicantFilters()
  const { data, isLoading, error } = useGetApplicants(
    filters.currentPage,
    50,
    filters.statusFilter,
    filters.jobFilter
  )
  const updateStatusMutation = useUpdateApplicationStatus()

  const {
    data: rankingData,
    isLoading: isRankingLoading,
    error: rankingError,
  } = useGetRankedApplicants(
    filters.currentPage,
    50,
    filters.jobFilter,
    filters.rankingSortBy,
    filters.rankingSortOrder,
    filters.statusFilter,
    filters.searchTerm
  )
  const refreshRankingMutation = useRefreshRanking()

  const filteredApplicants = useApplicantFiltering(
    data?.applicants || [],
    filters.searchTerm,
    filters.statusFilter,
    filters.jobFilter
  )

  const filteredRankedApplicants = useApplicantFiltering(
    rankingData?.applicants || [],
    filters.searchTerm,
    filters.statusFilter,
    filters.jobFilter
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getFilteredApplications = (applicant: Applicant) =>
    getFilteredApplicationsUtil(
      applicant,
      filters.statusFilter,
      filters.jobFilter
    )

  const getApplicationProgressForApplicant = (applicant: Applicant) => {
    const filteredApplications = getFilteredApplications(applicant)
    return getApplicationProgress(applicant, filteredApplications)
  }

  const getStatusCountForStatus = (
    status: Application['status'] | 'registered'
  ) => getStatusCount(status, filteredApplicants, getFilteredApplications)

  const getTotalApplicationsCountForFiltered = () =>
    getTotalApplicationsCount(filteredApplicants, getFilteredApplications)

  const hasActiveFiltersValue = hasActiveFilters(
    filters.statusFilter,
    filters.jobFilter,
    filters.searchTerm
  )

  const handleOpenApplyToJob = (applicant: {
    id: string
    name: string
    applications: Array<{ jobId: string }>
  }) => {
    setApplyApplicant(applicant)
    setIsApplyDialogOpen(true)
  }

  const handleApplicantCreated = (
    createdCredentials: CreatedApplicantCredentials
  ) => {
    filters.clearAllFilters()
    filters.setViewMode('list')
    filters.setCurrentPage(1)
    setCredentials(createdCredentials)
  }

  const handleStatusUpdate = async (
    applicationId: string,
    newStatus: Application['status']
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        applicationId,
        status: newStatus,
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const hasNoApplicants =
    filters.viewMode === 'list' &&
    !isLoading &&
    !error &&
    (!data?.applicants || data.applicants.length === 0)

  const hasNoFilteredApplicants =
    filters.viewMode === 'list' &&
    !isLoading &&
    !error &&
    !hasNoApplicants &&
    filteredApplicants.length === 0

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Applicant Management
            </h1>
            <p className='text-gray-600 mt-2'>
              Manage and track all applicant profiles and applications
            </p>
          </div>

          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Create Applicant
          </Button>
        </div>
      </div>

      <ApplicantStatsCards
        filteredApplicants={filteredApplicants}
        totalApplicants={data?.applicants.length || 0}
        totalApplications={
          data?.applicants.reduce(
            (sum, app) => sum + app.applications.length,
            0
          ) || 0
        }
        availableJobs={data?.availableJobs || []}
        getStatusCount={getStatusCountForStatus}
        getTotalApplicationsCount={getTotalApplicationsCountForFiltered}
        hasActiveFilters={hasActiveFiltersValue}
      />

      <ApplicantFilterControls
        searchTerm={filters.searchTerm}
        statusFilter={filters.statusFilter}
        jobFilter={filters.jobFilter}
        availableJobs={data?.availableJobs || []}
        onSearchChange={filters.setSearchTerm}
        onStatusChange={filters.setStatusFilter}
        onJobChange={filters.setJobFilter}
        onClearFilters={filters.clearAllFilters}
      />

      {filters.viewMode === 'ranking' && (
        <RankingControls
          sortBy={filters.rankingSortBy}
          sortOrder={filters.rankingSortOrder}
          onSortByChange={filters.setRankingSortBy}
          onSortOrderChange={filters.setRankingSortOrder}
          jobFilter={filters.jobFilter}
          rankingData={rankingData}
        />
      )}

      <div className='flex justify-end mb-4'>
        <ViewModeToggle
          viewMode={filters.viewMode}
          onViewModeChange={filters.setViewMode}
          onRefreshRanking={() => refreshRankingMutation.mutate()}
          isRefreshing={refreshRankingMutation.isPending}
        />
      </div>

      <div className='space-y-6'>
        {filters.viewMode === 'list' ? (
          isLoading ? (
            <LoadingSpinner size='md' />
          ) : error ? (
            <ErrorState
              message={`Error loading applicants: ${error.message}`}
              onRetry={() => window.location.reload()}
            />
          ) : hasNoApplicants ? (
            <div className='text-center space-y-4'>
              <EmptyState message='No applicants found.' />
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Create Applicant
              </Button>
            </div>
          ) : hasNoFilteredApplicants ? (
            <EmptyState
              message={`No applicants found matching the current filters.${
                filters.statusFilter !== 'all'
                  ? ` No applicants with "${filters.statusFilter}" status.`
                  : ''
              }${
                filters.jobFilter !== 'all'
                  ? ` No applicants for the selected job.`
                  : ''
              }`}
              onClearFilters={filters.clearAllFilters}
              showClearButton={true}
            />
          ) : (
          filteredApplicants.map((applicant) => {
            const filteredApplications = getFilteredApplications(applicant)
            return (
              <Card
                key={applicant.id}
                className='hover:shadow-lg transition-shadow'
              >
                <CardContent className='p-6'>
                  <div className='flex flex-col lg:flex-row gap-6'>
                    <div className='flex-1'>
                      <div className='flex items-start space-x-4'>
                        <Avatar className='h-16 w-16'>
                          <AvatarImage src={applicant.avatar} />
                          <AvatarFallback className='text-lg'>
                            {applicant.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex-1'>
                          <h3 className='text-xl font-semibold text-gray-900'>
                            {applicant.name}
                          </h3>
                          <div className='flex flex-wrap gap-4 mt-2 text-sm text-gray-600'>
                            <div className='flex items-center space-x-1'>
                              <Mail className='h-4 w-4' />
                              <span>{applicant.email}</span>
                            </div>
                            {applicant.mobile && (
                              <div className='flex items-center space-x-1'>
                                <Phone className='h-4 w-4' />
                                <span>{applicant.mobile}</span>
                              </div>
                            )}
                            {applicant.city && (
                              <div className='flex items-center space-x-1'>
                                <MapPin className='h-4 w-4' />
                                <span>
                                  {applicant.city}
                                  {applicant.country &&
                                    `, ${applicant.country}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {applicant.skills.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-3'>
                              {applicant.skills.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant='secondary'
                                  className='text-xs'
                                >
                                  {skill.name} ({skill.years}y)
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='lg:w-80'>
                      <div className='space-y-4'>
                        {applicant.applications.length === 0 ? (
                          <div className='text-center py-4'>
                            <p className='text-sm font-medium text-gray-600'>
                              Account Created
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              No applications yet
                            </p>
                            <div className='mt-3 flex flex-wrap items-center justify-center gap-2'>
                              <Button
                                size='sm'
                                onClick={() => handleOpenApplyToJob(applicant)}
                              >
                                <Briefcase className='h-3 w-3 mr-1' />
                                Apply to Job
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() => {
                                  setSelectedApplicant(applicant)
                                  setIsProfileDialogOpen(true)
                                }}
                              >
                                <Eye className='h-3 w-3 mr-1' />
                                View Profile
                              </Button>

                              {applicant.resumeFileName && (
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() =>
                                    handleDownloadResume(
                                      applicant.id,
                                      applicant.resumeFileName || 'resume'
                                    )
                                  }
                                >
                                  <Download className='h-3 w-3 mr-1' />
                                  Download Resume
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className='flex items-center justify-between gap-3 mb-2'>
                                <div className='flex justify-between text-sm flex-1'>
                                  <span className='text-gray-600'>
                                    Pipeline Progress
                                  </span>
                                  <span className='font-medium'>
                                    {Math.round(
                                      getApplicationProgressForApplicant(
                                        applicant
                                      )
                                    )}
                                    %
                                  </span>
                                </div>
                                <Button
                                  size='sm'
                                  variant='outline'
                                  onClick={() => handleOpenApplyToJob(applicant)}
                                >
                                  <Briefcase className='h-3 w-3 mr-1' />
                                  Apply to Job
                                </Button>
                              </div>
                              <Progress
                                value={getApplicationProgressForApplicant(
                                  applicant
                                )}
                                className='h-2'
                              />
                              <p className='text-xs text-gray-500 mt-1'>
                                {filteredApplications.length} application
                                {filteredApplications.length !== 1
                                  ? 's'
                                  : ''}{' '}
                                shown
                              </p>
                            </div>

                            <div className='space-y-3'>
                              {filteredApplications.length > 0 ? (
                                filteredApplications.map((application) => {
                                  return (
                                    <div
                                      key={application.id}
                                      className='border rounded-lg p-3'
                                    >
                                      <div className='flex items-center justify-between mb-2'>
                                        <div className='flex-1'>
                                          <h4 className='font-medium text-sm text-gray-900'>
                                            {application.jobTitle}
                                          </h4>
                                          <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                                            <span>
                                              {application.jobLocation}
                                            </span>
                                            <span>•</span>
                                            <span>{application.jobType}</span>
                                            {!application.jobIsActive && (
                                              <>
                                                <span>•</span>
                                                <Badge
                                                  variant='outline'
                                                  className='text-xs bg-gray-100 text-gray-600'
                                                >
                                                  Closed
                                                </Badge>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        <Badge
                                          className={
                                            statusColors[application.status]
                                          }
                                        >
                                          {application.status}
                                        </Badge>
                                      </div>

                                      <div className='flex items-center justify-between text-xs text-gray-500 mb-2'>
                                        <span>
                                          Applied:{' '}
                                          {new Date(
                                            application.appliedAt
                                          ).toLocaleDateString()}
                                        </span>
                                        <span>
                                          Updated:{' '}
                                          {new Date(
                                            application.lastUpdated
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>

                                      <div className='flex space-x-2'>
                                        <Button
                                          size='sm'
                                          variant='outline'
                                          onClick={() => {
                                            setSelectedApplicant(applicant)
                                            setIsProfileDialogOpen(true)
                                          }}
                                        >
                                          <Eye className='h-3 w-3 mr-1' />
                                          View Profile
                                        </Button>

                                        {applicant.resumeFileName && (
                                          <Button
                                            size='sm'
                                            variant='outline'
                                            onClick={() =>
                                              handleDownloadResume(
                                                applicant.id,
                                                applicant.resumeFileName ||
                                                  'resume'
                                              )
                                            }
                                          >
                                            <Download className='h-3 w-3 mr-1' />
                                            Download
                                          </Button>
                                        )}

                                        <Select
                                          value={application.status}
                                          onValueChange={(
                                            value: Application['status']
                                          ) =>
                                            handleStatusUpdate(
                                              application.id,
                                              value
                                            )
                                          }
                                          disabled={
                                            updateStatusMutation.isPending
                                          }
                                        >
                                          <SelectTrigger className='w-32 h-8 text-xs'>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value='applied'>
                                              Applied
                                            </SelectItem>

                                            <SelectItem value='psychological-test'>
                                              Psychological Test
                                            </SelectItem>
                                            <SelectItem value='ai-interview'>
                                              AI Interview
                                            </SelectItem>
                                            <SelectItem value='second-rating'>
                                              Second Rating
                                            </SelectItem>
                                            <SelectItem value='personal-interview'>
                                              Personal Interview
                                            </SelectItem>
                                            <SelectItem value='approved'>
                                              Approved
                                            </SelectItem>
                                            <SelectItem value='rejected'>
                                              Rejected
                                            </SelectItem>
                                            <SelectItem value='resigned'>
                                              Resigned
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )
                                })
                              ) : (
                                <div className='text-center py-4 text-gray-500'>
                                  <p className='text-sm'>
                                    No applications match current filters
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
          )
        ) : !isClient ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-gray-500'>Loading ranking system...</div>
          </div>
        ) : isRankingLoading ? (
          <LoadingSpinner size='md' />
        ) : rankingError ? (
          <ErrorState
            message={`Error loading ranking data: ${rankingError.message}`}
            onRetry={() => window.location.reload()}
          />
        ) : !filteredRankedApplicants ||
          filteredRankedApplicants.length === 0 ? (
          <EmptyState message='No applicants found for ranking.' />
        ) : (
          filteredRankedApplicants.map((applicant) => (
            <ApplicantRankingCard
              key={applicant.id}
              applicant={applicant}
              onViewProfile={(rankedApplicant) => {
                setSelectedApplicant(rankedApplicant as any)
                setIsProfileDialogOpen(true)
              }}
              onDownloadResume={handleDownloadResume}
              onViewStandardResume={(rankedApplicant) => {
                setSelectedApplicant(rankedApplicant as any)
                setIsStandardResumeDialogOpen(true)
              }}
              onApplyToJob={(rankedApplicant) => {
                handleOpenApplyToJob(rankedApplicant)
              }}
              showJobMatch={filters.jobFilter !== 'all'}
            />
          ))
        )}
      </div>

      {filters.viewMode === 'ranking' && filteredRankedApplicants && (
        <div className='text-center text-sm text-gray-600 mt-4'>
          Showing {filteredRankedApplicants.length} of{' '}
          {rankingData?.applicants.length || 0} ranked applicants
        </div>
      )}

      {((filters.viewMode === 'list' &&
        data?.pagination.totalPages &&
        data.pagination.totalPages > 1) ||
        (filters.viewMode === 'ranking' &&
          rankingData?.pagination.totalPages &&
          rankingData.pagination.totalPages > 1)) && (
        <Pagination
          currentPage={filters.currentPage}
          totalPages={
            filters.viewMode === 'list'
              ? data?.pagination.totalPages || 1
              : rankingData?.pagination.totalPages || 1
          }
          onPageChange={filters.setCurrentPage}
        />
      )}

      <ApplicantProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
        applicant={selectedApplicant}
        onDownloadResume={handleDownloadResume}
        onViewResume={() => setIsResumeDialogOpen(true)}
        onViewStandardResume={(applicant) => {
          setSelectedApplicant(applicant as any)
          setIsStandardResumeDialogOpen(true)
        }}
      />

      <ResumeViewerDialog
        isOpen={isResumeDialogOpen}
        onClose={() => setIsResumeDialogOpen(false)}
        applicant={selectedApplicant}
        onDownloadResume={handleDownloadResume}
      />
      <StandardResumeViewerDialog
        isOpen={isStandardResumeDialogOpen}
        onClose={() => setIsStandardResumeDialogOpen(false)}
        applicant={selectedApplicant}
        onDownloadResume={handleDownloadResume}
      />
      <CreateApplicantDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreated={handleApplicantCreated}
      />
      <ApplicantCredentialsDialog
        credentials={credentials}
        availableJobs={data?.availableJobs || []}
        onClose={() => setCredentials(null)}
      />
      <ApplyToJobDialog
        open={isApplyDialogOpen}
        onOpenChange={(open) => {
          setIsApplyDialogOpen(open)
          if (!open) {
            setApplyApplicant(null)
          }
        }}
        applicant={applyApplicant}
        availableJobs={data?.availableJobs || []}
      />
    </div>
  )
}
