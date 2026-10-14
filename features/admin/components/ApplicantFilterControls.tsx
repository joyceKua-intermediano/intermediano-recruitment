import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { STATUS_OPTIONS } from '../constants/applicant'

interface ApplicantFilterControlsProps {
  searchTerm: string
  statusFilter: string
  jobFilter: string
  availableJobs: any[]
  onSearchChange: (term: string) => void
  onStatusChange: (status: string) => void
  onJobChange: (jobId: string) => void
  onClearFilters: () => void
}

export function ApplicantFilterControls({
  searchTerm,
  statusFilter,
  jobFilter,
  availableJobs,
  onSearchChange,
  onStatusChange,
  onJobChange,
  onClearFilters
}: ApplicantFilterControlsProps) {
  const hasActiveFilters = statusFilter !== 'all' || jobFilter !== 'all' || searchTerm !== ''

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search applicants by name, email, or city..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobFilter} onValueChange={onJobChange}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="font-medium">All Jobs</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {availableJobs?.length || 0} total
                  </span>
                </div>
              </SelectItem>

              {availableJobs?.filter(job => job.isActive).length && availableJobs.filter(job => job.isActive).length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border-b">
                    Active Jobs
                  </div>
                  {availableJobs
                    .filter(job => job.isActive)
                    .map((job) => (
                      <SelectItem key={job.id} value={job.id} className='cursor-pointer'>
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{job.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {job.applicationCount} apps
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                            <span>•</span>
                            <span>{job.category}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </>
              )}

              {availableJobs?.filter(job => !job.isActive).length && availableJobs.filter(job => !job.isActive).length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border-b">
                    Closed Jobs
                  </div>
                  {availableJobs
                    .filter(job => !job.isActive)
                    .map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <div className="flex flex-col w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-600">{job.title}</span>
                            <Badge variant="outline" className="text-xs bg-gray-100">
                              {job.applicationCount} apps
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                            <span>•</span>
                            <span>{job.category}</span>
                            <span>•</span>
                            <span>Closed {new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters ? (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600">Active filters:</span>

              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusFilter}
                  <button
                    onClick={() => onStatusChange('all')}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}

              {jobFilter !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Job: {availableJobs?.find(j => j.id === jobFilter)?.displayName || jobFilter}
                  <button
                    onClick={() => onJobChange('all')}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}

              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 text-center">
              No filters applied - showing all applicants and applications
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
