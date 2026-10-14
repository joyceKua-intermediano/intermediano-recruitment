import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InterviewQuestionsProps } from '../../types/interview'
import {
  createJobInterviewQuestions,
  CreateJobInterviewQuestionsInput,
} from '@/features/admin/schemas/jobSchema'
import type { IntiLanguage } from '@/features/ai-interview/types/language'
import { parseIntiLanguage } from '@/features/ai-interview/types/language'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateJobInterviewQuestions,
  useGetJobInterviewQuestions,
} from '@/features/admin/hooks/useJobManagement'

const InterviewQuestionsDialog = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
}: InterviewQuestionsProps) => {
  const { isLoading, data: jobInterviewQuestions } =
    useGetJobInterviewQuestions(jobId)

  const [formData, setFormData] = useState<CreateJobInterviewQuestionsInput>({
    jobId: jobId,
    interviewQuestions: [''],
    intiLanguage: 'en',
  })

  const createJobInteviewQuestionsMutation = useCreateJobInterviewQuestions()

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      jobId: jobId || '',
      interviewQuestions: jobInterviewQuestions?.interviewQuestions || [''],
      intiLanguage: parseIntiLanguage(jobInterviewQuestions?.intiLanguage),
    }))
  }, [jobId, jobInterviewQuestions?.interviewQuestions, jobInterviewQuestions?.intiLanguage, open])

  const addArrayItem = (field: keyof CreateJobInterviewQuestionsInput) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...(prev[field] as string[]).filter((item) => item.trim() !== ''),
        '',
      ],
    }))
  }

  const removeArrayItem = (
    field: keyof CreateJobInterviewQuestionsInput,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }
  const handleArrayInputChange = (
    field: keyof CreateJobInterviewQuestionsInput,
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) =>
        i === index ? value : item
      ),
    }))
  }
  const cleanFormData = (
    data: CreateJobInterviewQuestionsInput
  ): CreateJobInterviewQuestionsInput => {
    return {
      ...data,
      interviewQuestions: data.interviewQuestions.filter(
        (question) => question.trim() !== ''
      ),
    }
  }

  const resetForm = () => {
    setFormData({
      jobId: '',
      interviewQuestions: [''],
      intiLanguage: 'en',
    })
  }
  const handleCreateQuestions = async () => {
    const result = createJobInterviewQuestions.safeParse(formData)
    if (!result.success) {
      toast.error(result.error.errors[0].message)
      return
    }

    try {
      const cleanedData = cleanFormData(formData)

      await createJobInteviewQuestionsMutation.mutateAsync(cleanedData)
      toast.success('Job interview questions created successfully!')
    } catch (error) {
      console.error(' fetch Job interview questions  error:', error)
      if (error instanceof Error) {
        toast.error(`Failed to fetch job interview questions: ${error.message}`)
      } else {
        toast.error('Failed to fetch job interview questions')
      }
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{jobTitle}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <Label>Inti Language</Label>
            <Select
              value={formData.intiLanguage}
              onValueChange={(value: IntiLanguage) =>
                setFormData((prev) => ({ ...prev, intiLanguage: value }))
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select language' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='en'>English</SelectItem>
                <SelectItem value='es'>Español</SelectItem>
                <SelectItem value='pt'>Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Questions</Label>
            {(formData['interviewQuestions'] as string[]).map((item, index) => (
              <div key={index} className='flex gap-2'>
                <Input
                  value={item}
                  onChange={(e) =>
                    handleArrayInputChange(
                      'interviewQuestions',
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Enter Question...`}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeArrayItem('interviewQuestions', index)}
                  disabled={
                    (formData['interviewQuestions'] as string[]).length === 1
                  }
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() => addArrayItem('interviewQuestions')}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Question
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button type='submit' onClick={handleCreateQuestions}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InterviewQuestionsDialog
