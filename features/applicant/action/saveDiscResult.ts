import { TestResults } from '@/features/disc/types'

export interface DiscResultData {
  naturalProfile: TestResults
  adaptedProfile: TestResults
}

export const saveDiscResult = async (
  data: DiscResultData
): Promise<DiscResultData> => {
  try {
    const response = await fetch('/api/applicant/disc-result', {
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
          `Failed to save DISC result: ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
  }
}

