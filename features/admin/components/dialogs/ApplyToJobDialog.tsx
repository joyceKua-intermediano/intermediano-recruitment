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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Job } from '../../types/applicant'
import { useAdminCreateApplication } from '../../hooks/useApplicants'

interface ApplyApplicant {
  id: string
  name: string
  applications: Array<{ jobId: string }>
}

interface ApplyToJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicant: ApplyApplicant | null
  availableJobs: Job[]
}

export function ApplyToJobDialog({
  open,
  onOpenChange,
  applicant,
  availableJobs,
}: ApplyToJobDialogProps) {
  const applyMutation = useAdminCreateApplication()
  const [selectedJobId, setSelectedJobId] = useState('')

  const eligibleJobs = useMemo(() => {
    if (!applicant) return []
    const appliedJobIds = new Set(applicant.applications.map((app) => app.jobId))
    return availableJobs.filter(
      (job) => job.isActive && !appliedJobIds.has(job.id)
    )
  }, [applicant, availableJobs])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSelectedJobId('')
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async () => {
    if (!applicant || !selectedJobId) return

    try {
      await applyMutation.mutateAsync({
        applicantId: applicant.id,
        jobId: selectedJobId,
      })
      handleOpenChange(false)
    } catch {
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Apply to Job</DialogTitle>
          <DialogDescription>
            {applicant
              ? `Select an available job to apply ${applicant.name} to.`
              : 'Apply to Job'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2'>
          <Label>Available job</Label>
          {eligibleJobs.length === 0 ? (
            <p className='text-sm text-gray-500'>
              No available jobs left for this applicant.
            </p>
          ) : (
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger>
                <SelectValue placeholder='Select a job' />
              </SelectTrigger>
              <SelectContent>
                {eligibleJobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => handleOpenChange(false)}
            disabled={applyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              applyMutation.isPending ||
              !selectedJobId ||
              eligibleJobs.length === 0
            }
          >
            {applyMutation.isPending ? 'Applying...' : 'Apply to Job'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
