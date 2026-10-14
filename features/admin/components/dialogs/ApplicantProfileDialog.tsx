import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Star, FileText, Briefcase, Download, Eye, Video } from 'lucide-react'
import { Applicant, Application } from '../../types/applicant'
import { statusColors, statusIcons } from '../../constants/applicant'
import { formatFileSize } from '../../utils/resume'
import { InterviewResponseCard } from '../interview/InterviewResponseCard'

interface ApplicantProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  applicant: Applicant | null
  selectedApplicationId?: string | null
  onDownloadResume: (applicantId: string, fileName: string) => void
  onViewResume: () => void
  onViewStandardResume: (applicant: Applicant) => void
}

export function ApplicantProfileDialog({
  isOpen,
  onClose,
  applicant,
  selectedApplicationId,
  onDownloadResume,
  onViewResume,
  onViewStandardResume,
}: ApplicantProfileDialogProps) {
  if (!applicant) return null

  const displayApplications = selectedApplicationId
    ? applicant.applications.filter(app => app.id === selectedApplicationId)
    : applicant.applications

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-full !max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Applicant Profile</DialogTitle>
          <DialogDescription>
            Detailed view of applicant information and application history
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <User className='h-5 w-5' />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Full Name
                  </label>
                  <p className='text-gray-900'>{applicant.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Email
                  </label>
                  <p className='text-gray-900'>{applicant.email}</p>
                </div>
                {applicant.mobile && (
                  <div>
                    <label className='text-sm font-medium text-gray-600'>
                      Mobile
                    </label>
                    <p className='text-gray-900'>{applicant.mobile}</p>
                  </div>
                )}
                {applicant.city && (
                  <div>
                    <label className='text-sm font-medium text-gray-600'>
                      Location
                    </label>
                    <p className='text-gray-900'>
                      {applicant.city}
                      {applicant.country && `, ${applicant.country}`}
                    </p>
                  </div>
                )}
                {applicant.birthDate && (
                  <div>
                    <label className='text-sm font-medium text-gray-600'>
                      Birth Date
                    </label>
                    <p className='text-gray-900'>
                      {new Date(applicant.birthDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className='text-sm font-medium text-gray-600'>
                    Member Since
                  </label>
                  <p className='text-gray-900'>
                    {new Date(applicant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {applicant.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Star className='h-5 w-5' />
                  <span>Skills & Expertise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {applicant.skills.map((skill, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 border rounded-lg'
                    >
                      <span className='font-medium'>{skill.name}</span>
                      <Badge variant='outline'>{skill.years} years</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <FileText className='h-5 w-5' />
                  <span>Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {applicant.resumeFileName && (
                    <div className='flex items-center justify-between p-3 border rounded-lg'>
                      <div>
                        <p className='font-medium'>
                          {applicant.resumeFileName}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {formatFileSize(applicant.resumeFileSize)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='flex space-x-2'>
                    {applicant.resumeFileName && (
                      <>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={onViewResume}
                        >
                          <Eye className='h-4 w-4 mr-2' />
                          View Resume
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            onDownloadResume(
                              applicant.id,
                              applicant.resumeFileName || 'resume'
                            )
                          }
                        >
                          <Download className='h-4 w-4 mr-2' />
                          Download
                        </Button>
                      </>
                    )}

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>onViewStandardResume(applicant)}
                    >
                      <Eye className='h-4 w-4 mr-2' />
                      View Standard Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Briefcase className='h-5 w-5' />
                <span>Application History (All Applications)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicant.applications.length > 0 ? (
                <div className='space-y-4'>
                  {applicant.applications.map((application) => {
                    const StatusIcon = statusIcons[application.status]
                    return (
                      <div
                        key={application.id}
                        className='border rounded-lg p-4'
                      >
                        <div className='flex items-center justify-between mb-3'>
                          <h4 className='text-lg font-semibold'>
                            {application.jobTitle}
                          </h4>
                          <Badge className={statusColors[application.status]}>
                            <StatusIcon className='h-4 w-4 mr-2' />
                            {application.status}
                          </Badge>
                        </div>

                        <div className='grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3'>
                          <div>
                            <span className='font-medium'>Applied:</span>{' '}
                            {new Date(
                              application.appliedAt
                            ).toLocaleDateString()}
                          </div>
                          <div>
                            <span className='font-medium'>Last Updated:</span>{' '}
                            {new Date(
                              application.lastUpdated
                            ).toLocaleDateString()}
                          </div>
                        </div>

                        {application.notes && (
                          <div className='bg-gray-50 p-3 rounded-lg'>
                            <p className='text-sm'>
                              <span className='font-medium'>Notes:</span>{' '}
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <p>No applications yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {displayApplications.some(app => app.interviewSession && app.interviewSession.responses.length > 0) && (
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center space-x-2'>
                    <Video className='h-5 w-5' />
                    <span>Inti Interview Responses</span>
                  </CardTitle>
                  {(() => {
                    const appWithScore = displayApplications.find(
                      app => app.interviewSession?.averageScore !== null &&
                             app.interviewSession?.averageScore !== undefined
                    )
                    if (!appWithScore?.interviewSession?.averageScore) return null
                    return (
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-gray-700'>Overall Score:</span>
                        <span className={`text-lg font-bold ${
                          appWithScore.interviewSession.averageScore >= 80 ? 'text-green-600' :
                          appWithScore.interviewSession.averageScore >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {Math.round(appWithScore.interviewSession.averageScore)}
                        </span>
                        <span className='text-sm text-gray-400'>/100</span>
                      </div>
                    )
                  })()}
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {displayApplications.map((application) => {
                    if (!application.interviewSession || application.interviewSession.responses.length === 0) {
                      return null
                    }

                    const responsesByQuestion = application.interviewSession.responses.reduce((acc, response) => {
                      if (!acc[response.questionIndex]) {
                        acc[response.questionIndex] = []
                      }
                      acc[response.questionIndex].push(response)
                      return acc
                    }, {} as Record<number, typeof application.interviewSession.responses>)

                    return (
                      <div key={application.id} className='space-y-4'>
                        <div className='flex items-center justify-between mb-4 pb-2 border-b'>
                          <h4 className='text-lg font-semibold'>
                            {application.jobTitle}
                          </h4>
                          <Badge variant='outline'>
                            {application.interviewSession.status}
                          </Badge>
                        </div>

                        <div className='space-y-3'>
                          {Object.entries(responsesByQuestion).map(([questionIndex, responses]) => {
                            const finalResponse = responses[responses.length - 1]
                            const questionNumber = parseInt(questionIndex) + 1

                            return (
                              <InterviewResponseCard
                                key={`${application.id}-q${questionIndex}`}
                                response={finalResponse}
                                questionNumber={questionNumber}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
