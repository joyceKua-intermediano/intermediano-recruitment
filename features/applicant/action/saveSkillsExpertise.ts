import { SkillsExpertiseWithId } from '../schemas/skillsExpertiseSchema'

export const saveApplicantSkillsExpertise = async (
  data: SkillsExpertiseWithId
): Promise<SkillsExpertiseWithId> => {
  try {
    const response = await fetch('/api/applicant/skills-expertise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        errorData?.message ||
          `Failed to save applicant data: ${response.statusText}`
      )
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
  }
}
