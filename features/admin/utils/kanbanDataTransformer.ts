import { Applicant } from '../types/applicant'
import { KanbanApplication, KanbanColumn, KANBAN_COLUMNS, isKanbanColumn } from '../types/kanban'

export const transformToKanbanApplications = (
  applicants: Applicant[]
): KanbanApplication[] => {
  const apps: KanbanApplication[] = []

  applicants.forEach((applicant) => {
    applicant.applications.forEach((application) => {
      if (!isKanbanColumn(application.status)) {
        return
      }

      const column = application.status as KanbanColumn

      apps.push({
        id: application.id,
        applicantId: applicant.id,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
        jobId: application.jobId,
        jobTitle: application.jobTitle,
        stage: column,
        appliedAt: application.appliedAt,
        lastUpdated: application.lastUpdated,
        avatar: applicant.avatar,
        discResult: applicant.discResult || null,
        interviewScore: application.interviewSession?.averageScore || null,
        interviewAnalysis: (() => {
          const responses = application.interviewSession?.responses || []
          if (responses.length === 0) return null

          const sortedResponses = [...responses]
            .filter(r => r.analysis)
            .sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime())

          return sortedResponses[0]?.analysis || null
        })(),
        isInterviewAnalyzed: application.interviewSession?.isAnalyzed || false,
      })
    })
  })

  return apps
}

export const groupApplicationsByColumn = (
  applications: KanbanApplication[]
): Record<KanbanColumn, KanbanApplication[]> => {
  const grouped = KANBAN_COLUMNS.reduce<Record<KanbanColumn, KanbanApplication[]>>((acc, column) => {
    acc[column] = []
    return acc
  }, {} as Record<KanbanColumn, KanbanApplication[]>)

  applications.forEach((app) => {
    if (grouped[app.stage]) {
      grouped[app.stage].push(app)
    }
  })

  return grouped
}
