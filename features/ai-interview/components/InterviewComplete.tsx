import { Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

interface InterviewCompleteProps {
  allTranscripts: string[]
}

export const InterviewComplete = ({ allTranscripts }: InterviewCompleteProps) => {
  const { t } = useTranslation()
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <Card className='p-8 text-center'>
        <h1 className='text-3xl font-bold mb-4'>{t('pages.interviewDetail.interviewCompleteTitle')}</h1>
        <p className='text-gray-600 mb-6'>
          {t('pages.interviewDetail.interviewCompleteDescription')}
        </p>
        <div className='text-left max-w-2xl mx-auto'>
          <h2 className='text-xl font-semibold mb-3'>{t('pages.interviewDetail.yourAnswers')}</h2>
          {allTranscripts.map((transcript, index) => (
            <div key={index} className='mb-4 p-4 bg-gray-50 rounded-lg'>
              <p className='font-medium mb-2'>{t('pages.interviewDetail.questionNumber', { number: index + 1 })}</p>
              <p className='text-gray-700'>{transcript}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

