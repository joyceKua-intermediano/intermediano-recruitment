import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface RecordingControlsProps {
  isRecording: boolean
  isSubmitting: boolean
  isSpeaking: boolean
  status: string
  currentQuestion: boolean
  isTTSLoading: boolean
  onStartAnswer: () => void
  onSubmitAnswer: () => void
}

export const RecordingControls = ({
  isRecording,
  isSubmitting,
  isSpeaking,
  status,
  currentQuestion,
  isTTSLoading,
  onStartAnswer,
  onSubmitAnswer,
}: RecordingControlsProps) => {
  const { t } = useTranslation()
  return (
    <Card className='p-6'>
      <h3 className='font-semibold mb-4'>{t('pages.interviewDetail.recordingControls')}</h3>
      <div className='flex flex-col gap-3'>
        {!isRecording && !isSubmitting && (
          <Button
            onClick={onStartAnswer}
            size='lg'
            className='w-full flex items-center justify-center gap-2'
            disabled={!currentQuestion || isSpeaking || isTTSLoading}
          >
            <Mic className='w-5 h-5' />
            {t('pages.interviewDetail.startAnswer')}
          </Button>
        )}

        {isRecording && (
          <Button
            onClick={onSubmitAnswer}
            size='lg'
            variant='destructive'
            className='w-full flex items-center justify-center gap-2'
          >
            <MicOff className='w-5 h-5' />
            {t('pages.interviewDetail.stopAndSubmitAnswer')}
          </Button>
        )}

        {isSubmitting && (
          <Button
            size='lg'
            disabled
            className='w-full flex items-center justify-center gap-2'
          >
            <Loader2 className='w-5 h-5 animate-spin' />
            {t('pages.interviewDetail.processing')}
          </Button>
        )}
      </div>

      <div className='mt-4 text-center space-y-2'>
        <p className='text-sm text-gray-600'>
          {t('pages.interviewDetail.status')}: <span className='font-medium capitalize'>{status}</span>
        </p>
        {isSpeaking && (
          <p className='text-xs text-blue-600 italic'>
            {t('pages.interviewDetail.waitForInti')}
          </p>
        )}
      </div>
    </Card>
  )
}
