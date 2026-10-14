'use client'
import React, { useState } from 'react'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Upload, Calendar, HardDrive } from 'lucide-react'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useUploadApplicantResume } from '../../hooks/useUploadApplicantResume'
import { useCreateApplication } from '../../hooks/useCreateApplication'
import { useGetApplicantResumeDetails } from '../../hooks/useGetApplicantResumeDetails'

interface UploadResumeFileProps {
  onSuccess: () => void
  onNext?: () => void
  jobId?: string
}

const UploadResumeFile: React.FC<UploadResumeFileProps> = ({
  onSuccess,
  onNext,
  jobId
}) => {
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
  const [uploadedFileName, setUploadedFileName] = useState<string>('')

  const { applicantBasicInformation, applicantResumeDetails } = useApplicantStore()
  const { data: resumeDetails, isLoading: isLoadingResume } = useGetApplicantResumeDetails()
  const { mutate: uploadResume, isPending: isUploading } = useUploadApplicantResume()
  const { mutate: createApplication, isPending: isApplying } = useCreateApplication()

  const handleFileUpload = (files: File[]) => {
    if (!applicantBasicInformation?.id) return
    const fileToUpload = files[0]

    files.filter((file) => {
      if (file.type !== 'application/pdf') {
        alert(`Invalid file type: ${file.name}. Only PDF files are allowed.`)
        return false
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`File size too large: ${file.name}. Max size is 2 MB.`)
        return false
      }
      return true
    })

    setUploadedFileName(fileToUpload.name)
    uploadResume(
      { file: fileToUpload, ownerId: applicantBasicInformation.id },
      {
        onSuccess: () => {
          // Don't close the modal, just update the UI
          // The modal should stay open for the user to click "Apply Now"
        },
      }
    )
  }

  const handleApplyNow = () => {
    if (!jobId) {
      console.error('Job ID is required for application')
      return
    }

    console.log('Applying for job with ID:', jobId)

    createApplication(
      { jobId },
      {
        onSuccess: (data) => {
          // Always call onNext to close the modal, whether it's a new application or duplicate
          if (onNext) onNext()
        },
        onError: (error) => {
          console.error('Application error:', error)
        }
      }
    )
  }

  const handleNext = () => {
    if (onNext) onNext()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const currentResumeName = applicantResumeDetails?.fileName || uploadedFileName
  const hasExistingResume = resumeDetails && Object.keys(resumeDetails).length > 0

  return (
    <div className='space-y-4'>

      {hasExistingResume && resumeDetails && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Current Resume</p>
                <p className="text-sm text-green-600 font-semibold">{resumeDetails.fileName}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{formatFileSize(resumeDetails.fileSize)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {formatDate(resumeDetails.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasExistingResume && !isLoadingResume && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">No Resume Uploaded</p>
                <p className="text-sm text-yellow-600">Please upload your resume to continue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoadingResume && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Loading resume details...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className='mx-auto border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-center'>
        <FileUpload onChange={handleFileUpload} />
      </div>

      <div className="space-y-3">
        {jobId ? (
          <Button
            type='button'
            onClick={handleApplyNow}
            disabled={isApplying || isUploading}
            className='w-full cursor-pointer bg-gradient-to-r from-[#7c2a1c] to-[#a0522d] hover:from-[#5d1f15] hover:to-[#8b4513] text-white font-medium'
            loading={isApplying}
            loadingText="Applying..."
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
          </Button>
        ) : (
          onNext && (
            <Button
              type='button'
              variant='outline'
              onClick={handleNext}
              className='w-full cursor-pointer'
            >
              Next
            </Button>
          )
        )}
      </div>
    </div>
  )
}

export default UploadResumeFile
