import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { InterviewQuestion, TranscriptionResponse, MultimodalSessionResponse } from '../types/interview'
import { uploadVideoPerQuestion } from '../utils/videoUpload'
import { useTranslation } from 'react-i18next'

interface UseAnswerSubmissionProps {
  currentQuestion: InterviewQuestion | null
  questionIndex: number
  stopRecording: () => Promise<Blob | null>
  getCurrentVideoChunk?: () => Blob | null
  stopVideoRecording?: () => Promise<Blob | null>
  jobId?: string
  applicationId?: string
  interviewQuestions: InterviewQuestion[]
  onTranscriptReceived: (transcript: string) => void
  onNextQuestion: (question: InterviewQuestion, index: number) => void
  onInterviewComplete: () => void
  onAnswerAcknowledged?: (payload: {
    transcript: string
    acknowledgement?: string
    question: InterviewQuestion
    nextQuestion: InterviewQuestion | null
    isComplete: boolean
    isFollowUp?: boolean
    needsClarification?: boolean
  }) => Promise<void> | void
  onAnswerSubmitted?: () => void
  useMultimodalSession?: boolean
  allTranscripts?: string[]
  applicantName?: string
}

interface UseAnswerSubmissionReturn {
  isSubmitting: boolean
  transcript: string
  submitAnswer: () => Promise<void>
}

export const useAnswerSubmission = ({
  currentQuestion,
  questionIndex,
  stopRecording,
  stopVideoRecording,
  jobId,
  applicationId,
  interviewQuestions,
  onTranscriptReceived,
  onNextQuestion,
  onInterviewComplete,
  onAnswerAcknowledged,
  onAnswerSubmitted,
  useMultimodalSession = false,
  allTranscripts = [],
  applicantName,
}: UseAnswerSubmissionProps): UseAnswerSubmissionReturn => {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transcript, setTranscript] = useState<string>('')
  const sessionIdRef = useRef<string | null>(null)

  if (useMultimodalSession && !sessionIdRef.current) {
    sessionIdRef.current = `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const submitAnswer = async () => {
    if (!currentQuestion) return

    try {
      setIsSubmitting(true)

      let videoBlob: Blob | null = null
      if (stopVideoRecording) {
        videoBlob = await stopVideoRecording()
      }

      const audioBlob = await stopRecording()

      if (!audioBlob) {
        toast.error(t('pages.interviewDetail.toastNoAudioRecorded'))
        return
      }

      const formData = new FormData()
      formData.append('audio', audioBlob, 'answer.webm')
      formData.append('questionId', currentQuestion.id)
      formData.append('questionIndex', questionIndex.toString())
      formData.append('question', currentQuestion.question)
      if (jobId) {
        formData.append('jobId', jobId)
      }
      if (applicationId) {
        formData.append('applicationId', applicationId)
      }

      if (useMultimodalSession && sessionIdRef.current) {
        formData.append('sessionId', sessionIdRef.current)
        formData.append('previousTranscripts', JSON.stringify(allTranscripts))
        if (applicantName) {
          formData.append('applicantName', applicantName)
        }
        onAnswerSubmitted?.()

        const response = await fetch('/api/ai-interview/multimodal-session', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(t('pages.interviewDetail.toastProcessAnswerFailed'))
        }

        const data: MultimodalSessionResponse = await response.json()

        setTranscript(data.transcript)
        onTranscriptReceived(data.transcript)

        if (videoBlob && applicationId) {
          uploadVideoPerQuestion(videoBlob, {
            applicationId,
            questionIndex,
          })
        }

        if (onAnswerAcknowledged) {
          await onAnswerAcknowledged({
            transcript: data.transcript,
            acknowledgement: data.acknowledgement,
            question: currentQuestion,
            nextQuestion: data.nextQuestion,
            isComplete: data.isComplete,
            isFollowUp: data.isFollowUp,
            needsClarification: data.needsClarification,
          })
        }

        if (data.isComplete) {
          onInterviewComplete()
          toast.success(t('pages.interviewDetail.toastInterviewCompleted'))
          return
        }

        if (data.isFollowUp && data.nextQuestion) {
          onNextQuestion(data.nextQuestion, questionIndex)
        } else if (data.nextQuestion) {
          onNextQuestion(data.nextQuestion, questionIndex + 1)
        }

        toast.success(t('pages.interviewDetail.toastAnswerSubmitted'))
        return
      }
      onAnswerSubmitted?.()

      const response = await fetch('/api/ai-interview/process-answer', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(t('pages.interviewDetail.toastProcessAnswerFailed'))
      }

      const data: TranscriptionResponse = await response.json()

      setTranscript(data.transcript)
      onTranscriptReceived(data.transcript)

      const nextQuestion = data.nextQuestion || (
        questionIndex + 1 < interviewQuestions.length
          ? interviewQuestions[questionIndex + 1]
          : null
      )

      const interviewIsComplete = data.isComplete || !nextQuestion

      if (onAnswerAcknowledged) {
        await onAnswerAcknowledged({
          transcript: data.transcript,
          question: currentQuestion,
          nextQuestion,
          isComplete: interviewIsComplete,
        })
      }

      if (interviewIsComplete) {
        onInterviewComplete()
        toast.success(t('pages.interviewDetail.toastInterviewCompleted'))
        return
      }

      onNextQuestion(nextQuestion, questionIndex + 1)
      toast.success(t('pages.interviewDetail.toastAnswerSubmittedNextQuestion'))

    } catch (err) {
      console.error('Error submitting answer:', err)
      toast.error(t('pages.interviewDetail.toastSubmitAnswerFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    isSubmitting,
    transcript,
    submitAnswer,
  }
}
