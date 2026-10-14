import { BasicInformationWithMetadata } from '@/features/applicant/schemas/basicInformationSchema'
import { SkillsExpertiseSchemaType } from '@/features/applicant/schemas/skillsExpertiseSchema'
import { UploadResumeDetails } from '@/features/applicant/schemas/uploadResume'
import { create } from 'zustand'

interface Task {
  id: number
  title: string
  completed: boolean
  highlight: boolean
}

export interface AppliedJobsData {
  totalApplied: number
  applications: Array<{
    id: string
    status: string
    createdAt: string
    job: {
      id: string
      jobId: string
      title: string
      location: string
      type: string
      salary: string
    }
  }>
}

interface ApplicantStore {
  applicantBasicInformation?: BasicInformationWithMetadata
  setApplicantBasicInformation: (data: BasicInformationWithMetadata) => void
  tasks: Task[]
  updateTaskStatus: (taskId: number, completed: boolean) => void
  applicantSkillsExpertise?: SkillsExpertiseSchemaType
  setApplicantSkillsExpertise: (data: SkillsExpertiseSchemaType) => void
  applicantResumeDetails?: UploadResumeDetails
  setApplicantResumeDetails: (data: UploadResumeDetails) => void
  appliedJobsData?: AppliedJobsData
  setAppliedJobsData: (data: AppliedJobsData) => void
}

export const useApplicantStore = create<ApplicantStore>((set) => ({
  applicantBasicInformation: undefined,
  setApplicantBasicInformation: (data) =>
    set({ applicantBasicInformation: data }),
  tasks: [
    {
      id: 1,
      title: 'Step 1: Complete Your Basic Information',
      completed: false,
      highlight: false,
    },
    {
      id: 2,
      title: 'Step 2: Showcase Your Skills & Expertise',
      completed: false,
      highlight: false,
    },

    {
      id: 3,
      title: 'Step 3: Upload Your PDF Resume',
      completed: false,
      highlight: false,
    },
  ],
  updateTaskStatus: (taskId, completed) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task
      ),
    })),
  applicantSkillsExpertise: undefined,
  setApplicantSkillsExpertise: (data) =>
    set({ applicantSkillsExpertise: data }),
  applicantResumeDetails: undefined,
  setApplicantResumeDetails: (data) => set({ applicantResumeDetails: data }),
  appliedJobsData: undefined,
  setAppliedJobsData: (data) => set({ appliedJobsData: data }),
}))
