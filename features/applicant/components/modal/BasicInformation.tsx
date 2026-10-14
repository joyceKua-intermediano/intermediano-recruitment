import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import BasicInformationForm from '../form/BasicInformation'

interface BasicInformationModalProps {
  title: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmitSuccess?: () => void
  onNext?: () => void
}

const BasicInformationModal: React.FC<BasicInformationModalProps> = ({
  title,
  onSubmitSuccess,
  onNext,
}) => {
  const handleSubmitSuccess = () => {
    if (onSubmitSuccess) onSubmitSuccess()
  }
  const handleNext = () => {
    if (onNext) onNext()
  }
  return (
    <>
      <div className='mb-4'>
        <p className='text-gray-600'>Please provide the required details below to finalize your profile and connect with clients globally.</p>
      </div>
      <BasicInformationForm onSubmitSuccess={handleSubmitSuccess} onNext={handleNext}/>
    </>
  )
}
export default BasicInformationModal
