export interface InterviewQuestion {
  id: string
  question: string
  timeLimit?: number // seconds
}

export interface InterviewAnswer {
  questionId: string
  audioBlob: Blob
  transcript?: string
  timestamp: Date
}

export interface InterviewState {
  currentQuestion: InterviewQuestion | null
  questionIndex: number
  answers: InterviewAnswer[]
  isRecording: boolean
  isProcessing: boolean
  transcript: string
}

export interface TranscriptionResponse {
  transcript: string
  nextQuestion: InterviewQuestion | null
  analysis?: {
    score: number
    feedback: string
  }
  isComplete: boolean
}

export interface MultimodalSessionResponse {
  transcript: string
  acknowledgement: string
  nextQuestion: InterviewQuestion | null
  isComplete: boolean
  isFollowUp: boolean
  needsClarification?: boolean
  retryCount?: number
  conversationHistory: number
}
export type RecordingStatus = 'idle' | 'recording' | 'processing' | 'error'
export interface InterviewQuestionsProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  jobId: string
  jobTitle: string
}
