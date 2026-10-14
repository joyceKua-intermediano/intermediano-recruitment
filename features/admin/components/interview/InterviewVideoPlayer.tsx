'use client'

interface InterviewVideoPlayerProps {
  videoId: string
  className?: string
}

export function InterviewVideoPlayer({ videoId, className = '' }: InterviewVideoPlayerProps) {

  const embedUrl = `https://iframe.videodelivery.net/${videoId}`

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        style={{ aspectRatio: '16/9', minHeight: '300px' }}
      />
    </div>
  )
}
