'use client'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Video, Calendar, MapPin, Briefcase, Shield } from 'lucide-react'
import Link from 'next/link'
import { useGetAppliedJobs } from '@/features/applicant/hooks/useGetAppliedJobs'
import { useGetApplicantInformation } from '@/features/applicant/hooks/useGetApplicantInformation'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function InterviewsPage() {
  const { t } = useTranslation()
  useGetApplicantInformation()
  const { data: appliedJobsData, isLoading, error } = useGetAppliedJobs()

  const interviews = useMemo(() => {
    return appliedJobsData?.applications?.filter(
      (app) => app.status === 'ai-interview'
    ) || []
  }, [appliedJobsData])

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
            <p className='mt-4 text-muted-foreground'>{t('pages.interviews.loading')}</p>
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
            <p className='text-destructive'>{t('pages.interviews.error')}</p>
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
                {t('pages.interviews.back')}
              </Button>
            </Link>
          </div>
          
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl font-bold mb-2 text-foreground'>
              {t('pages.interviews.title')}
            </h1>
            <p className='text-lg text-muted-foreground'>
              {t('pages.interviews.subtitle')}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          {interviews.length > 0 ? (
            <div className='space-y-4'>
              {interviews.map((interview) => (
                <motion.div
                  key={interview.id}
                  variants={itemVariants}
                >
                  <Card className='border border-border bg-card hover:shadow-sm transition-shadow'>
                    <CardContent className='p-4'>
                      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
                        <div className='flex-1'>
                          <div className='flex items-start justify-between mb-3 gap-3'>
                            <h3 className='text-base font-medium text-foreground'>
                              {interview.job.title}
                            </h3>
                            <span className='px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 shrink-0 border border-border bg-muted text-muted-foreground'>
                              <Video className='w-3.5 h-3.5' />
                              {t('pages.interviews.badge')}
                            </span>
                          </div>
                          
                          <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                            <div className='flex items-center gap-1.5'>
                              <MapPin className='w-3.5 h-3.5' />
                              <span>{interview.job.location}</span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                              <Briefcase className='w-3.5 h-3.5' />
                              <span>{interview.job.type}</span>
                            </div>
                            <div className='flex items-center gap-1.5'>
                              <Calendar className='w-3.5 h-3.5' />
                              <span>{formatDate(interview.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className='sm:ml-4'>
                          <Link href={`/dashboard/interviews/${interview.id}`}>
                            <Button className='flex items-center gap-2 bg-primary text-primary-foreground'>
                              <Video className='w-4 h-4' />
                              {t('pages.interviews.start')}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className='border border-border bg-card text-center'>
              <CardContent className='p-8'>
                <div className='mb-4'>
                  <Video className='w-12 h-12 mx-auto text-muted-foreground' />
                </div>
                <h3 className='text-lg font-medium mb-2 text-foreground'>
                  {t('pages.interviews.emptyTitle')}
                </h3>
                <p className='text-sm mb-5 text-muted-foreground'>
                  {t('pages.interviews.emptySubtitle')}
                </p>
                <Link href='/dashboard/applied-jobs'>
                  <Button variant='outline' size='sm'>
                    {t('pages.interviews.viewApplications')}
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

