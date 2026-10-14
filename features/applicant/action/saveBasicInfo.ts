
import { BasicInformationFormSchemaType } from '../schemas/basicInformationSchema'

export const saveApplicantBasicInfo = async (
  data: BasicInformationFormSchemaType
): Promise<BasicInformationFormSchemaType> => {
  try {
    const response = await fetch('/api/applicant/basic-information', {
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
