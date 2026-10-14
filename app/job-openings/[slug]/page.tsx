'use client'
import { notFound, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useGetOpenJob } from '@/features/job/hooks/useGetJobs'
import BasicInformationModal from '@/features/applicant/components/modal/BasicInformation';
import SkillsExpertiseModal from '@/features/applicant/components/modal/SkillsExpertise';
import UploadResumeModal from '@/features/applicant/components/modal/UploadResume';
import { useGetApplicantInformation } from '@/features/applicant/hooks/useGetApplicantInformation';
import { useCheckApplicationStatus } from '@/features/applicant/hooks/useCheckApplicationStatus';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function ProfileSetupWizard({ open, onOpenChange, jobId }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  jobId?: string
}) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(0);
      setCompleted(false);
    }
  }, [open]);

  const handleBasicInfoSuccess = () => setStep(1);
  const handleSkillsSuccess = () => setStep(2);
  const handleResumeSuccess = () => {
    // Don't close modal after resume upload - let user click "Apply Now"
    // The modal will close when application is submitted
  };

  const handleApplicationSuccess = () => {
    setCompleted(true);
    setTimeout(() => {
      onOpenChange(false);
      setStep(0);
      setCompleted(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <div className="flex flex-col max-h-[80vh]">

          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle>{t('pages.jobDetails.profileTitle')}</DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            {!completed && step === 0 && (
              <BasicInformationModal
                title={t('pages.jobDetails.basicInfo')}
                onSubmitSuccess={handleBasicInfoSuccess}
                onNext={handleBasicInfoSuccess}
              />
            )}
            {!completed && step === 1 && (
              <SkillsExpertiseModal
                title={t('pages.jobDetails.skillsExpertise')}
                onSubmitSuccess={handleSkillsSuccess}
                onNext={handleSkillsSuccess}
                jobId={jobId}
              />
            )}
            {!completed && step === 2 && (
              <UploadResumeModal
                title={t('pages.jobDetails.uploadResume')}
                onSuccess={handleResumeSuccess}
                onNext={handleApplicationSuccess}
                jobId={jobId}
              />
            )}
            {completed && (
              <div className="text-center py-8">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {jobId ? t('pages.jobDetails.applicationSubmitted') : t('pages.jobDetails.profileCompleted')}
                </div>
                <div className="text-gray-700">
                  {jobId
                    ? t('pages.jobDetails.applicationSubmittedDescription')
                    : t('pages.jobDetails.profileCompletedDescription')
                  }
                </div>
              </div>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { t } = useTranslation()
  useGetApplicantInformation();
  const { slug } = React.use(params)
  const { data, isLoading, error } = useGetOpenJob()
  const decodedSlug = decodeURIComponent(slug)

  const job = data?.find((j) => j.jobId === decodedSlug)
  const { user } = useUser()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileWizard, setShowProfileWizard] = useState(false)

  const { data: applicationStatus, isLoading: isLoadingApplicationStatus } = useCheckApplicationStatus(job?.id || '')

  useEffect(() => {
    if (user && job) {
      const urlParams = new URLSearchParams(window.location.search)
      const shouldApply = urlParams.get('apply')

      if (shouldApply === 'true' && !applicationStatus?.hasApplied) {
        setShowProfileWizard(true)
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [user, job, applicationStatus?.hasApplied])

  if (isLoading) return <div>{t('pages.jobDetails.loading')}</div>
  if (error) return <div>{t('pages.jobDetails.error')}</div>
  if (!job) return notFound()

  const handleApply = () => {
    if (user) {
      setShowProfileWizard(true);
    } else {
      setShowAuthModal(true)
    }
  }

  const handleAuthRedirect = () => {
    setShowAuthModal(false)
    const redirectUrl = encodeURIComponent(`/job-openings/${decodedSlug}?apply=true`)
    router.push(`/auth/login?returnTo=${redirectUrl}`)
  }

  const hasApplied = applicationStatus?.hasApplied || false

  return (
    <main className='max-w-3xl mx-auto px-4 py-16 text-gray-900'>
      <h1 className='text-3xl font-bold mb-6 text-primary'>{job.title}</h1>
      <div className='mb-4 text-gray-700'>
        {t('pages.jobDetails.location')}: <span className='font-medium'>{job.location}</span> | {t('pages.jobDetails.type')}:{' '}
        <span className='font-medium'>{job.type}</span> | {t('pages.jobDetails.salary')}:{' '}
        <span className='font-medium'>{job.salary}</span>
      </div>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>{t('pages.jobDetails.jobBrief')}</h2>
        <div
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>{t('pages.jobDetails.essentialSkills')}</h2>
        <ul className='list-disc list-inside ml-4 mt-2'>
          {job.essentialSkills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>{t('pages.jobDetails.responsibilities')}</h2>
        <ul className='list-disc list-inside ml-4 mt-2'>
          {job.responsibilities.map((resp, idx) => (
            <li key={idx}>{resp}</li>
          ))}
        </ul>
      </section>
      <section className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>{t('pages.jobDetails.qualifications')}</h2>
        <ul className='list-disc list-inside ml-4 mt-2'>
          {job.qualifications.map((qual, idx) => (
            <li key={idx}>{qual}</li>
          ))}
        </ul>
      </section>
      <div className='mt-8 flex justify-end'>
        {hasApplied ? (
          <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5" />
            <span>{t('pages.jobDetails.applied')}</span>
          </div>
        ) : (
          <button
            className='cursor-pointer px-6 py-3 bg-gradient-to-r from-primary to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200'
            onClick={handleApply}
            disabled={isLoading || isLoadingApplicationStatus}
          >
            {isLoadingApplicationStatus ? t('pages.jobDetails.checking') : t('pages.jobDetails.applyNow')}
          </button>
        )}
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pages.jobDetails.authRequiredTitle')}</DialogTitle>
            <DialogDescription>
              {t('pages.jobDetails.authRequiredDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex flex-row gap-2 justify-end'>
            <Button variant='outline' onClick={() => setShowAuthModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleAuthRedirect} className='cursor-pointer'>
              {t('pages.jobDetails.authAction')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProfileSetupWizard
        open={showProfileWizard}
        onOpenChange={setShowProfileWizard}
        jobId={job?.id || ''}
      />
    </main>
  )
}
