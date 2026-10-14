import { Card } from '@/components/ui/card'

interface TranscriptCardProps {
  transcript: string
}

export const TranscriptCard = ({ transcript }: TranscriptCardProps) => {
  if (!transcript) return null

  return (
    <Card className='p-6 mt-6'>
      <h3 className='font-semibold mb-3 flex items-center gap-2'>
        <span className='text-green-600'>✓</span>
        Your Answer Transcript:
      </h3>
      <div className='p-4 bg-gray-50 rounded-lg max-h-48 overflow-y-auto border border-gray-200'>
        <p className='text-gray-700 leading-relaxed'>{transcript}</p>
      </div>
    </Card>
  )
}

