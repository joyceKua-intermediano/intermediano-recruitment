'use client'

import React, { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useDiscTest } from '@/features/disc/hooks/useDiscTest'
import { useGetDiscResult } from '@/features/applicant/hooks/useGetDiscResult'
import { DiscIntro } from '@/features/disc/components/DiscIntro'
import { DiscQuestion } from '@/features/disc/components/DiscQuestion'
import { DiscResults } from '@/features/disc/components/DiscResults'
import { COLOR_BG_LIGHT } from '@/features/disc/constants/colors'
import { TestResults } from '@/features/disc/types'
import { useTranslation } from 'react-i18next'

export default function DISCTestPage() {
  const { t } = useTranslation()
  const {
    currentStep,
    question1Selections,
    question2Selections,
    naturalProfile,
    adaptedProfile,
    toggleSelection,
    handleQuestion1Complete,
    handleQuestion2Complete,
    startTest,
    goToIntro,
    goToQuestion1,
    setCurrentStep,
    setNaturalProfile,
    setAdaptedProfile,
  } = useDiscTest()

  const { data: discResult, isLoading } = useGetDiscResult()

  useEffect(() => {
    if (discResult && currentStep === 'intro') {
      setNaturalProfile(discResult.naturalProfile as TestResults)
      setAdaptedProfile(discResult.adaptedProfile as TestResults)
      setCurrentStep('results')
    }
  }, [discResult, currentStep, setNaturalProfile, setAdaptedProfile, setCurrentStep])

  if (isLoading) {
    return (
      <div className='min-h-screen py-8 px-4 flex items-center justify-center' style={{ background: COLOR_BG_LIGHT }}>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-gray-600'>{t('pages.discTest.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen py-8 px-4' style={{ background: COLOR_BG_LIGHT }}>
      <AnimatePresence mode='wait'>
        {currentStep === 'intro' && <DiscIntro onStart={startTest} />}

        {currentStep === 'question1' && (
          <DiscQuestion
            questionNumber={1}
            title={t('pages.discTest.q1Title')}
            description={t('pages.discTest.q1Description')}
            selections={question1Selections}
            isQuestion1={true}
            onToggleSelection={toggleSelection}
            onComplete={handleQuestion1Complete}
            onBack={goToIntro}
          />
        )}

        {currentStep === 'question2' && (
          <DiscQuestion
            questionNumber={2}
            title={t('pages.discTest.q2Title')}
            description={t('pages.discTest.q2Description')}
            selections={question2Selections}
            isQuestion1={false}
            onToggleSelection={toggleSelection}
            onComplete={handleQuestion2Complete}
            onBack={goToQuestion1}
          />
        )}

        {currentStep === 'results' && (
          <DiscResults
            naturalProfile={naturalProfile}
            adaptedProfile={adaptedProfile}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
