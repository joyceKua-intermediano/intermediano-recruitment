'use client'

import React, { useEffect } from 'react'
import { InfiniteMovingCards } from './ui/infinite-moving-cards'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card'
import { JobDetails, useJobStore } from '@/lib/stores/jobStore'
import { useGetOpenJob } from '@/features/job/hooks/useGetJobs'

export function JobOpeningSection() {
  const { data } = useGetOpenJob()
  
  return (
    <div
      className='w-full py-12 md:py-16 lg:py-20 bg-white dark:bg-black dark:bg-grid-white/[0.03]'
      id='job-openings'
    >
      <div className='content-between px-4 md:px-6'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent'>
            Current Job Openings
          </h2>
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
            Explore opportunities to join our global team of talented
            professionals
          </p>
        </div>

        <div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {data && data.length > 0 ? (
            data.map((job) => <JobCard key={job.id} {...job} />)
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No open jobs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const JobCard = ({ jobId, title, location, type, salary }: JobDetails) => (
  <Card className='hover:shadow-lg transition-shadow duration-300'>
    <CardHeader>
      <CardTitle className='text-xl font-bold text-primary dark:text-[#a0522d]'>
        {title}
      </CardTitle>
      <div className='flex items-center gap-4 mt-2'>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {location}
        </span>
        <span className='text-sm text-gray-500 dark:text-gray-400'>•</span>
        <span className='text-sm text-gray-500 dark:text-gray-400'>{type}</span>
      </div>
    </CardHeader>
    <CardContent>
      <div className='flex justify-between items-center mt-4'>
        <span className='font-medium text-gray-700 dark:text-gray-300'>
          {salary}
        </span>
        <a
          href={`/job-openings/${jobId}`}
          className='px-4 py-2 bg-gradient-to-r from-primary to-red-600 text-white rounded-md font-semibold hover:from-red-600 hover:to-primary transition-colors'
        >
          View Details
        </a>
      </div>
    </CardContent>
  </Card>
)
