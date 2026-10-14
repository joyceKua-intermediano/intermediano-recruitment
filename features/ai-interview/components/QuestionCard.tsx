import { Card } from '@/components/ui/card'
import { InterviewQuestion } from '../types/interview'
import { useTranslation } from 'react-i18next'

interface QuestionCardProps {
  question: InterviewQuestion
  questionIndex: number
  isSpeaking: boolean
}

export const QuestionCard = ({
  question,
  questionIndex,
  isSpeaking,
}: QuestionCardProps) => {
  const { t } = useTranslation()
  const questionText = question.question.trim()

  return (
    <Card className='p-6 lg:col-span-2'>
      <div className='flex items-start justify-between mb-4'>
        <h2 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
          <span className='flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm'>
            {questionIndex + 1}
          </span>
          {t('pages.interviewDetail.currentQuestion')}
        </h2>
        {question.timeLimit && (
          <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
            ⏱️ {Math.floor(question.timeLimit / 60)} min
          </span>
        )}
      </div>
      <p className='text-xl text-gray-700 leading-relaxed'>
        {questionText}
      </p>
      {isSpeaking && (
        <div className='mt-4 flex items-center gap-2 text-sm text-blue-600'>
          <div className='flex gap-1'>
            <div className='w-1 h-4 bg-red-500 rounded-full animate-pulse' style={{ animationDelay: '0ms' }} />
            <div className='w-1 h-4 bg-red-500 rounded-full animate-pulse' style={{ animationDelay: '150ms' }} />
            <div className='w-1 h-4 bg-red-500 rounded-full animate-pulse' style={{ animationDelay: '300ms' }} />
          </div>
          <span>{t('pages.interviewDetail.intiSpeaking')}</span>
        </div>
      )}
    </Card>
  )
}
