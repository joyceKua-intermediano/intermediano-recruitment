import { useState } from 'react'
import {
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { toast } from 'sonner'
import { KanbanApplication, KanbanColumn, isKanbanColumn } from '../types/kanban'
import { Application } from '../types/applicant'
import { useUpdateApplicationStatus } from './useApplicants'

async function checkJobHasInterviewQuestions(jobId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/jobs/${jobId}/interview-questions`)
    if (!response.ok) {
      return false
    }
    const data = await response.json()
    return data?.interviewQuestions && data.interviewQuestions.length > 0
  } catch (error) {
    console.error('Error checking interview questions:', error)
    return false
  }
}

interface UseKanbanDragDropProps {
  kanbanApplications: KanbanApplication[]
}

export const useKanbanDragDrop = ({ kanbanApplications }: UseKanbanDragDropProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const updateStatusMutation = useUpdateApplicationStatus()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      setActiveId(null)
      return
    }

    const applicationId = active.id as string

    const application = kanbanApplications.find((app) => app.id === applicationId)
    if (!application) {
      setActiveId(null)
      return
    }

    const targetColumn = determineTargetColumn(over.id, kanbanApplications)

    if (!targetColumn || application.stage === targetColumn) {
      setActiveId(null)
      return
    }

    if (targetColumn === 'ai-interview') {
      const hasQuestions = await checkJobHasInterviewQuestions(application.jobId)
      if (!hasQuestions) {
        toast.error(
          'Cannot move to AI interview: Interview questions must be set for this job first. Please add questions in Job Management.',
          { duration: 5000 }
        )
        setActiveId(null)
        return
      }
    }

    const newStatus = targetColumn as Application['status']

    try {
      await updateStatusMutation.mutateAsync({
        applicationId,
        status: newStatus,
      })
    } catch (error) {
      console.error('Failed to update application:', error)
      toast.error('Failed to update application status')
    }

    setActiveId(null)
  }

  const activeApplication = activeId
    ? kanbanApplications.find((app) => app.id === activeId)
    : null

  return {
    sensors,
    activeId,
    activeApplication,
    handleDragStart,
    handleDragEnd,
  }
}

const determineTargetColumn = (
  overId: string | number,
  applications: KanbanApplication[]
): KanbanColumn | null => {
  if (isKanbanColumn(String(overId))) {
    return overId as KanbanColumn
  }

  const targetApplication = applications.find((app) => app.id === overId)
  return targetApplication ? targetApplication.stage : null
}
