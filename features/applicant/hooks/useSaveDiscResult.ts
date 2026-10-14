import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { saveDiscResult } from '../action/saveDiscResult'
import { toast } from 'sonner'

export const useSaveDiscResult = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveDiscResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discResult'] })
      toast.success('DISC Test Completed', {
        description: 'Your DISC profile has been saved successfully!',
        icon: '🎉',
        duration: 5000,
      })
    },
    onError: (error: Error) => {
      console.error('Error saving DISC result:', error.message)
      toast.error('Error Saving DISC Result', {
        description: `An error occurred: ${error.message}`,
        icon: '⚠️',
      })
    },
  })
}
