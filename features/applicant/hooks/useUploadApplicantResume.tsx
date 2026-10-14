import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveApplicantResume } from '../action/saveResume'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { toast } from 'sonner'

export const useUploadApplicantResume = () => {
  const { updateTaskStatus } = useApplicantStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveApplicantResume,
    onSuccess: () => {
      updateTaskStatus(3, true)
      queryClient.invalidateQueries({ queryKey: ['applicantResumeDetails'] })
      toast.success('Applicant Resume submitted', {
        description: 'The applicant resume was submit successfully!',
        icon: '🎉',
        duration: 5000,
      })
    },
    onError: (error: Error) => {
      console.error('Error saving data:', error.message)
      toast.error('Error Saving Data', {
        description: `An error occurred: ${error.message}`,
        icon: '⚠️',
      })
    },
  })
}
