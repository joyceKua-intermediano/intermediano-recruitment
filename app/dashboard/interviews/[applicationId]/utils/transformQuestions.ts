import { InterviewQuestion } from '@/features/ai-interview/types/interview'

export const transformQuestions = (questions: string[]): InterviewQuestion[] => {
  if (!questions || questions.length === 0) {
    return []
  }

  return questions.map((question, index) => ({
    id: (index + 1).toString(),
    question: question.trim(),
  }))
}
