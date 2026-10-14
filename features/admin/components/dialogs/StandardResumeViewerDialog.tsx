import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Applicant } from '../../types/applicant'
import ResumePreview from '@/features/applicant/components/form/ResumePreview'
import { useGetAdminApplicantInformation } from '../../hooks/useGetAdminApplicantInformation'
import { useGetAdminSkillsExpertise } from '../../hooks/useGetAdminSkillsExpertise'
import { ResumeBuilderFormSchemaType } from '@/features/applicant/schemas/resumeBuilderSchema'

const generatePdfFromData = async (data: any, filename: string) => {
  const { generatePdfFromData: pdfGenerator } = await import('@/lib/utils/pdfGenerator')
  return pdfGenerator(data, filename)
}

interface StandardResumeViewerDialogProps {
  isOpen: boolean
  onClose: () => void
  applicant: Applicant | null
  onDownloadResume: (applicantId: string, fileName: string) => void
}

const StandardResumeViewerDialog = ({
  isOpen,
  onClose,
  applicant,
  onDownloadResume
}: StandardResumeViewerDialogProps) => {
  const {
    data: basicInfo,
    isLoading: isLoadingBasicInfo,
    error: basicInfoError
  } = useGetAdminApplicantInformation(applicant?.id || null)

  const {
    data: skillsExpertise,
    isLoading: isLoadingSkills,
    error: skillsError
  } = useGetAdminSkillsExpertise(applicant?.id || null)

  const [isGenerating, setIsGenerating] = useState(false)

  const resumeData: ResumeBuilderFormSchemaType | null = useMemo(() => {
    if (!basicInfo || !skillsExpertise) return null

    let parsedSkills: any = {}
    if (skillsExpertise?.skills) {
      try {
        parsedSkills = JSON.parse(JSON.stringify(skillsExpertise.skills))
      } catch (error) {
        console.error(`Error parsing skills for ${basicInfo.name}:`, error)
        parsedSkills = {}
      }
    }

    return {
      fullName: basicInfo.name || '',
      dateOfBirth: basicInfo.birthDate || undefined,
      gender: parsedSkills?.gender || '',
      nationalities: parsedSkills?.nationalities || [],
      address: parsedSkills?.address || '',
      city: basicInfo.city || '',
      country: basicInfo.country || '',
      phoneNumber: basicInfo.mobile || '',
      whatsapp: parsedSkills?.whatsapp || '',
      email: applicant?.email || '',
      linkedin: parsedSkills?.linkedin || '',
      availabilityToRelocate: parsedSkills?.availabilityToRelocate || false,
      relocationCountries: parsedSkills?.relocationCountries || [],
      careerSummary: parsedSkills?.careerSummary || '',
      professionalExperience: parsedSkills?.professionalExperience || [],
      education: parsedSkills?.education || [],
      certifications: parsedSkills?.certifications || [],
      languageSkills: parsedSkills?.languageSkills || [],
      digitalSkills: {
        software: parsedSkills?.digitalSkills?.software || [],
        systems: parsedSkills?.digitalSkills?.systems || [],
        socialMedia: parsedSkills?.digitalSkills?.socialMedia || [],
        hardSkills: parsedSkills?.digitalSkills?.hardSkills || [],
        softSkills: parsedSkills?.digitalSkills?.softSkills || [],
      },
      availabilityToTravel: parsedSkills?.availabilityToTravel || false,
      travelFrequency: parsedSkills?.travelFrequency || '',
      salaryExpectation: parsedSkills?.salaryExpectation || '',
      areasOfInterest: parsedSkills?.areasOfInterest || [],
    }
  }, [applicant?.email, basicInfo, skillsExpertise])

  const isLoading = isLoadingBasicInfo || isLoadingSkills
  const error = basicInfoError || skillsError

  if (!applicant) return null

  const handleDownloadStandardResume = async () => {
    if (!resumeData) {
      toast.error('Resume data not available')
      return
    }
    if (isGenerating) return

    try {
      setIsGenerating(true)
      toast.loading('Generating PDF...')

      const filename = `${applicant.name.replace(/\s+/g, '_')}_Standard_Resume.pdf`
      await generatePdfFromData(resumeData, filename)

      toast.dismiss()
      toast.success('PDF downloaded successfully!')

    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.dismiss()
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full !max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Standard Resume Viewer</span>
          </DialogTitle>
          <DialogDescription>
            Viewing standard resume format for {applicant.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading resume data...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Failed to load resume data</p>
                <p className="text-sm text-red-500 mb-4">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {resumeData && !isLoading && !error && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Resume Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Applicant:</span>
                    <p className="text-gray-900">{applicant.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{applicant.email}</p>
                  </div>
                  {applicant.resumeFileName && (
                    <div>
                      <span className="font-medium text-gray-600">Original Resume:</span>
                      <p className="text-gray-900">{applicant.resumeFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          )}

          <div className="flex justify-end items-center pt-4 border-t">

            <div className="flex space-x-2">
              {resumeData && (
                <Button
                  onClick={handleDownloadStandardResume}
                  disabled={isGenerating}
                  className="bg-[#7c2a1c] hover:bg-[#6b2417] text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Download Standard Resume'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StandardResumeViewerDialog
