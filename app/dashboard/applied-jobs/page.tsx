'use client'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, MapPin, DollarSign, Briefcase, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useGetAppliedJobs } from '@/features/applicant/hooks/useGetAppliedJobs'
import { useGetApplicantInformation } from '@/features/applicant/hooks/useGetApplicantInformation'
import { getStatusClasses } from '../_constants/colors'
import { useTranslation } from 'react-i18next'

export default function AppliedJobsPage() {
  const { t } = useTranslation()
  useGetApplicantInformation()
  const { data: appliedJobsData, isLoading, error } = useGetAppliedJobs()

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

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

  if (isLoading) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-background min-h-screen'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
            <p className='mt-4 text-muted-foreground'>{t('pages.appliedJobs.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-background min-h-screen'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center py-8'>
            <p className='text-destructive'>{t('pages.appliedJobs.error')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-background min-h-screen'
      variants={containerVariants}
      initial='hidden'
      animate='visible'
    >
      <div className='max-w-4xl mx-auto'>

        <motion.div variants={itemVariants} className='mb-8'>
          <div className='flex items-center gap-4 mb-6'>
            <Link href='/dashboard'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
              >
                <ArrowLeft className='w-4 h-4' />
                {t('pages.appliedJobs.back')}
              </Button>
            </Link>
          </div>

          <div className='text-center sm:text-left'>
            <h1 className='text-3xl font-bold mb-2 text-foreground'>
              {t('pages.appliedJobs.title')}
            </h1>
            <p className='text-lg text-muted-foreground'>
              {t('pages.appliedJobs.subtitle')}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className='mb-8'>
          <Card className='border border-border bg-card'>
            <CardContent className='p-4'>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold mb-1 text-foreground'>
                    {appliedJobsData?.totalApplied || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {t('pages.appliedJobs.totalApplications')}
                  </div>
                </div>
                <div>
                  <div className='text-2xl font-bold mb-1 text-primary'>
                    {appliedJobsData?.applications?.filter(app => app.status === 'reviewing').length || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {t('pages.appliedJobs.underReview')}
                  </div>
                </div>
                <div>
                  <div className='text-2xl font-bold mb-1 text-primary'>
                    {appliedJobsData?.applications?.filter(app => app.status === 'interview').length || 0}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {t('pages.appliedJobs.interviews')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          {appliedJobsData?.applications && appliedJobsData.applications.length > 0 ? (
            <div className='space-y-4'>
              {appliedJobsData.applications.map((application) => {
                const statusClasses = getStatusClasses(application.status)
                return (
                  <motion.div
                    key={application.id}
                    variants={itemVariants}
                  >
                    <Card className='border border-border bg-card hover:shadow-sm transition-shadow'>
                      <CardContent className='p-4'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='flex items-start justify-between mb-3 gap-3'>
                              <h3 className='text-base font-medium text-foreground'>
                                {application.job.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium border shrink-0 ${statusClasses.bg} ${statusClasses.text} ${statusClasses.border}`}
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3'>
                              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <MapPin className='w-3.5 h-3.5' />
                                <span>{application.job.location}</span>
                              </div>
                              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <Briefcase className='w-3.5 h-3.5' />
                                <span>{application.job.type}</span>
                              </div>
                              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                <DollarSign className='w-3.5 h-3.5' />
                                <span>{application.job.salary}</span>
                              </div>
                            </div>

                            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                              <Calendar className='w-3 h-3' />
                              <span>{t('pages.appliedJobs.appliedOn', { date: formatDate(application.createdAt) })}</span>
                            </div>
                          </div>

                          <div className='flex flex-col gap-2'>
                            <Link href={`/job-openings/${application.job.jobId}`}>
                              <Button
                                variant='outline'
                                size='sm'
                                className='flex items-center gap-2'
                              >
                                {t('pages.appliedJobs.viewJob')}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <Card className='border border-border bg-card text-center'>
              <CardContent className='p-8'>
                <div className='mb-4'>
                  <Clock className='w-12 h-12 mx-auto text-muted-foreground' />
                </div>
                <h3 className='text-lg font-medium mb-2 text-foreground'>
                  {t('pages.appliedJobs.emptyTitle')}
                </h3>
                <p className='text-sm mb-6 text-muted-foreground'>
                  {t('pages.appliedJobs.emptySubtitle')}
                </p>
                <Link href='/job-openings'>
                  <Button className='bg-primary text-primary-foreground'>
                    {t('pages.appliedJobs.browseJobs')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
