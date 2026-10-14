import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveApplicantSkillsExpertise } from '../action/saveSkillsExpertise'
import { toast } from 'sonner'

export const useSaveSkillsExpertise = () => {
  const queryClient = useQueryClient()
  const { updateTaskStatus } = useApplicantStore()

  return useMutation({
    mutationFn: saveApplicantSkillsExpertise,
    onSuccess: () => {
      updateTaskStatus(2, true)
      queryClient.invalidateQueries({ queryKey: ['applicantSkillsExpertise'] })
      toast.success('Applicant Skills and Expertise', {
        description:
          'The applicant skills and expertise was saved successfully!',
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
