'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { CardSkeleton } from '@/components/ui/loading'
import { CheckCircle, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import BasicInformationModal from '@/features/applicant/components/modal/BasicInformation'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useGetApplicantInformation } from '@/features/applicant/hooks/useGetApplicantInformation'
import SkillsExpertiseModal from '@/features/applicant/components/modal/SkillsExpertise'
import { useGetSkillsExpertise } from '@/features/applicant/hooks/useGetSkillsExpertise'
import UploadResumeModal from '@/features/applicant/components/modal/UploadResume'
import { useGetApplicantResumeDetails } from '@/features/applicant/hooks/useGetApplicantResumeDetails'
import { useTranslation } from 'react-i18next'

const ApplicantTask = () => {
  const { t } = useTranslation()
  const { isPending } = useGetApplicantInformation()
  const { isPending: isPendingSkills } = useGetSkillsExpertise()
  const { isPending: isPendingResumeDetails } = useGetApplicantResumeDetails()
  const { tasks, updateTaskStatus } = useApplicantStore()

  const [showWizard, setShowWizard] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (showWizard) {
      setCompleted(false)
    }
  }, [showWizard])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isPending || isPendingSkills || isPendingResumeDetails) {
    return (
      <motion.div
        className='space-y-4'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="text-center sm:text-left"
        >

        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={`skeleton-${idx}`}
              variants={itemVariants}
            >
              <CardSkeleton
                className='h-40 sm:h-44'
                showImage={false}
                lines={4}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const getTaskIcon = (completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-white" />
    }
    return <Circle className="w-6 h-6 text-gray-200" />
  }

  const getTaskStatus = (completed: boolean, index: number) => {
    if (completed) {
      return {
        text: t('dashboard.completed', 'Completed'),
        bgColor: 'bg-muted',
        borderColor: 'border-primary',
        iconBg: 'bg-primary',
        textColor: 'text-primary',
      }
    }
    return {
      text: index === 0 ? t('dashboard.nextStep', 'Next Step') : t('dashboard.pending', 'Pending'),
      bgColor: 'bg-card',
      borderColor: 'border-border',
      iconBg: 'bg-foreground',
      textColor: 'text-foreground',
    }
  }

  const completedTasks = tasks.slice(0, 3).filter(t => t.completed).length
  const progressPercentage = Math.round((completedTasks / 3) * 100)

  const handleBasicInfoSuccess = () => {
    updateTaskStatus(1, true)
    setCurrentStep(1)
  }

  const handleSkillsSuccess = () => {
    updateTaskStatus(2, true)
    setCurrentStep(2)
  }

  const handleResumeSuccess = () => {
    updateTaskStatus(3, true)
    setCompleted(true)
    setTimeout(() => {
      setShowWizard(false)
      setCurrentStep(0)
      setCompleted(false)
    }, 1500)
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return isPending ? t('dashboard.startBuildingProfile', 'Start Building Your Profile') : t('dashboard.editProfile', 'Edit Your Profile')
      case 1:
        return isPendingSkills ? t('dashboard.showcaseSkillsExpertise', 'Showcase Your Skills & Expertise') : t('dashboard.editSkillsExpertise', 'Edit your Skills & Expertise')
      case 2:
        return isPendingResumeDetails ? t('dashboard.addResume', 'Add your resume') : t('dashboard.updateResume', 'Update your resume')
      default:
        return t('dashboard.completeYourProfile')
    }
  }

  return (
    <motion.div
      className='space-y-4'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="text-center sm:text-left"
      >

      </motion.div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {tasks.slice(0, 3).map((task, idx) => {
          const status = getTaskStatus(task.completed, idx)

          return (
            <motion.div
              key={`task-${idx}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`border ${status.borderColor} ${status.bgColor} hover:shadow-sm transition-shadow cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${status.iconBg} text-primary-foreground`}>
                        {getTaskIcon(task.completed)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className='text-sm font-medium text-foreground'>
                          {task.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded border ${status.bgColor} ${status.textColor} ${status.borderColor} text-center truncate whitespace-nowrap ml-2`}>
                          {status.text}
                        </span>
                      </div>

                      <div className="space-y-3 mt-2">
                        <Dialog open={showWizard} onOpenChange={setShowWizard}>
                          <DialogTrigger asChild>
                            <Button
                              className='w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg transition-colors whitespace-normal text-center leading-snug'
                              onClick={() => {
                                setCurrentStep(idx)
                                setShowWizard(true)
                              }}
                            >
                              {idx === 0 && (isPending ? t('dashboard.startBuildingProfile', 'Start Building Your Profile') : t('dashboard.editProfile', 'Edit Your Profile'))}
                              {idx === 1 && (isPendingSkills ? t('dashboard.showcaseSkillsExpertise', 'Showcase Your Skills & Expertise') : t('dashboard.editSkillsExpertise', 'Edit your Skills & Expertise'))}
                              {idx === 2 && (isPendingResumeDetails ? t('dashboard.addResume', 'Add your resume') : t('dashboard.updatedResume', 'Updated your resume'))}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex flex-col max-h-[80vh]">

                              <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 px-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
                                <DialogHeader>
                                  <DialogTitle>{getStepTitle()}</DialogTitle>
                                </DialogHeader>
                              </div>

                              <div className="flex-1 overflow-y-auto px-4 py-2">
                                {!completed && currentStep === 0 && (
                                  <BasicInformationModal
                                    title={t('pages.jobDetails.basicInfo')}
                                    onSubmitSuccess={handleBasicInfoSuccess}
                                    onNext={handleBasicInfoSuccess}
                                  />
                                )}
                                {!completed && currentStep === 1 && (
                                  <SkillsExpertiseModal
                                    title={t('pages.jobDetails.skillsExpertise')}
                                    onSubmitSuccess={handleSkillsSuccess}
                                    onNext={handleSkillsSuccess}
                                  />
                                )}
                                {!completed && currentStep === 2 && (
                                  <UploadResumeModal
                                    title={t('pages.jobDetails.uploadResume')}
                                    onSuccess={handleResumeSuccess}
                                    onNext={handleResumeSuccess}
                                  />
                                )}
                                {completed && (
                                  <div className="text-center py-8">
                                    <div className="text-2xl font-bold text-green-600 mb-2">
                                      {t('pages.jobDetails.profileCompleted')}
                                    </div>
                                    <div className="text-gray-700">
                                      {t('pages.jobDetails.profileCompletedDescription')}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        variants={itemVariants}
        className="mt-8 sm:mt-12"
      >

      </motion.div>
    </motion.div>
  )
}

export default ApplicantTask
