'use client'

import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  DollarSign,
  Tag,
} from 'lucide-react'
import { useGetOpenJob } from '@/features/job/hooks/useGetJobs'
import { Spinner } from '@/components/ui/loading'
import { useTranslation } from 'react-i18next'

export default function JobOpeningsPage() {
  const { t } = useTranslation()
  const { data: jobs, isLoading, error } = useGetOpenJob()

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#c40e12]/5 via-white to-[#a0522d]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
        <div className='container px-4 mx-auto pt-32'>
          <div className='flex justify-center items-center'>
            <Spinner size='xl' />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#c40e12]/5 via-white to-[#a0522d]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
        <div className='container px-4 mx-auto pt-32'>
          <div className='text-center'>
            <p className='text-red-500'>
              {t('pages.jobOpenings.errorLoading')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#c40e12]/5 via-white to-[#a0522d]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>

      <section className='relative pt-32 pb-16 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#c40e12]/10 via-[#a0522d]/10 to-[#8b4513]/10' />
          <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,42,28,0.1),transparent_50%)]' />
        </div>
        <div className='container px-4 mx-auto relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center max-w-6xl mx-auto'
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#c40e12] via-[#c40e12] to-[#8b4513] bg-clip-text text-transparent'
            >
              {t('pages.jobOpenings.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'
            >
              {t('pages.jobOpenings.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className='py-16'>
        <div className='container px-8 mx-auto max-w-full col'>
          {jobs && jobs.length > 0 ? (
            <div className='grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
              {jobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className='shadow-lg border-0 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300 flex flex-col'>
                    <CardHeader className='flex flex-row items-center gap-4 pb-2'>
                      <Briefcase className='w-8 h-8 text-primary dark:text-[#a0522d]' />
                      <div>
                        <CardTitle className='text-xl font-bold text-gray-800 dark:text-gray-200'>
                          {job.title}
                        </CardTitle>
                        <CardDescription className='text-gray-600 dark:text-gray-400'>
                          {job.category}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className='pt-0 flex flex-col flex-1'>
                      <div className='flex flex-wrap gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <MapPin className='w-4 h-4' /> {job.location}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' /> {job.type}
                        </span>
                        {job.salary && (
                          <span className='flex items-center gap-1'>
                            <DollarSign className='w-4 h-4' /> {job.salary}
                          </span>
                        )}
                        <span className='flex items-center gap-1'>
                          <Tag className='w-4 h-4' /> {job.category}
                        </span>
                      </div>

                      <div
                        className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />

                      <div className='mt-auto'>
                        <a
                          href={`/job-openings/${job.jobId}`}
                          className='inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[color:var(--primary)] to-[#a0522d] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                        >
                          {t('pages.jobOpenings.viewDetails')} <ArrowRight className='ml-2 w-4 h-4' />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className='text-center py-16'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2'>
                  {t('pages.jobOpenings.emptyTitle')}
                </h3>
                <p className='text-gray-500 dark:text-gray-500'>
                  {t('pages.jobOpenings.emptySubtitle')}
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
