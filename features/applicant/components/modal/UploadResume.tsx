import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import UploadResumeFile from '../form/UploadResumeFile'
import { Button } from '@/components/ui/button'

interface UploadResumeModalProps {
  title: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  onNext?: () => void
  jobId?: string
}

const UploadResumeModal: React.FC<UploadResumeModalProps> = ({ 
  title, 
  onSuccess,
  onNext,
  jobId
}) => {
  const handleSuccess = () => {
    if (onSuccess && !jobId) {
      onSuccess()
    }
  }
  const handleNext = () => {
    if (onNext) onNext()
  }
  return (
    <>
      <div className='mb-4'>
        <p className='text-gray-600 mb-4'>Ensure your profile stands out by uploading your most recent resume.</p>
      </div>
      <UploadResumeFile onSuccess={handleSuccess} onNext={handleNext} jobId={jobId} />
    </>
  )
}

export default UploadResumeModal
