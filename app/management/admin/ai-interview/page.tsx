'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useAudioRecorder } from '@/features/ai-interview/hooks/useAudioRecorder'
import { useTextToSpeech } from '@/features/ai-interview/hooks/useTextToSpeech'
import { useVideoStream } from '@/features/ai-interview/hooks/useVideoStream'
import { useInterviewState } from '@/features/ai-interview/hooks/useInterviewState'
import { useAnswerSubmission } from '@/features/ai-interview/hooks/useAnswerSubmission'
import { useGetJobInterviewQuestions } from '@/features/admin/hooks/useJobManagement'
import { InterviewQuestion } from '@/features/ai-interview/types/interview'
import { AiAvatarSection } from '@/features/ai-interview/components/AiAvatarSection'
import { UserVideoSection } from '@/features/ai-interview/components/UserVideoSection'
import { QuestionCard } from '@/features/ai-interview/components/QuestionCard'
import { RecordingControls } from '@/features/ai-interview/components/RecordingControls'
import { TranscriptCard } from '@/features/ai-interview/components/TranscriptCard'
import { InterviewComplete } from '@/features/ai-interview/components/InterviewComplete'
import { toast } from 'sonner'
import { useRef } from 'react'

const transformQuestions = (questions: string[]): InterviewQuestion[] => {
  if (!questions || questions.length === 0) {
    return []
  }

  return questions.map((question, index) => ({
    id: (index + 1).toString(),
    question: question.trim(),
  }))
}

const AiInterviewPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const jobId = (params?.jobId as string) || searchParams?.get('jobId') || ''
  const nextQuestionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const NEXT_QUESTION_DELAY_MS = 3000

  const { data: jobQuestionsData, isLoading: isLoadingQuestions } = useGetJobInterviewQuestions(jobId)

  const { videoRef, videoEnabled, toggleVideo, cleanup: cleanupVideo } = useVideoStream()

  const {
    currentQuestion,
    questionIndex,
    interviewComplete,
    allTranscripts,
    setCurrentQuestion,
    setQuestionIndex,
    setInterviewComplete,
    addTranscript,
  } = useInterviewState()

  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([])
  const [lastSpokenQuestionId, setLastSpokenQuestionId] = useState<string | null>(null)

  const {
    startRecording,
    stopRecording,
    cleanup: cleanupRecorder,
    status,
    error,
    recordingDuration,
    isRecording
  } = useAudioRecorder({
    chunkDuration: 4000,
    audioBitsPerSecond: 32000,
  })

  const {
    speak,
    stop: stopSpeaking,
    toggleMute,
    cleanup: cleanupTTS,
    isSpeaking,
    isMuted,
    isLoading: isTTSLoading
  } = useTextToSpeech({
    onStart: () => {
      console.log('AI started speaking')
    },
    onEnd: () => {
      console.log('AI finished speaking')
    },
    onError: (error) => {
      console.error('TTS error:', error)
      if (error.name !== 'AbortError') {
        toast.error('Failed to play AI voice. Please check your connection.')
      }
    },
  })

  const { isSubmitting, transcript, submitAnswer } = useAnswerSubmission({
    currentQuestion,
    questionIndex,
    stopRecording,
    jobId: jobId || undefined,
    interviewQuestions,
    onTranscriptReceived: addTranscript,
    onNextQuestion: (question, index) => {
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current)
      }
      nextQuestionTimerRef.current = setTimeout(() => {
        setLastSpokenQuestionId(null)
        setCurrentQuestion(question)
        setQuestionIndex(index)
      }, NEXT_QUESTION_DELAY_MS)
    },
    onInterviewComplete: () => setInterviewComplete(true),
    onAnswerAcknowledged: async ({ transcript, question, nextQuestion, isComplete }) => {
      try {
        const response = await fetch('/api/ai-interview/acknowledge-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question.question,
            answer: transcript,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const acknowledgment = isComplete
            ? `${data.acknowledgement} That wraps up the interview. Thank you for your time.`
            : `${data.acknowledgement} Let me move on to the next question.`

          speak(acknowledgment)
        } else {
          const fallback = isComplete
            ? 'Thank you for your answer. That wraps up the interview. Thank you for your time.'
            : 'Thank you for your answer. Let me move on to the next question.'
          speak(fallback)
        }
      } catch (error) {
        console.error('Error generating acknowledgement:', error)
        const fallback = isComplete
          ? 'Thank you for your answer. That wraps up the interview. Thank you for your time.'
          : 'Thank you for your answer. Let me move on to the next question.'
        speak(fallback)
      }
    },
  })

  useEffect(() => {
    if (jobQuestionsData?.interviewQuestions) {
      const transformed = transformQuestions(jobQuestionsData.interviewQuestions)
      setInterviewQuestions(transformed)

      if (transformed.length > 0 && !currentQuestion) {
        setCurrentQuestion(transformed[0])
        setQuestionIndex(0)
      }
    } else if (jobQuestionsData && (!jobQuestionsData.interviewQuestions || jobQuestionsData.interviewQuestions.length === 0)) {
      setInterviewQuestions([])
      toast.error('No interview questions found for this job. Please add questions first.')
    }
  }, [jobQuestionsData, currentQuestion, setCurrentQuestion, setQuestionIndex])

  useEffect(() => {
    if (!jobId) {
      toast.error('Job ID is required. Please provide a jobId in the URL.')
      return
    }

    return () => {
      cleanupRecorder()
      cleanupTTS()
      cleanupVideo()
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  useEffect(() => {
    if (!currentQuestion || isRecording || isSubmitting || isSpeaking) {
      return
    }

    if (lastSpokenQuestionId === currentQuestion.id) {
      return
    }

    const timer = setTimeout(() => {
      speak(currentQuestion.question)
      setLastSpokenQuestionId(currentQuestion.id)
    }, 500)

    return () => {
      clearTimeout(timer)
      if (isSpeaking) {
        stopSpeaking()
      }
    }
  }, [currentQuestion, isRecording, isSubmitting, isSpeaking, speak, stopSpeaking, lastSpokenQuestionId])

  const handleStartAnswer = async () => {
    if (isSpeaking) {
      stopSpeaking()
    }
    try {
      await startRecording()
      toast.success('Recording started')
    } catch (err) {
      toast.error('Failed to start recording')
    }
  }

  if (interviewComplete) {
    return <InterviewComplete allTranscripts={allTranscripts} />
  }

  if (!jobId) {
    return (
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Inti Interview</h1>
          <p className='text-red-500'>Job ID is required. Please provide a jobId in the URL (e.g., ?jobId=xxx)</p>
        </div>
      </div>
    )
  }

  if (isLoadingQuestions) {
    return (
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Inti Interview</h1>
          <p>Loading interview questions...</p>
        </div>
      </div>
    )
  }

  if (interviewQuestions.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold mb-2'>Inti Interview</h1>
          <p className='text-red-500'>No interview questions found for this job. Please add questions first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2'>Inti Interview</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-4'>
          <AiAvatarSection
            isSpeaking={isSpeaking}
            isTTSLoading={isTTSLoading}
            isMuted={isMuted}
            onMuteToggle={toggleMute}
          />
        </div>

        <div className='space-y-4'>
          <UserVideoSection
            videoRef={videoRef}
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            videoEnabled={videoEnabled}
            error={error}
            onToggleVideo={toggleVideo}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionIndex={questionIndex}
            isSpeaking={isSpeaking}
          />
        )}

        <RecordingControls
          isRecording={isRecording}
          isSubmitting={isSubmitting}
          isSpeaking={isSpeaking}
          status={status}
          currentQuestion={!!currentQuestion}
          onStartAnswer={handleStartAnswer}
          onSubmitAnswer={submitAnswer}
          isTTSLoading={false} />
      </div>

    </div>
  )
}

export default AiInterviewPage
