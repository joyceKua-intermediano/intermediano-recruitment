import { useState } from 'react'
import { TestStep, TestResults } from '../types'
import { MIN_SELECTIONS, MAX_SELECTIONS } from '../constants/adjectives'
import { calculateResults } from '../services/discCalculations'

export function useDiscTest() {
  const [currentStep, setCurrentStep] = useState<TestStep>('intro')
  const [question1Selections, setQuestion1Selections] = useState<number[]>([])
  const [question2Selections, setQuestion2Selections] = useState<number[]>([])
  const [naturalProfile, setNaturalProfile] = useState<TestResults>({ D: 0, I: 0, S: 0, C: 0 })
  const [adaptedProfile, setAdaptedProfile] = useState<TestResults>({ D: 0, I: 0, S: 0, C: 0 })

  const toggleSelection = (adjectiveId: number, isQuestion1: boolean) => {
    if (isQuestion1) {
      setQuestion1Selections((prev) =>
        prev.includes(adjectiveId)
          ? prev.filter((id) => id !== adjectiveId)
          : prev.length < MAX_SELECTIONS
          ? [...prev, adjectiveId]
          : prev
      )
    } else {
      setQuestion2Selections((prev) =>
        prev.includes(adjectiveId)
          ? prev.filter((id) => id !== adjectiveId)
          : prev.length < MAX_SELECTIONS
          ? [...prev, adjectiveId]
          : prev
      )
    }
  }

  const handleQuestion1Complete = () => {
    if (question1Selections.length >= MIN_SELECTIONS && question1Selections.length <= MAX_SELECTIONS) {
      const results = calculateResults(question1Selections)
      setNaturalProfile(results)
      setCurrentStep('question2')
    }
  }

  const handleQuestion2Complete = () => {
    if (question2Selections.length >= MIN_SELECTIONS && question2Selections.length <= MAX_SELECTIONS) {
      const results = calculateResults(question2Selections)
      setAdaptedProfile(results)
      setCurrentStep('results')
    }
  }

  const startTest = () => setCurrentStep('question1')
  const goToIntro = () => setCurrentStep('intro')
  const goToQuestion1 = () => setCurrentStep('question1')

  return {
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
  }
}

