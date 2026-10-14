export type TestStep = 'intro' | 'question1' | 'question2' | 'results'

export interface TestResults {
  D: number
  I: number
  S: number
  C: number
}

export interface SelectionStatus {
  text: string
  color: string
  canProceed: boolean
}

export interface QuestionProps {
  questionNumber: 1 | 2
  title: string
  description: string
  selections: number[]
  isQuestion1: boolean
  onToggleSelection: (adjectiveId: number, isQuestion1: boolean) => void
  onComplete: () => void
  onBack: () => void
}

export interface ResultsProps {
  naturalProfile: TestResults
  adaptedProfile: TestResults
}

