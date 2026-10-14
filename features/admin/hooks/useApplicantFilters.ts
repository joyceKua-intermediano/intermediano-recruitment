import { useState, useMemo } from 'react'
import { Applicant, Application, ApplicationStatus, RankedApplicant } from '../types/applicant'

export interface FilterState {
  searchTerm: string
  statusFilter: string
  jobFilter: string
  currentPage: number
  viewMode: 'list' | 'ranking'
  rankingSortBy: string
  rankingSortOrder: string
}

export interface FilterActions {
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: string) => void
  setJobFilter: (jobId: string) => void
  setCurrentPage: (page: number) => void
  setViewMode: (mode: 'list' | 'ranking') => void
  setRankingSortBy: (sortBy: string) => void
  setRankingSortOrder: (order: string) => void
  clearAllFilters: () => void
}

export const useApplicantFilters = (): FilterState & FilterActions => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [jobFilter, setJobFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'list' | 'ranking'>('list')
  const [rankingSortBy, setRankingSortBy] = useState<string>('totalScore')
  const [rankingSortOrder, setRankingSortOrder] = useState<string>('desc')

  const clearAllFilters = () => {
    setStatusFilter('all')
    setJobFilter('all')
    setSearchTerm('')
    setCurrentPage(1)
  }

  return {
    searchTerm,
    statusFilter,
    jobFilter,
    currentPage,
    viewMode,
    rankingSortBy,
    rankingSortOrder,
    setSearchTerm,
    setStatusFilter,
    setJobFilter,
    setCurrentPage,
    setViewMode,
    setRankingSortBy,
    setRankingSortOrder,
    clearAllFilters
  }
}

type FilterableApplicant = {
  id: string
  name: string
  email: string | null
  city: string
  applications: Array<{
    id: string
    jobId: string
    status: string
  }>
}

export const useApplicantFiltering = <T extends FilterableApplicant>(
  applicants: T[],
  searchTerm: string,
  statusFilter: string,
  jobFilter: string
): T[] => {
  return useMemo(() => {
    return applicants.filter(applicant => {
      if (statusFilter === 'registered') {
        const hasNoApplications = applicant.applications.length === 0
        const matchesSearch = searchTerm === '' ||
          applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (applicant.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.city.toLowerCase().includes(searchTerm.toLowerCase())

        return hasNoApplications && matchesSearch
      }

      let hasMatchingApplications = true

      if (statusFilter !== 'all') {
        hasMatchingApplications = applicant.applications.some(app => app.status === statusFilter)
      }

      if (jobFilter !== 'all') {
        hasMatchingApplications = hasMatchingApplications && applicant.applications.some(app => app.jobId === jobFilter)
      }

      if (statusFilter === 'all' && jobFilter === 'all') {
        hasMatchingApplications = true
      }

      const matchesSearch = searchTerm === '' ||
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (applicant.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.city.toLowerCase().includes(searchTerm.toLowerCase())

      return hasMatchingApplications && matchesSearch
    })
  }, [applicants, searchTerm, statusFilter, jobFilter])
}

export const useApplicationFiltering = (
  applicant: Applicant,
  statusFilter: string,
  jobFilter: string
) => {
  return useMemo(() => {
    if (statusFilter === 'registered') {
      return []
    }

    let filtered = applicant.applications

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobId === jobFilter)
    }

    return filtered
  }, [applicant.applications, statusFilter, jobFilter])
}
