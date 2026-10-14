import { Applicant, Application, ApplicationStatus } from '../types/applicant'

export const getApplicationProgress = (
  applicant: Applicant,
  filteredApplications: Application[]
): number => {
  const totalApplications = filteredApplications.length
  const completedApplications = filteredApplications.filter(app =>
    ['offered', 'rejected'].includes(app.status)
  ).length
  return totalApplications > 0 ? (completedApplications / totalApplications) * 100 : 0
}

export const getStatusCount = (
  status: ApplicationStatus | 'registered',
  filteredApplicants: Applicant[],
  getFilteredApplications: (applicant: Applicant) => Application[]
): number => {
  if (status === 'registered') {
    return filteredApplicants.length
  }

  return filteredApplicants.reduce((count, applicant) => {
    const filteredApplications = getFilteredApplications(applicant)
    return count + filteredApplications.filter(app => app.status === status).length
  }, 0)
}

export const getTotalApplicationsCount = (
  filteredApplicants: Applicant[],
  getFilteredApplications: (applicant: Applicant) => Application[]
): number => {
  return filteredApplicants.reduce((count, applicant) => {
    return count + getFilteredApplications(applicant).length
  }, 0)
}

export const hasActiveFilters = (
  statusFilter: string,
  jobFilter: string,
  searchTerm: string
): boolean => {
  return statusFilter !== 'all' || jobFilter !== 'all' || searchTerm !== ''
}

export const getFilteredApplications = (
  applicant: Applicant,
  statusFilter: string,
  jobFilter: string
): Application[] => {
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
}
