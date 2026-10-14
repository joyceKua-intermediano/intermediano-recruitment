import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface CreateApplicationData {
  jobId: string
}

interface ApplicationResult {
  success: boolean
  message: string
  isDuplicate?: boolean
  application?: any
}

const createApplication = async (data: CreateApplicationData): Promise<ApplicationResult> => {
  try {
    const response = await fetch('/api/applications', {
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
          `Failed to create application: ${response.statusText}`
      )
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
  }
}

export const useCreateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createApplication,
    onSuccess: (data: ApplicationResult) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['applicationStatus'] })
      
      if (data.isDuplicate) {
        toast.success('Application Already Submitted', {
          description: data.message,
          icon: '📧',
          duration: 5000,
        })
      } else {
        toast.success('Application Submitted!', {
          description: data.message,
          icon: '🎉',
          duration: 5000,
        })
      }
    },
    onError: (error: Error) => {
      console.error('Error creating application:', error.message)
      toast.error('Application Failed', {
        description: error.message,
        icon: '⚠️',
        duration: 5000,
      })
    },
  })
} 