import { useState } from 'react'
import { InterviewQuestion } from '../types/interview'

const INITIAL_QUESTION: InterviewQuestion = {
  id: '1',
  question: 'Tell me about yourself and your experience.',
  timeLimit: 120,
}

export const useInterviewState = () => {
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [allTranscripts, setAllTranscripts] = useState<string[]>([])

  const addTranscript = (transcript: string) => {
    setAllTranscripts(prev => [...prev, transcript])
  }

  const initializeInterview = () => {
    setCurrentQuestion(INITIAL_QUESTION)
  }

  return {
    currentQuestion,
    questionIndex,
    interviewComplete,
    allTranscripts,
    setCurrentQuestion,
    setQuestionIndex,
    setInterviewComplete,
    addTranscript,
    initializeInterview,
  }
}
