'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAudioRecorder } from '@/features/ai-interview/hooks/useAudioRecorder'
import { useTextToSpeech } from '@/features/ai-interview/hooks/useTextToSpeech'
import { useVideoStream } from '@/features/ai-interview/hooks/useVideoStream'
import { useVideoRecorder } from '@/features/ai-interview/hooks/useVideoRecorder'
import { useAnswerSubmission } from '@/features/ai-interview/hooks/useAnswerSubmission'
import { AiAvatarSection } from '@/features/ai-interview/components/AiAvatarSection'
import { UserVideoSection } from '@/features/ai-interview/components/UserVideoSection'
import { QuestionCard } from '@/features/ai-interview/components/QuestionCard'
import { RecordingControls } from '@/features/ai-interview/components/RecordingControls'
import { InterviewComplete } from '@/features/ai-interview/components/InterviewComplete'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { useGetAppliedJobs } from '@/features/applicant/hooks/useGetAppliedJobs'
import { useGetJobInterviewQuestions } from '@/features/applicant/hooks/useGetJobInterviewQuestions'
import { useGetApplicantInformation } from '@/features/applicant/hooks/useGetApplicantInformation'
import { InterviewQuestion } from '@/features/ai-interview/types/interview'
import { useRef, useCallback } from 'react'
import { transformQuestions } from './utils/transformQuestions'
import { formatName, getFirstName } from './utils/helpers'
import {
  getIntroMessage,
  getResumeIntroMessage,
  getTransitionMessage,
  getCompletionSuffix,
  getAcknowledgementFallback,
} from '@/features/ai-interview/utils/languagePrompts'
import { parseIntiLanguage } from '@/features/ai-interview/types/language'
import { useTranslation } from 'react-i18next'

export default function InterviewDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const applicationId = params?.applicationId as string
  const { data: appliedJobsData, isLoading: isLoadingAppliedJobs } = useGetAppliedJobs()
  const { data: applicantInfo } = useGetApplicantInformation()

  const applicantFirstName = applicantInfo?.name
    ? getFirstName(applicantInfo.name)
    : ''

  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [allTranscripts, setAllTranscripts] = useState<string[]>([])
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [isSavingConsent, setIsSavingConsent] = useState(false)
  const [isInterviewDone, setIsInterviewDone] = useState(false)
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([])
  const [lastSpokenQuestionId, setLastSpokenQuestionId] = useState<string | null>(null)
  const [lastSpokenQuestionText, setLastSpokenQuestionText] = useState<string | null>(null)
  const [introFinished, setIntroFinished] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [isResumingInterview, setIsResumingInterview] = useState(false)
  const introPlayingRef = useRef(false)
  const nextQuestionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const needsClarificationRef = useRef(false)
  const NEXT_QUESTION_DELAY_MS = 3000

  const application = appliedJobsData?.applications?.find(
    (app) => app.id === applicationId
  )

  const jobId = application?.job.id

  const { data: jobQuestionsData, isLoading: isLoadingQuestions } = useGetJobInterviewQuestions(jobId)

  const intiLanguage = parseIntiLanguage(jobQuestionsData?.intiLanguage)

  const { videoRef, videoEnabled, toggleVideo, stream: videoStream, cleanup: cleanupVideo } = useVideoStream({
    enabled: interviewStarted
  })

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
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
    getCurrentChunk,
    resetChunks,
    isRecording: isVideoRecording,
    error: videoError,
  } = useVideoRecorder({
    stream: videoStream,
  })

  const {
    speak,
    speakAndWait,
    stop: stopSpeaking,
    toggleMute,
    cleanup: cleanupTTS,
    isSpeaking,
    isMuted,
    isLoading: isTTSLoading
  } = useTextToSpeech({
    onStart: () => {
    },
    onEnd: () => {
      if (introPlayingRef.current) {
        introPlayingRef.current = false
        setIntroFinished(true)
      }
    },
    onError: (error) => {
      if (error.name !== 'AbortError') {
        toast.error(t('pages.interviewDetail.toastPlayAiVoiceFailed'))
      }
    },
  })

  const { isSubmitting, transcript, submitAnswer } = useAnswerSubmission({
    currentQuestion,
    questionIndex,
    stopRecording,
    getCurrentVideoChunk: getCurrentChunk,
    stopVideoRecording: stopVideoRecording,
    jobId: jobId,
    applicationId: applicationId,
    interviewQuestions,
    useMultimodalSession: true,
    allTranscripts: allTranscripts,
    applicantName: applicantFirstName,
    onAnswerSubmitted: () => {
      speak(t('pages.interviewDetail.answerReceived'))
    },
    onTranscriptReceived: (transcript) => {
      setAllTranscripts(prev => [...prev, transcript])
    },
    onNextQuestion: (question, index) => {
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current)
      }

      if (isVideoRecording && questionIndex >= 0 && !interviewComplete) {
        resetChunks()
      }

      if (needsClarificationRef.current && question) {
        setCurrentQuestion(question)
        setQuestionIndex(index)
        setLastSpokenQuestionId(question.id)
        setLastSpokenQuestionText(question.question)
        needsClarificationRef.current = false
        return
      }

      nextQuestionTimerRef.current = setTimeout(() => {
        setLastSpokenQuestionId(null)
        setLastSpokenQuestionText(null)
        setCurrentQuestion(question)
        setQuestionIndex(index)
      }, NEXT_QUESTION_DELAY_MS)
    },
    onInterviewComplete: async () => {
      setInterviewComplete(true)

      if (isVideoRecording) {
         stopVideoRecording()
      }

      try {
        const response = await fetch('/api/ai-interview/complete-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicationId: applicationId,
          }),
        })
        if (!response.ok) {
          console.error('Failed to complete interview session')
        }
      } catch (error) {
        console.error('Error completing interview session:', error)
      }
    },
    onAnswerAcknowledged: async ({ transcript, acknowledgement, question, nextQuestion, isComplete, isFollowUp, needsClarification }) => {
      if (needsClarification && nextQuestion) {
        setLastSpokenQuestionId(nextQuestion.id)
        needsClarificationRef.current = true
      }

      if (acknowledgement) {
        const finalAcknowledgment = acknowledgement

        await speakAndWait(finalAcknowledgment)

        if (!isComplete && !isFollowUp && nextQuestion) {
          const transitionMessage = getTransitionMessage(intiLanguage, applicantFirstName || null)
          await speakAndWait(transitionMessage)
        }
      } else {
        try {
          const response = await fetch('/api/ai-interview/acknowledge-answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question: question.question,
              answer: transcript,
              language: intiLanguage,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            const completionMsg = getCompletionSuffix(intiLanguage, isComplete)
            const acknowledgment = `${data.acknowledgement}${completionMsg}`

            await speakAndWait(acknowledgment)

            if (!isComplete && nextQuestion) {
              const transitionMessage = getTransitionMessage(intiLanguage, applicantFirstName || null)
              await speakAndWait(transitionMessage)
            }
          } else {
            await speakAndWait(getAcknowledgementFallback(intiLanguage, isComplete))

            if (!isComplete && nextQuestion) {
              const transitionMessage = getTransitionMessage(intiLanguage, applicantFirstName || null)
              await speakAndWait(transitionMessage)
            }
          }
        } catch (error) {
          await speakAndWait(getAcknowledgementFallback(intiLanguage, isComplete))

          if (!isComplete && nextQuestion) {
            const transitionMessage = getTransitionMessage(intiLanguage, applicantFirstName || null)
            await speakAndWait(transitionMessage)
          }
        }
      }

      const isLastQuestion =
        isComplete ||
        (!nextQuestion && questionIndex >= (interviewQuestions.length - 1))
      if (isLastQuestion) {
        setIsInterviewDone(true)
      }

    },

  })

  const checkAndResumeSession = useCallback(async () => {
    if (!applicationId || isLoadingAppliedJobs) return

    try {
      setIsResuming(true)
      const response = await fetch(`/api/ai-interview/session/${applicationId}`)

      if (!response.ok) {
        setIsResuming(false)
        return
      }

      const data = await response.json()

      if (data.exists && data.session) {
        const { session, responses, interviewQuestions: savedQuestions, resumePoint, allTranscripts: savedTranscripts } = data

        setIsResumingInterview(true)

        if (savedTranscripts && savedTranscripts.length > 0) {
          setAllTranscripts(savedTranscripts)
        }

        if (savedQuestions && savedQuestions.length > 0) {
          const transformed = transformQuestions(savedQuestions)
          setInterviewQuestions(transformed)

          if (resumePoint && !resumePoint.isComplete && transformed.length > 0) {
            const resumeIndex = resumePoint.questionIndex
            if (resumeIndex < transformed.length) {
            setQuestionIndex(resumeIndex)
            setCurrentQuestion(transformed[resumeIndex])
            }
          } else if (resumePoint?.isComplete) {
            setInterviewComplete(true)
            setIsInterviewDone(true)
          }
        }

        setPrivacyAccepted(true)
        setInterviewStarted(true)

        setIntroFinished(false)

        toast.success(t('pages.interviewDetail.toastSessionResumed'))
      }
    } catch (error) {
      console.error('Error checking for existing session:', error)
    } finally {
      setIsResuming(false)
    }
  }, [applicationId, isLoadingAppliedJobs])

  useEffect(() => {
    checkAndResumeSession()
  }, [checkAndResumeSession])

  useEffect(() => {
    if (jobQuestionsData?.interviewQuestions && !needsClarificationRef.current) {
      const transformed = transformQuestions(jobQuestionsData.interviewQuestions)
      setInterviewQuestions(transformed)
    } else if (jobQuestionsData && (!jobQuestionsData.interviewQuestions || jobQuestionsData.interviewQuestions.length === 0)) {
      setInterviewQuestions([])
    }
  }, [jobQuestionsData])

  useEffect(() => {
    return () => {
      cleanupRecorder()
      cleanupTTS()
      cleanupVideo()
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isResumingInterview || !interviewStarted || introFinished || isSpeaking || !application || !currentQuestion) {
      return
    }

    const applicantName = applicantFirstName || 'there'
    const jobTitle = application.job.title
    const resumeIntroText = getResumeIntroMessage(intiLanguage, applicantName, jobTitle)

    if (!introPlayingRef.current) {
      introPlayingRef.current = true
      speakAndWait(resumeIntroText)
        .then(() => {
          introPlayingRef.current = false
          setIntroFinished(true)
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Error playing resume intro:', error)
          }
          introPlayingRef.current = false
          setIntroFinished(true)
        })
    }

    return () => {
      if (isSpeaking) {
        stopSpeaking()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResumingInterview, interviewStarted, introFinished, application, currentQuestion, applicantFirstName])

  useEffect(() => {
    if (!interviewStarted || !currentQuestion || isRecording || isSubmitting || isSpeaking) {
      return
    }

    if (!introFinished) {
      return
    }

    if (lastSpokenQuestionId === currentQuestion.id && lastSpokenQuestionText === currentQuestion.question) {
      return
    }

    if (needsClarificationRef.current) {
      return
    }

    const timer = setTimeout(() => {
      speak(currentQuestion.question)
      setLastSpokenQuestionId(currentQuestion.id)
      setLastSpokenQuestionText(currentQuestion.question)
    }, 500)

    return () => {
      clearTimeout(timer)
      if (isSpeaking) {
        stopSpeaking()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id, currentQuestion?.question, questionIndex, isRecording, isSubmitting, interviewStarted, isSpeaking, lastSpokenQuestionId, lastSpokenQuestionText, introFinished])

  if (isLoadingAppliedJobs || !appliedJobsData || isResuming) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-white dark:bg-neutral-900 min-h-screen'>
        <div className='max-w-4xl mx-auto text-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4 border-primary'></div>
          <p className='text-muted-foreground'>
            {isResuming
              ? t('pages.interviewDetail.resumingInterview')
              : t('pages.interviewDetail.loadingInterviewData')}
          </p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-white dark:bg-neutral-900 min-h-screen'>
        <div className='max-w-4xl mx-auto text-center py-12'>
          <p className='text-muted-foreground'>{t('pages.interviewDetail.applicationNotFound')}</p>
          <Link href='/dashboard/interviews' className='mt-4 inline-block'>
            <Button variant='outline' className='border-border text-foreground'>
              {t('pages.interviewDetail.backToInterviews')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStartInterview = async () => {
    if (!privacyAccepted) {
      toast.error(t('pages.interviewDetail.toastAcceptPrivacy'))
      return
    }

    if (!applicationId) {
      toast.error(t('pages.interviewDetail.toastApplicationIdMissing'))
      return
    }

    if (!application?.job.id) {
      toast.error(t('pages.interviewDetail.toastApplicationDataMissing'))
      return
    }

    try {
      setIsSavingConsent(true)

      const response = await fetch('/api/applicant/interview-privacy-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: applicationId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || t('pages.interviewDetail.toastSavePrivacyFailed')
        )
      }

      if (!jobQuestionsData?.interviewQuestions || jobQuestionsData.interviewQuestions.length === 0) {
        toast.error(t('pages.interviewDetail.toastQuestionsNotSet'))
        return
      }

      const questionsToUse = transformQuestions(jobQuestionsData.interviewQuestions)

      if (questionsToUse.length === 0) {
        toast.error(t('pages.interviewDetail.toastQuestionsNotSet'))
        return
      }

      setInterviewQuestions(questionsToUse)

      const applicantName = applicantFirstName || 'there'
      const introText = getIntroMessage(intiLanguage, applicantName, application?.job.title || '')
      introPlayingRef.current = true
      setIntroFinished(false)
      speak(introText).catch((e) => {
        introPlayingRef.current = false
        setIntroFinished(true)
      })

      setInterviewStarted(true)
      setCurrentQuestion(questionsToUse[0])
      setQuestionIndex(0)
      toast.success(t('pages.interviewDetail.toastInterviewStarted'))
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('pages.interviewDetail.toastSavePrivacyRetry')
      )
    } finally {
      setIsSavingConsent(false)
    }
  }

  const handleStartAnswer = async () => {
    if (isSpeaking) {
      stopSpeaking()
    }
    try {
      if (videoStream && !isVideoRecording) {
        startVideoRecording()
      }
      await startRecording()
      toast.success(t('pages.interviewDetail.toastRecordingStarted'))
    } catch (err) {
      toast.error(t('pages.interviewDetail.toastRecordingFailed'))
    }
  }

  if (!privacyAccepted || !interviewStarted) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-white dark:bg-neutral-900 min-h-screen'>
        <div className='max-w-3xl mx-auto'>
          <div className='mb-6'>
            <Link href='/dashboard/interviews'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2 mb-4 border-border text-foreground'
              >
                <ArrowLeft className='w-4 h-4' />
                {t('pages.interviewDetail.backToInterviews')}
              </Button>
            </Link>
          </div>

          <Card className='shadow-sm bg-card border-border'>
            <CardContent className='p-6'>
              <div className='mb-6'>
                <div className='flex items-center gap-3 mb-3'>
                  <h1 className='text-2xl font-medium text-foreground'>
                    {application?.job.title}                  </h1>
                </div>
                <p className='text-sm text-muted-foreground'>

                </p>
              </div>

              <div className='flex items-start gap-3 mb-6'>
                <Shield className='w-5 h-5 mt-0.5 text-primary' />
                <div className='flex-1'>
                  <h3 className='font-medium mb-2 text-sm text-foreground'>
                    {t('pages.interviewDetail.dataPrivacyNoticeTitle')}
                  </h3>
                  <p className='text-sm mb-2 text-muted-foreground'>
                    {t('pages.interviewDetail.dataPrivacyNoticeDescription')}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {t('pages.interviewDetail.dataPrivacyNoticeFooter')}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-2.5 mb-5'>
                <input
                  type='checkbox'
                  id='privacy-consent'
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className='w-4 h-4 mt-0.5 rounded border-border accent-primary'
                />
                <label htmlFor='privacy-consent' className='text-sm cursor-pointer leading-relaxed text-foreground'>
                  {t('pages.interviewDetail.privacyConsentLabel')}
                </label>
              </div>

              <div className='flex gap-3'>
                <Button
                  onClick={handleStartInterview}
                  disabled={
                    !privacyAccepted ||
                    isSavingConsent ||
                    isLoadingQuestions ||
                    !jobQuestionsData?.interviewQuestions ||
                    (jobQuestionsData?.interviewQuestions?.length ?? 0) === 0
                  }
                  className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground'
                >
                  {isSavingConsent
                    ? t('pages.interviewDetail.saving')
                    : isLoadingQuestions
                      ? t('pages.interviewDetail.loadingQuestions')
                      : !jobQuestionsData?.interviewQuestions || (jobQuestionsData?.interviewQuestions?.length ?? 0) === 0
                        ? t('pages.interviewDetail.questionsNotSet')
                        : t('pages.interviewDetail.startInterview')
                  }
                </Button>
                <Link href='/dashboard/interviews' className='flex-1'>
                  <Button
                    variant='outline'
                    className='w-full border-border text-foreground'
                  >
                    {t('common.cancel')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (interviewComplete && !isSpeaking && isInterviewDone) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-white dark:bg-neutral-900 min-h-screen'>
        <div className='max-w-4xl mx-auto'>
          <InterviewComplete allTranscripts={allTranscripts} />
          <div className='mt-6 text-center'>
            <Button
              variant='outline'
              size='sm'
              className='border-border text-foreground'
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['appliedJobs'] })
                router.push('/dashboard')
              }}
            >
              {t('pages.interviewDetail.backToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!interviewStarted || !currentQuestion) {
    return (
      <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-white dark:bg-neutral-900 min-h-screen'>
        <div className='max-w-4xl mx-auto text-center py-12'>
          <p className='text-muted-foreground'>{t('pages.interviewDetail.preparing')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full px-4 sm:px-10 pb-10 sm:py-8 bg-background dark:bg-neutral-900 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6'>
          <Link href='/dashboard/interviews'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2 mb-4 border-border text-foreground'
            >
              <ArrowLeft className='w-4 h-4' />
              {t('pages.interviewDetail.backToInterviews')}
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-medium mb-1 text-foreground'>
              {t('pages.interviewDetail.title')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {application?.job.title} • {application?.job.location}
            </p>
          </div>
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
            isTTSLoading={isTTSLoading}
            onStartAnswer={handleStartAnswer}
            onSubmitAnswer={submitAnswer}
          />
        </div>
      </div>
    </div>
  )
}
