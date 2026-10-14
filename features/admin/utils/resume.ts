import { toast } from 'sonner'
import { SUPPORTED_FILE_TYPES } from '../constants/applicant'

export const handleDownloadResume = async (applicantId: string, fileName: string) => {
  try {
    toast.loading('Preparing download...')

    const link = document.createElement('a')
    link.href = `/api/admin/applicants/resume/${applicantId}`
    link.download = fileName || 'resume'

    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.dismiss()
    toast.success('Download started successfully')

  } catch (error) {
    console.error('Download failed:', error)
    toast.dismiss()
    toast.error('Download failed. Please try again.')

    try {
      window.open(`/api/admin/applicants/resume/${applicantId}`, '_blank')
      toast.info('Opened resume in new tab as fallback')
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      toast.error('Unable to download or open resume')
    }
  }
}

export const getFileType = (fileName: string): 'pdf' | 'image' | 'document' | 'other' => {
  const extension = fileName.toLowerCase().split('.').pop() || ''

  if (SUPPORTED_FILE_TYPES.PDF.some(ext => extension === ext.slice(1))) {
    return 'pdf'
  }

  if (SUPPORTED_FILE_TYPES.IMAGES.some(ext => extension === ext.slice(1))) {
    return 'image'
  }

  if (SUPPORTED_FILE_TYPES.DOCUMENTS.some(ext => extension === ext.slice(1))) {
    return 'document'
  }

  return 'other'
}

export const formatFileSize = (fileSize?: number): string => {
  if (!fileSize) return '0 KB'
  return `${(fileSize / 1024).toFixed(1)} KB`
}

export const getResumePreviewUrl = (applicantId: string): string => {
  return `/api/admin/applicants/resume/${applicantId}`
}
