'use client'
import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface AiAvatarProps {
  isSpeaking: boolean
  isMuted: boolean
  onMuteToggle: () => void
}

export const AiAvatar = ({ isSpeaking, isMuted, onMuteToggle }: AiAvatarProps) => {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const newSrc = isSpeaking ? '/videos/inti-lipsync.mp4' : '/videos/inti-listening.mp4'

      if (video.src !== window.location.origin + newSrc) {
        video.src = newSrc
        video.load()
        video.play().catch(err => {
          console.error('Error playing video:', err)
        })
      }
    }
  }, [isSpeaking])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Error auto-playing video:', err)
      })
    }
  }, [])

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        loop
        muted
        playsInline
        autoPlay
        onLoadedData={handleVideoLoaded}
        src={isSpeaking ? '/videos/inti-lipsync.mp4' : '/videos/inti-listening.mp4'}
      >
        <source
          src={isSpeaking ? '/videos/inti-lipsync.mp4' : '/videos/inti-listening.mp4'}
          type="video/mp4"
        />
        {t('pages.interviewDetail.browserNoVideo')}
      </video>

      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 via-red-600 to-red-700">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white text-sm font-medium">{t('pages.interviewDetail.loadingInti')}</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="secondary"
          size="sm"
          onClick={onMuteToggle}
          className="rounded-full w-10 h-10 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/30"
          title={isMuted ? t('pages.interviewDetail.unmuteAiVoice') : t('pages.interviewDetail.muteAiVoice')}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          <p className="text-white font-semibold text-sm">{t('pages.interviewDetail.intiInterviewer')}</p>
        </div>
      </div>

      {isSpeaking && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 bg-green-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="text-white text-xs font-medium">{t('pages.interviewDetail.speaking')}</span>
          </div>
        </div>
      )}

      {!isSpeaking && (
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center gap-2 bg-blue-500/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">{t('pages.interviewDetail.listening')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
