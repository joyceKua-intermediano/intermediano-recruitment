'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createApplicantFieldsSchema } from '../../schemas/createApplicantSchema'
import {
  CreatedApplicantCredentials,
  useCreateApplicant,
} from '../../hooks/useApplicants'

interface CreateApplicantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (credentials: CreatedApplicantCredentials) => void
}

export function CreateApplicantDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateApplicantDialogProps) {
  const createApplicantMutation = useCreateApplicant()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const resetForm = () => {
    setName('')
    setEmail('')
    setResume(null)
    setFieldError(null)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async () => {
    const parsed = createApplicantFieldsSchema.safeParse({ name, email })
    if (!parsed.success) {
      const field = parsed.error.issues[0]?.path[0]
      if (field === 'name') {
        setFieldError('Name is required')
      } else if (field === 'email') {
        setFieldError('A valid email is required')
      } else {
        setFieldError('Invalid input')
      }
      return
    }

    setFieldError(null)

    const formData = new FormData()
    formData.append('name', parsed.data.name)
    if (parsed.data.email) {
      formData.append('email', parsed.data.email)
    }
    if (resume) {
      formData.append('file', resume)
    }

    try {
      const result = await createApplicantMutation.mutateAsync(formData)
      resetForm()
      onOpenChange(false)
      onCreated({
        id: result.applicant.id,
        name: result.applicant.name,
        email: result.applicant.email,
        temporaryPassword: result.temporaryPassword,
      })
    } catch {
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Create Applicant</DialogTitle>
          <DialogDescription>
            Add an applicant with a name. Email and resume are optional. A temporary password is only generated when an email is provided.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='applicant-name'>Name</Label>
            <Input
              id='applicant-name'
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='Full name'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='applicant-email'>Email (optional)</Label>
            <Input
              id='applicant-email'
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='applicant@example.com'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='applicant-resume'>Resume (optional)</Label>
            <Input
              id='applicant-resume'
              type='file'
              accept='.pdf,.doc,.docx,.txt,application/pdf'
              onChange={(event) =>
                setResume(event.target.files?.[0] ?? null)
              }
            />
            <p className='text-xs text-gray-500'>
              Optional. PDF, DOC, DOCX, or TXT. Maximum 10MB.
            </p>
          </div>
          {fieldError && (
            <p className='text-sm text-red-500'>{fieldError}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => handleOpenChange(false)}
            disabled={createApplicantMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createApplicantMutation.isPending}
          >
            {createApplicantMutation.isPending ? 'Creating...' : 'Create Applicant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
