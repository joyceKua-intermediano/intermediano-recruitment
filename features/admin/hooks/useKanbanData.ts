import { useMemo } from 'react'
import { useGetApplicants } from './useApplicants'
import { KanbanApplication } from '../types/kanban'
import { transformToKanbanApplications, groupApplicationsByColumn } from '../utils/kanbanDataTransformer'

export const useKanbanData = (jobId: string = 'all') => {
  const { data, isLoading, error } = useGetApplicants(1, 1000, 'all', jobId)

  const kanbanApplications = useMemo<KanbanApplication[]>(() => {
    if (!data?.applicants) return []
    return transformToKanbanApplications(data.applicants)
  }, [data])

  const applicationsByColumn = useMemo(() => {
    return groupApplicationsByColumn(kanbanApplications)
  }, [kanbanApplications])

  return {
    kanbanApplications,
    applicationsByColumn,
    applicants: data?.applicants || [],
    availableJobs: data?.availableJobs || [],
    isLoading,
    error,
  }
}
