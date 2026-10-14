import { useRef, useState, useCallback } from 'react'
import { RecordingStatus } from '../types/interview'

interface UseAudioRecorderOptions {
  onDataAvailable?: (blob: Blob) => void
  chunkDuration?: number
  audioBitsPerSecond?: number
}

export const useAudioRecorder = (options: UseAudioRecorderOptions = {}) => {
  const {
    onDataAvailable,
    chunkDuration = 4000,
    audioBitsPerSecond = 32000,
  } = options

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<RecordingStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const initializeRecorder = useCallback(
    (stream: MediaStream) => {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4'

      try {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          audioBitsPerSecond,
        })

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
            onDataAvailable?.(event.data)
          }
        }

        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event)
          setError('Recording error occurred')
          setStatus('error')
        }

        mediaRecorder.onstop = () => {
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current)
            durationIntervalRef.current = null
          }
        }

        mediaRecorderRef.current = mediaRecorder
        streamRef.current = stream

        return mediaRecorder
      } catch (err) {
        console.error('Failed to initialize MediaRecorder:', err)
        setError('Failed to initialize recorder')
        setStatus('error')
        return null
      }
    },
    [audioBitsPerSecond, onDataAvailable]
  )

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      chunksRef.current = []
      setRecordingDuration(0)

      if (streamRef.current && streamRef.current.active) {
        const recorder = mediaRecorderRef.current || initializeRecorder(streamRef.current)
        if (recorder) {
          recorder.start(chunkDuration)
          setStatus('recording')

          durationIntervalRef.current = setInterval(() => {
            setRecordingDuration((prev) => prev + 1)
          }, 1000)
        }
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      const recorder = initializeRecorder(stream)
      if (recorder) {
        recorder.start(chunkDuration)
        setStatus('recording')

        durationIntervalRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1)
        }, 1000)
      }
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to access microphone. Please grant permission.')
      setStatus('error')
    }
  }, [chunkDuration, initializeRecorder])

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current

      if (!recorder || recorder.state === 'inactive') {
        resolve(null)
        return
      }

      recorder.onstop = () => {
        const mimeType = recorder.mimeType
        const blob = new Blob(chunksRef.current, { type: mimeType })
        chunksRef.current = []
        setStatus('idle')

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current)
          durationIntervalRef.current = null
        }

        resolve(blob)
      }

      recorder.stop()
    })
  }, [])

  const pauseRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state === 'recording') {
      recorder.pause()
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }
  }, [])

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state === 'paused') {
      recorder.resume()
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    }
  }, [])

  const cleanup = useCallback(() => {
    const recorder = mediaRecorderRef.current
    const stream = streamRef.current

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    chunksRef.current = []
    mediaRecorderRef.current = null
    streamRef.current = null
    setStatus('idle')
    setRecordingDuration(0)
  }, [])

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cleanup,
    status,
    error,
    recordingDuration,
    isRecording: status === 'recording',
  }
}
