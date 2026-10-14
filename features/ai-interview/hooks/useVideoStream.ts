import { useEffect, useState, useRef, RefObject } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

interface UseVideoStreamOptions {
  enabled?: boolean
}

interface UseVideoStreamReturn {
  videoRef: RefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  videoEnabled: boolean
  toggleVideo: () => void
  cleanup: () => void
}

export const useVideoStream = (options: UseVideoStreamOptions = {}): UseVideoStreamReturn => {
  const { t } = useTranslation()
  const { enabled = true } = options
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)

  useEffect(() => {
    if (!enabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
        setStream(null)
      }
      return
    }

    let mounted = true
    let localStream: MediaStream | null = null

    const setupVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop())
          return
        }

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        streamRef.current = mediaStream
        setStream(mediaStream)
        localStream = mediaStream
      } catch (err) {
        console.error('Error accessing camera or microphone:', err)
        toast.error(t('pages.interviewDetail.toastCameraPermissionFailed'))
      }
    }

    setupVideo()

    return () => {
      mounted = false
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        setStream(null)
      }
    }
  }, [enabled])

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }

  return {
    videoRef,
    stream,
    videoEnabled,
    toggleVideo,
    cleanup,
  }
}
