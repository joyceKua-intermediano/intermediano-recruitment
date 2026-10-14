import { RefObject } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Video, VideoOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserVideoSectionProps {
  videoRef: RefObject<HTMLVideoElement | null>
  isRecording: boolean
  recordingDuration: number
  videoEnabled: boolean
  error: string | null
  onToggleVideo: () => void
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const UserVideoSection = ({
  videoRef,
  isRecording,
  recordingDuration,
  videoEnabled,
  error,
  onToggleVideo,
}: UserVideoSectionProps) => {
  const { t } = useTranslation()
  return (
    <Card className='p-4'>
      <h3 className='font-semibold mb-3 flex items-center gap-2'>
        {isRecording && <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />}
        {t('pages.interviewDetail.yourVideo')}
      </h3>
      <div className='relative'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='rounded-lg shadow-md w-full aspect-video bg-gray-900'
        />

        {isRecording && (
          <div className='absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full animate-pulse'>
            <div className='w-2 h-2 bg-white rounded-full' />
            <span className='text-sm font-medium'>{t('pages.interviewDetail.recording')}</span>
          </div>
        )}

        {isRecording && (
          <div className='absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg'>
            <span className='text-sm font-mono'>{formatDuration(recordingDuration)}</span>
          </div>
        )}
      </div>

      <div className='flex gap-2 mt-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={onToggleVideo}
          className='flex items-center gap-2'
        >
          {videoEnabled ? (
            <>
              <Video className='w-4 h-4' />
              {t('pages.interviewDetail.videoOn')}
            </>
          ) : (
            <>
              <VideoOff className='w-4 h-4' />
              {t('pages.interviewDetail.videoOff')}
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}
    </Card>
  )
}

