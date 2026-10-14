'use client'

import { useMemo, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Check } from 'lucide-react'
import { CreatedApplicantCredentials, useAdminCreateApplication } from '../../hooks/useApplicants'
import { Job } from '../../types/applicant'

interface ApplicantCredentialsDialogProps {
  credentials: CreatedApplicantCredentials | null
  availableJobs: Job[]
  onClose: () => void
}

export function ApplicantCredentialsDialog({
  credentials,
  availableJobs,
  onClose,
}: ApplicantCredentialsDialogProps) {
  const applyMutation = useAdminCreateApplication()
  const [copied, setCopied] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState('')

  const activeJobs = useMemo(
    () => availableJobs.filter((job) => job.isActive),
    [availableJobs]
  )

  const handleCopy = async () => {
    if (!credentials?.temporaryPassword) return
    await navigator.clipboard.writeText(credentials.temporaryPassword)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setCopied(false)
    setSelectedJobId('')
    onClose()
  }

  const handleApply = async () => {
    if (!credentials || !selectedJobId) return

    try {
      await applyMutation.mutateAsync({
        applicantId: credentials.id,
        jobId: selectedJobId,
      })
      handleClose()
    } catch {
    }
  }

  return (
    <Dialog
      open={Boolean(credentials)}
      onOpenChange={(open) => {
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Applicant created</DialogTitle>
          <DialogDescription>
            {credentials?.temporaryPassword
              ? 'Copy this temporary password now. It will not be shown again.'
              : 'Applicant created without an account. You can assign them to a job below.'}
          </DialogDescription>
        </DialogHeader>

        {credentials && (
          <div className='space-y-4'>
            {credentials.email && (
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input value={credentials.email} readOnly />
              </div>
            )}
            {credentials.temporaryPassword ? (
              <>
                <div className='space-y-2'>
                  <Label>Temporary password</Label>
                  <div className='flex gap-2'>
                    <Input
                      value={credentials.temporaryPassword}
                      readOnly
                      className='font-mono'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCopy}
                      aria-label='Copy password'
                    >
                      {copied ? (
                        <Check className='h-4 w-4' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
                <p className='text-sm text-amber-700'>
                  This password is shown only once. Share it securely with the applicant.
                </p>
              </>
            ) : (
              <p className='text-sm text-gray-500'>
                No account was created. Add an email later to give this applicant login access.
              </p>
            )}

            <div className='space-y-2 border-t pt-4'>
              <Label>Available job</Label>
              {activeJobs.length === 0 ? (
                <p className='text-sm text-gray-500'>
                  No available jobs left for this applicant.
                </p>
              ) : (
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a job' />
                  </SelectTrigger>
                  <SelectContent>
                    {activeJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Close
          </Button>
          <Button
            onClick={handleApply}
            disabled={
              applyMutation.isPending ||
              !selectedJobId ||
              activeJobs.length === 0
            }
          >
            {applyMutation.isPending ? 'Applying...' : 'Apply to Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
