'use client'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ApplicantTask from './ApplicantTask'
import {
  TrendingUp,
  UserCheck,
  FileText,
  CheckCircle2,
  ArrowRight,
  Brain,
  Video,
  AlertCircle,
} from 'lucide-react'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useMemo } from 'react'
import { useGetOpenJob } from '@/features/job/hooks/useGetJobs'
import { useGetAppliedJobs } from '@/features/applicant/hooks/useGetAppliedJobs'
import { useGetDiscResult } from '@/features/applicant/hooks/useGetDiscResult'
import ResumeBuilderLayout from '@/features/applicant/components/form/ResumeBuilderLayout'
import Link from 'next/link'
import { DiscCardContent } from '@/features/disc/components/DiscCardContent'
import { useTranslation } from 'react-i18next'

const ApplicantDashboard = () => {
  const { t, i18n } = useTranslation()
  const {
    tasks,
    applicantBasicInformation,
    applicantSkillsExpertise,
    applicantResumeDetails,
  } = useApplicantStore()
  const { data: jobDetails } = useGetOpenJob()
  const { data: appliedJobsData } = useGetAppliedJobs()
  const { data: discResult } = useGetDiscResult()

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(i18n.language, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const calculateDaysAgo = (dateString: string | undefined): string => {
    if (!dateString) return ''

    const eventDate = new Date(dateString)
    const currentDate = new Date()

    const diffInMs = currentDate.getTime() - eventDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return t('dashboard.today')
    return t('dashboard.daysAgo', { days: diffInDays })
  }

  const skillsDayUpdated = useMemo(
    () => calculateDaysAgo(applicantSkillsExpertise?.updatedAt),
    [applicantSkillsExpertise, i18n.language, t]
  )

  const infoUpdatedAt = useMemo(
    () => formatDate(applicantBasicInformation?.updatedAt),
    [applicantBasicInformation]
  )
  const resumeUpdatedAt = useMemo(
    () => formatDate(applicantResumeDetails?.updatedAt),
    [applicantResumeDetails]
  )
  const completedTasks = tasks.slice(0, 3).filter((t) => t.completed).length
  const progressPercentage = Math.round((completedTasks / 3) * 100)

  const interviewCount = useMemo(() => {
    return appliedJobsData?.applications?.filter(
      (app) => app.status === 'ai-interview'
    ).length || 0
  }, [appliedJobsData])

  const hasAppliedJobs = useMemo(() => {
    return (appliedJobsData?.totalApplied || 0) > 0
  }, [appliedJobsData])

  const needsDiscTest = useMemo(() => {
    return hasAppliedJobs && !discResult
  }, [hasAppliedJobs, discResult])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const steps = [
    {
      title: t('dashboard.completeYourProfileTip'),
      description:
        t('dashboard.completeYourProfileDesc'),
      completed: completedTasks >= 1,
    },
    {
      title: t('dashboard.showcaseYourSkills'),
      description:
        t('dashboard.showcaseYourSkillsDesc'),
      completed: completedTasks >= 2,
    },
    {
      title: t('dashboard.uploadQualityResume'),
      description:
        t('dashboard.uploadQualityResumeDesc'),
      completed: completedTasks >= 3,
    },
  ]

  return (
    <motion.div
      className='w-full px-2 sm:px-10 pb-2 sm:py-4 bg-background min-h-screen'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='w-full flex justify-center mb-6'>
        <div className='flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card max-w-4xl w-full'>
          <div>
            <div className='text-sm font-semibold text-foreground'>
              {t('dashboard.welcomeBack')}
            </div>
            <div className='text-xs text-muted-foreground'>
              {t('dashboard.dashboardDescription')}
            </div>
          </div>
        </div>
      </div>

      <motion.div variants={itemVariants} className='mb-8 sm:mb-12'>
        <ApplicantTask />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12'
      >
        <Card className='border border-border bg-card hover:shadow-sm transition-shadow'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm sm:text-base flex items-center gap-3'>
              <div className='w-9 h-9 rounded-lg flex items-center justify-center bg-primary'>
                <UserCheck className='w-4 h-4 text-primary-foreground' />
              </div>
              <span className='hidden sm:block font-medium text-foreground'>
                {t('navigation.profile')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium text-primary'>
                  {t('dashboard.completion')}
                </span>
                <span className='text-lg font-bold text-primary'>
                  {progressPercentage}%
                </span>
              </div>
              <div className='w-full rounded-full h-2 overflow-hidden bg-muted'>
                <motion.div
                  className='h-2 rounded-full bg-primary'
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className='text-xs flex items-center gap-1 text-muted-foreground'>
                <CheckCircle2 className='w-3 h-3 text-primary' />
                {completedTasks} {t('dashboard.ofTasksCompleted')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Link href='/dashboard/disc-test'>
          <Card className={`border transition-shadow cursor-pointer h-full relative ${
            needsDiscTest
              ? 'border-orange-500 bg-orange-50/50 hover:shadow-md hover:border-orange-600'
              : 'border-border bg-card hover:shadow-sm'
          }`}>
            {needsDiscTest && (
              <div className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center animate-pulse'>
                <AlertCircle className='w-4 h-4 text-white' />
              </div>
            )}
            <CardHeader className='pb-1'>
              <CardTitle className='text-sm sm:text-base flex items-center gap-3'>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  needsDiscTest ? 'bg-orange-500' : 'bg-primary'
                }`}>
                  <Brain className={`w-4 h-4 ${
                    needsDiscTest ? 'text-white' : 'text-primary-foreground'
                  }`} />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='hidden sm:block font-medium text-foreground'>
                      {t('navigation.discTest', 'DISC Test')}
                    </span>
                    {needsDiscTest && (
                      <span className='text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded'>
                        {t('dashboard.required', 'Required')}
                      </span>
                    )}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <DiscCardContent
              discResult={discResult ? {
                naturalProfile: discResult.naturalProfile as { D: number, I: number, S: number, C: number },
                adaptedProfile: discResult.adaptedProfile as { D: number, I: number, S: number, C: number }
              } : null}
              showLabels={true}
              compact={false}
            />
            {needsDiscTest && (
              <div className='px-4 pb-3'>
                <div className='flex items-start gap-2 p-2 bg-orange-100 rounded-lg border border-orange-200'>
                  <AlertCircle className='w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0' />
                  <p className='text-xs text-orange-800'>
                    {t('dashboard.completeDiscTestWarning', 'Complete this test to proceed with your interview applications.')}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </Link>

        <Link href='/dashboard/applied-jobs'>
          <Card className='border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm sm:text-base flex items-center gap-3'>
                <div className='w-9 h-9 rounded-lg flex items-center justify-center bg-primary'>
                  <CheckCircle2 className='w-4 h-4 text-primary-foreground' />
                </div>
                <span className='hidden sm:block font-medium text-foreground'>
                  {t('navigation.applications', 'Applications')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='text-center'>
                  <div className='text-2xl font-bold mb-1 text-foreground'>
                    {appliedJobsData?.totalApplied || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {t('dashboard.jobsApplied', 'Jobs Applied')}
                  </div>
                </div>
                <div className='flex justify-center'>
                  <ArrowRight className='w-4 h-4 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href='/dashboard/interviews'>
          <Card className='border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer relative'>
            {interviewCount > 0 && (
              <div className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-primary'>
                <span className='text-xs font-medium text-primary-foreground'>{interviewCount}</span>
              </div>
            )}
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm sm:text-base flex items-center gap-3'>
                <div className='w-9 h-9 rounded-lg flex items-center justify-center bg-primary'>
                  <Video className='w-4 h-4 text-primary-foreground' />
                </div>
                <span className='hidden sm:block font-medium text-foreground'>
                  {t('pages.appliedJobs.interviews')}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='text-center'>
                  <div className='text-2xl font-bold mb-1 text-foreground'>
                    {interviewCount}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {interviewCount === 1
                      ? t('dashboard.singleInterview', 'Interview')
                      : interviewCount > 1
                        ? t('pages.appliedJobs.interviews')
                        : t('dashboard.noInterviews', 'No interviews')}
                  </div>
                </div>
                <div className='flex justify-center'>
                  <ArrowRight className='w-4 h-4 text-muted-foreground' />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

      </motion.div>

      <motion.div variants={itemVariants} className='mb-8 sm:mb-12'>
        <ResumeBuilderLayout />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'
      >

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base text-foreground'>
              {t('dashboard.tipsForSuccess')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    step.completed
                      ? 'bg-muted border-primary'
                      : 'bg-card border-border'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-medium text-sm ${
                      step.completed ? 'bg-primary' : 'bg-foreground'
                    } text-primary-foreground`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className='w-4 h-4' />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div>
                    <h4 className='font-medium mb-1 text-sm text-foreground'>
                      {step.title}
                    </h4>
                    <p className='text-xs text-muted-foreground'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='border border-border bg-card'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base text-foreground'>
              {t('dashboard.recentOpportunities')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {jobDetails?.slice(0, 3).map((job) => {
                const hasApplied = appliedJobsData?.applications?.some(
                  (app) => app.job.jobId === job.jobId
                )
                return (
                  <Link
                    key={job.id}
                    href={`/job-openings/${job.jobId}`}
                    className='block'
                  >
                    <div className='p-3 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer'>
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='font-medium text-sm text-foreground'>
                          {job.title}
                        </h4>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground'>
                            {job.type}
                          </span>
                          {hasApplied && (
                            <span className='text-xs px-2 py-0.5 rounded font-medium bg-primary text-primary-foreground'>
                              {t('pages.jobDetails.applied')}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className='text-xs mb-1 text-muted-foreground'>
                        {job.location} • {job.salary}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default ApplicantDashboard
