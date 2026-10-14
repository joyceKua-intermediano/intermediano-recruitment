import { useCallback, useRef, useState } from 'react'

interface UseTextToSpeechOptions {
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: Error) => void
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const { onStart, onEnd, onError } = options

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const speak = useCallback(async (text: string) => {
    if (!text) return

    try {
      setIsLoading(true)

      const response = await fetch('/api/ai-interview/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate speech')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current
      audio.src = audioUrl
      audio.muted = isMuted

      audio.onplay = () => {
        setIsSpeaking(true)
        setIsLoading(false)
        onStart?.()
      }

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(audioUrl)
        onEnd?.()
      }

      audio.onerror = () => {
        setIsSpeaking(false)
        setIsLoading(false)
        URL.revokeObjectURL(audioUrl)
        const error = new Error('Audio playback error')
        onError?.(error)
      }

      try {
        await audio.play()
      } catch (playError) {
        if (playError instanceof Error && playError.name === 'AbortError') {
          console.debug('Audio play was aborted (this is normal if user clicked quickly)')
        } else {
          throw playError
        }
      }

    } catch (error) {
      console.error('TTS error:', error)
      setIsSpeaking(false)
      setIsLoading(false)
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src)
      }
      onError?.(error instanceof Error ? error : new Error('Unknown error'))
    }
  }, [isMuted, onStart, onEnd, onError])

  const speakAndWait = useCallback(async (text: string): Promise<void> => {
    if (!text) return

    await speak(text)

    return new Promise<void>((resolve, reject) => {
      const checkAudio = () => {
        if (audioRef.current) {
          const audio = audioRef.current

          if (audio.ended) {
            resolve()
            return
          }

          // Set up one-time listeners (won't interfere with existing onended handler)
          const handleEnd = () => {
            resolve()
            audio.removeEventListener('ended', handleEnd)
            audio.removeEventListener('error', handleError)
          }

          const handleError = () => {
            reject(new Error('Audio playback error'))
            audio.removeEventListener('ended', handleEnd)
            audio.removeEventListener('error', handleError)
          }

          audio.addEventListener('ended', handleEnd, { once: true })
          audio.addEventListener('error', handleError, { once: true })
        } else {
          setTimeout(checkAudio, 50)
        }
      }

      checkAudio()
    })
  }, [speak])

  const stop = useCallback(() => {
    if (audioRef.current) {
      try {
        if (!audioRef.current.paused) {
          audioRef.current.pause()
        }
        audioRef.current.currentTime = 0
        setIsSpeaking(false)
      } catch (err) {
        console.debug('Stop audio error (safe to ignore):', err)
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev
      if (audioRef.current) {
        audioRef.current.muted = newMuted
      }
      return newMuted
    })
  }, [])

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      try {
        if (!audioRef.current.paused) {
          audioRef.current.pause()
        }
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src)
        }
        audioRef.current.src = ''
        audioRef.current = null
      } catch (err) {
        console.debug('Cleanup error (safe to ignore):', err)
      }
    }
    setIsSpeaking(false)
    setIsLoading(false)
  }, [])

  return {
    speak,
    speakAndWait,
    stop,
    toggleMute,
    cleanup,
    isSpeaking,
    isMuted,
    isLoading,
  }
}
