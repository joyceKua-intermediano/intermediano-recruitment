import { useQuery } from '@tanstack/react-query'
import { SkillsExpertiseSchemaType } from '@/features/applicant/schemas/skillsExpertiseSchema'

const fetchAdminSkillsExpertise = async (
  applicantId: string
): Promise<SkillsExpertiseSchemaType> => {
  try {
    const response = await fetch(`/api/admin/applicants/skills-expertise/${encodeURIComponent(applicantId)}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Failed to fetch skills expertise: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data as SkillsExpertiseSchemaType
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch skills expertise')
  }
}

export const useGetAdminSkillsExpertise = (applicantId: string | null) => {
  return useQuery<SkillsExpertiseSchemaType>({
    queryKey: ['adminSkillsExpertise', applicantId],
    queryFn: () => fetchAdminSkillsExpertise(applicantId!),
    enabled: !!applicantId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
