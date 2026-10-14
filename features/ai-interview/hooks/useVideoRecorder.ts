import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'

interface UseVideoRecorderOptions {
  stream: MediaStream | null
  onRecordingComplete?: (videoBlob: Blob) => void
}

interface UseVideoRecorderReturn {
  startRecording: () => void
  stopRecording: () => Promise<Blob | null>
  getCurrentChunk: () => Blob | null
  resetChunks: () => void
  isRecording: boolean
  recordingDuration: number
  error: string | null
}

export const useVideoRecorder = (
  options: UseVideoRecorderOptions
): UseVideoRecorderReturn => {
  const { stream, onRecordingComplete } = options
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(() => {
    if (!stream) {
      setError('No media stream available')
      return
    }

    try {
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
        'video/mp4',
      ]

      let selectedMimeType = ''
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      if (!selectedMimeType) {
        setError('No supported video recording format found')
        return
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000,
      })

      chunksRef.current = []
      setError(null)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current)
          durationIntervalRef.current = null
        }
        setRecordingDuration(0)

        if (chunksRef.current.length > 0) {
          const videoBlob = new Blob(chunksRef.current, {
            type: selectedMimeType,
          })
          onRecordingComplete?.(videoBlob)
        }
      }

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event)
        setError('Recording error occurred')
        setIsRecording(false)
      }

      mediaRecorder.start(1000)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      const startTime = Date.now()
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

    } catch (err) {
      console.error('Failed to start video recording:', err)
      setError('Failed to start recording')
      setIsRecording(false)
    }
  }, [stream, onRecordingComplete])

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!mediaRecorderRef.current || !isRecording) {
      return null
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current

      if (!mediaRecorder) {
        resolve(null)
        return
      }

      const handleStop = () => {
        if (chunksRef.current.length > 0) {
          const mimeType = mediaRecorder.mimeType || 'video/webm'
          const videoBlob = new Blob(chunksRef.current, { type: mimeType })
          resolve(videoBlob)
        } else {
          resolve(null)
        }
      }

      mediaRecorder.addEventListener('stop', handleStop, { once: true })
      mediaRecorder.stop()
      setIsRecording(false)
    })
  }, [isRecording])

  const getCurrentChunk = useCallback((): Blob | null => {
    if (!mediaRecorderRef.current || chunksRef.current.length === 0) {
      return null
    }

    const mimeType = mediaRecorderRef.current.mimeType || 'video/webm'
    return new Blob(chunksRef.current, { type: mimeType })
  }, [])

  const resetChunks = useCallback(() => {
    chunksRef.current = []
  }, [])

  return {
    startRecording,
    stopRecording,
    getCurrentChunk,
    resetChunks,
    isRecording,
    recordingDuration,
    error,
  }
}
