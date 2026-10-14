import { useApplicantStore } from '@/lib/stores/applicantStore'
import {
  SkillsExpertiseSchemaType,
  SkillsExpertiseWithId,
} from '../schemas/skillsExpertiseSchema'
import { useQuery } from '@tanstack/react-query'

const fetchApplicantSkillsExpertise = async (
  applicantId: string | undefined
): Promise<SkillsExpertiseWithId> => {
  try {
    const response = await fetch(
      `/api/applicant/skills-expertise?applicantId=${encodeURIComponent(
        applicantId ?? ''
      )}`
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Failed to fetch applicant data: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data as SkillsExpertiseWithId
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch applicant data')
  }
}

export const useGetSkillsExpertise = () => {
  const {
    applicantBasicInformation,
    setApplicantSkillsExpertise,
    updateTaskStatus,
  } = useApplicantStore()
  const applicantId = applicantBasicInformation?.id

  return useQuery<SkillsExpertiseSchemaType>({
    queryKey: ['applicantSkillsExpertise', applicantId],
    queryFn: async () => {
      if (!applicantId) {
        throw new Error('Applicant ID is required')
      }
      const data = await fetchApplicantSkillsExpertise(applicantId)
      if (data.skills) {
        updateTaskStatus(2, true)
      }
      setApplicantSkillsExpertise({ skills: data.skills, updatedAt: data?.updatedAt })
      return data
    },
    enabled: !!applicantId,
  })
}
