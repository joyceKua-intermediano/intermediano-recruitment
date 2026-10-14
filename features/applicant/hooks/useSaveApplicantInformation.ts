import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveApplicantBasicInfo } from '../action/saveBasicInfo'
import { toast } from 'sonner'
import { useApplicantStore } from '@/lib/stores/applicantStore'

export const useSaveApplicantBasicInfo = () => {
  const queryClient = useQueryClient()
  const {updateTaskStatus} = useApplicantStore()
  return useMutation({
    mutationFn: saveApplicantBasicInfo,
    onSuccess: () => {
      updateTaskStatus(1, true)
      queryClient.invalidateQueries({ queryKey: ['applicantInformation'] })
      toast.success('Applicant Data Saved', {
        description: 'The applicant data was saved successfully!',
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
