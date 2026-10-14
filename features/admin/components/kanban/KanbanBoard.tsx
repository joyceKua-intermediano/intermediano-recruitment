'use client'

import { useState, useMemo, useRef  } from 'react'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { KANBAN_COLUMNS } from '../../types/kanban'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { LoadingSpinner } from '../LoadingStates'
import { ApplicantProfileDialog } from '../dialogs/ApplicantProfileDialog'
import { ResumeViewerDialog } from '../dialogs/ResumeViewerDialog'
import StandardResumeViewerDialog from '../dialogs/StandardResumeViewerDialog'
import { handleDownloadResume } from '../../utils/resume'
import { useKanbanData } from '../../hooks/useKanbanData'
import { useKanbanDragDrop } from '../../hooks/useKanbanDragDrop'
import { useKanbanDialogs } from '../../hooks/useKanbanDialogs'
import { useGetRankedApplicants } from '../../hooks/useApplicantRanking'
import { RankingControls } from '../RankingControls'
import { useAnalyzeMultipleInterviews } from '../../hooks/useAnalyzeInterview'
import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function KanbanBoard() {
  const [jobFilter, setJobFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('totalScore')
  const [sortOrder, setSortOrder] = useState<string>('desc')
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
    target.scrollLeft = source.scrollLeft;
  };

  const { kanbanApplications, applicationsByColumn, applicants, availableJobs, isLoading } =
    useKanbanData(jobFilter)

  const { data: rankingData, isLoading: isRankingLoading } = useGetRankedApplicants(
    1,
    1000,
    jobFilter,
    sortBy,
    sortOrder,
    'all',
    ''
  )

  const { analyzeMultiple, isAnalyzing: isAnalyzingInterviews } = useAnalyzeMultipleInterviews([])

  const applicationScoreMap = useMemo(() => {
    const map = new Map<string, number>()
    applicants.forEach((applicant) => {
      applicant.applications.forEach((application) => {
        if (application.interviewSession?.averageScore !== null && application.interviewSession?.averageScore !== undefined) {
          map.set(application.id, application.interviewSession.averageScore)
        }
      })
    })
    return map
  }, [applicants])

  useEffect(() => {
    if (sortBy === 'aiInterviewScore' || applicationsByColumn['second-rating']) {
      const secondRatingApps = applicationsByColumn['second-rating'] || []
      const unanalyzedAppIds = secondRatingApps
        .map(app => {
          const applicant = applicants.find(a => a.id === app.applicantId)
          const application = applicant?.applications.find(ap => ap.id === app.id)
          if (application?.interviewSession && !application.interviewSession.isAnalyzed && application.interviewSession.status === 'completed') {
            return app.id
          }
          return null
        })
        .filter((id): id is string => id !== null)

      if (unanalyzedAppIds.length > 0 && !isAnalyzingInterviews) {
        analyzeMultiple(unanalyzedAppIds)
      }
    }
  }, [applicationsByColumn, applicants, sortBy, analyzeMultiple, isAnalyzingInterviews])

  const applicantRankingMap = useMemo(() => {
    if (!rankingData?.applicants) return new Map<string, number>()

    const map = new Map<string, number>()
    rankingData.applicants.forEach((applicant) => {
      let score = 0
      switch (sortBy) {
        case 'totalScore':
          score = applicant.ranking?.totalScore || 0
          break
        case 'skillMatch':
          score = applicant.ranking?.skillMatch || 0
          break
        case 'experienceLevel':
          score = applicant.ranking?.experienceLevel || 0
          break
        case 'resumeCompleteness':
          score = applicant.ranking?.resumeCompleteness || 0
          break
        case 'applicationRecency':
          score = applicant.ranking?.applicationRecency || 0
          break
        case 'jobMatchScore':
          score = applicant.jobMatchScore || 0
          break
        default:
          score = applicant.ranking?.totalScore || 0
      }
      map.set(applicant.id, score)
    })
    return map
  }, [rankingData, sortBy])

  const sortedApplicationsByColumn = useMemo(() => {
    const sorted: Record<string, typeof kanbanApplications> = {}

    Object.keys(applicationsByColumn).forEach((column) => {
      const columnApps = applicationsByColumn[column as keyof typeof applicationsByColumn] || []

      sorted[column] = [...columnApps].sort((a, b) => {
        let scoreA = 0
        let scoreB = 0

        if (sortBy === 'aiInterviewScore') {
          scoreA = applicationScoreMap.get(a.id) ?? -1
          scoreB = applicationScoreMap.get(b.id) ?? -1
        } else {
          scoreA = applicantRankingMap.get(a.applicantId) || 0
          scoreB = applicantRankingMap.get(b.applicantId) || 0
        }

        if (sortOrder === 'desc') {
          return scoreB - scoreA
        } else {
          return scoreA - scoreB
        }
      })
    })

    return sorted as typeof applicationsByColumn
  }, [applicationsByColumn, applicantRankingMap, applicationScoreMap, sortBy, sortOrder])

  const { sensors, activeApplication, handleDragStart, handleDragEnd } = useKanbanDragDrop({
    kanbanApplications,
  })
  const {
    selectedApplicant,
    selectedApplicationId,
    isProfileDialogOpen,
    isResumeDialogOpen,
    isStandardResumeDialogOpen,
    closeProfileDialog,
    openResumeDialog,
    openStandardResumeDialog,
    closeResumeDialog,
    closeStandardResumeDialog,
    handleCardClick,
  } = useKanbanDialogs()

  if (isLoading || isRankingLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="md" />
      </div>
    )
  }
  return (
    <div className="h-full min-h-0 w-full flex flex-col">
      <div className="w-full space-y-4 mb-4">
        <div className="w-full flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Job</span>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="All jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {availableJobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.displayName || job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full flex items-center justify-between">
          <RankingControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
            jobFilter={jobFilter}
            rankingData={rankingData}
          />
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
    <div className="flex flex-col h-full">

      <div
        ref={topScrollRef}
        className="overflow-x-auto"
        onScroll={(e) =>
          syncScroll(e.currentTarget, bottomScrollRef.current!)
        }
      >
        <div className="w-[2000px] h-[1px]" />
      </div>

      <div
        ref={bottomScrollRef}
        className="flex h-full min-h-0 gap-4 overflow-x-auto pb-4 pr-2"
        onScroll={(e) =>
          syncScroll(e.currentTarget, topScrollRef.current!)
        }
      >
        {KANBAN_COLUMNS.map((stage) => (
          <KanbanColumn
            key={stage}
            columnId={stage}
            applications={sortedApplicationsByColumn[stage] || []}
            onCardClick={(application) =>
              handleCardClick(application, applicants)
            }
          />
        ))}
      </div>
    </div>

        <DragOverlay>
          {activeApplication ? (
            <KanbanCard
              application={activeApplication}
              isDragging={true}
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedApplicant && (
        <>
          <ApplicantProfileDialog
            isOpen={isProfileDialogOpen}
            onClose={closeProfileDialog}
            applicant={selectedApplicant}
            selectedApplicationId={selectedApplicationId}
            onDownloadResume={handleDownloadResume}
            onViewResume={openResumeDialog}
            onViewStandardResume={openStandardResumeDialog}
          />
          <ResumeViewerDialog
            isOpen={isResumeDialogOpen}
            onClose={closeResumeDialog}
            applicant={selectedApplicant}
            onDownloadResume={handleDownloadResume}
          />
          <StandardResumeViewerDialog
            isOpen={isStandardResumeDialogOpen}
            onClose={closeStandardResumeDialog}
            applicant={selectedApplicant}
            onDownloadResume={handleDownloadResume}
          />
        </>
      )}
    </div>
  )
}
