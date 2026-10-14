import { useState } from 'react'
import { Applicant } from '../types/applicant'
import { KanbanApplication } from '../types/kanban'

export const useKanbanDialogs = () => {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false)
  const [isStandardResumeDialogOpen, setIsStandardResumeDialogOpen] = useState(false)

  const openProfileDialog = (applicant: Applicant, applicationId?: string) => {
    setSelectedApplicant(applicant)
    setSelectedApplicationId(applicationId || null)
    setIsProfileDialogOpen(true)
  }

  const closeProfileDialog = () => {
    setIsProfileDialogOpen(false)
  }

  const openResumeDialog = () => {
    setIsResumeDialogOpen(true)
  }

  const closeResumeDialog = () => {
    setIsResumeDialogOpen(false)
  }

  const openStandardResumeDialog = (applicant: Applicant) => {
    setSelectedApplicant(applicant)
    setIsStandardResumeDialogOpen(true)
  }

  const closeStandardResumeDialog = () => {
    setIsStandardResumeDialogOpen(false)
  }

  const handleCardClick = (application: KanbanApplication, applicants: Applicant[]) => {
    const applicant = applicants.find((a) => a.id === application.applicantId)
    if (applicant) {
      openProfileDialog(applicant, application.id)
    }
  }

  return {
    selectedApplicant,
    selectedApplicationId,
    isProfileDialogOpen,
    isResumeDialogOpen,
    isStandardResumeDialogOpen,
    openProfileDialog,
    closeProfileDialog,
    openResumeDialog,
    closeResumeDialog,
    openStandardResumeDialog,
    closeStandardResumeDialog,
    handleCardClick,
  }
}
