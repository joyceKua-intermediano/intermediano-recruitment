import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import { Applicant } from '../../types/applicant'
import { formatFileSize, getFileType, getResumePreviewUrl } from '../../utils/resume'

interface ResumeViewerDialogProps {
  isOpen: boolean
  onClose: () => void
  applicant: Applicant | null
  onDownloadResume: (applicantId: string, fileName: string) => void
}

export function ResumeViewerDialog({
  isOpen,
  onClose,
  applicant,
  onDownloadResume
}: ResumeViewerDialogProps) {
  if (!applicant || !applicant.resumeFileName) return null

  const fileType = getFileType(applicant.resumeFileName)
  const previewUrl = getResumePreviewUrl(applicant.id)

  const renderFilePreview = () => {
    switch (fileType) {
      case 'pdf':
        return (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-2 text-xs text-gray-600 text-center border-b">
              Loading resume...
            </div>

            <iframe
              src={previewUrl}
              className="w-full h-96"
              title={`Resume - ${applicant.name}`}
              onLoad={() => console.log('PDF iframe loaded successfully')}
              onError={(e) => {
                console.error('PDF iframe error:', e)
                const iframe = e.currentTarget
                iframe.style.display = 'none'
                const fallback = iframe.nextElementSibling
                if (fallback) fallback.classList.remove('hidden')
              }}
            />

            <object
              data={previewUrl}
              type="application/pdf"
              className="w-full h-96 hidden"
              onLoad={() => console.log('PDF object tag loaded successfully')}
              onError={(e) => {
                console.error('PDF object tag error:', e)
                const object = e.currentTarget
                object.style.display = 'none'
                const errorMsg = object.nextElementSibling
                if (errorMsg) errorMsg.classList.remove('hidden')
              }}
            >
              <p>PDF cannot be displayed. <a href={previewUrl} target="_blank" className="text-blue-600 underline">Open in new tab</a></p>
            </object>

            <div className="hidden p-4 bg-red-50 text-center">
              <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 mb-2">PDF could not be loaded</p>
              <p className="text-sm text-red-500 mb-4">
                This might be due to browser security restrictions or file format issues.
              </p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewUrl, '_blank')}
                >
                  Open in New Tab
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadResume(applicant.id, applicant.resumeFileName || 'resume')}
                >
                  Download File
                </Button>
              </div>
            </div>

            <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center">
              If the PDF doesn't load, try downloading the file instead.
              <br />
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt={`Resume - ${applicant.name}`}
              className="w-full h-auto max-h-96 object-contain"
              onError={(e) => {
                console.error('Image loading error:', e)
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="hidden p-4 bg-gray-50 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Image could not be loaded</p>
              <p className="text-sm text-gray-500">Please download the file to view it</p>
            </div>
          </div>
        )

      case 'document':
        return (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              {applicant.resumeFileName}
            </div>
            <div className="bg-white p-4 rounded border max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-800">
                This is a {applicant.resumeFileName?.split('.').pop()?.toUpperCase()} file.
                Click download to view the full content.
              </p>
            </div>
          </div>
        )

      default:
        return (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">File Format: {applicant.resumeFileName?.split('.').pop()?.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mb-4">
                This file format cannot be previewed directly. Please download the file to view its contents.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full !max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Resume Viewer</span>
          </DialogTitle>
          <DialogDescription>
            Viewing resume for {applicant.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-600">File Name:</label>
                  <p className="text-gray-900">{applicant.resumeFileName}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-600">File Size:</label>
                  <p className="text-gray-900">{formatFileSize(applicant.resumeFileSize)}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-600">Applicant:</label>
                  <p className="text-gray-900">{applicant.name}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-600">Email:</label>
                  <p className="text-gray-900">{applicant.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resume Content</CardTitle>
            </CardHeader>
            <CardContent>
              {renderFilePreview()}

              <div className="flex justify-center pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadResume(applicant.id, applicant.resumeFileName || 'resume')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={() => onDownloadResume(applicant.id, applicant.resumeFileName || 'resume')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
