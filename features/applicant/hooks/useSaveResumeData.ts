import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ResumeBuilderFormSchemaType } from '../schemas/resumeBuilderSchema'

const saveResumeData = async (data: ResumeBuilderFormSchemaType) => {
  const response = await fetch('/api/applicant/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to save resume data')
  }

  return response.json()
}

export const useSaveResumeData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveResumeData,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resumeData'] })

      toast.success('Resume data saved successfully!', {
        icon: '✅',
        duration: 5000,
        style: {
          borderRadius: '8px',
          background: '#e8f5e9',
          color: '#2e7d32',
        },
        description: 'Your resume information has been updated.',
      })
    },
    onError: (error: Error) => {
      console.error('Error saving resume data:', error)

      toast.error('Failed to save resume data', {
        icon: '❌',
        duration: 5000,
        style: {
          borderRadius: '8px',
          background: '#ffebee',
          color: '#c62828',
        },
        description: error.message || 'Please try again later.',
      })
    },
  })
}
