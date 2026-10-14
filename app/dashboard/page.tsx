'use client'
import React from 'react'
import ApplicantDashboard from './_components/applicant/ApplicantDashboard'
import ProfileSetupInstructionModal from '@/features/applicant/components/modal/ProfileSetupInstructions'

const DashboardPage = () => {
  return (
    <div className='w-full h-full min-h-screen bg-white dark:bg-neutral-900'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 lg:mt-0 pb-6 sm:pb-8'>
        <ApplicantDashboard />
        <ProfileSetupInstructionModal />
      </div>
    </div>
  )
}

export default DashboardPage
