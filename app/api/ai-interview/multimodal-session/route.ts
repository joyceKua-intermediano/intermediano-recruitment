import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import OpenAI from 'openai'
import fs from 'fs'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'
import {
  getSystemPrompt,
  getValidationPrompt,
  getClarificationMessage,
  getCompletionMessage,
  getAcknowledgementPromptForSession,
  getDefaultSessionAcknowledgement,
  whisperLanguageCode,
} from '@/features/ai-interview/utils/languagePrompts'
import { parseIntiLanguage, type IntiLanguage } from '@/features/ai-interview/types/language'

interface InterviewQuestion {
  id: string
  question: string
  timeLimit?: number
}

interface ConversationMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type QuestionRetryState = {
  retries: number
}

const conversationSessions = new Map<string, ConversationMessage[]>()
const sessionTimestamps = new Map<string, number>()
const questionRetryMap = new Map<string, QuestionRetryState>()
const interviewQuestionsCache = new Map<string, { questions: InterviewQuestion[], language: IntiLanguage, timestamp: number }>()
const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const MAX_SESSIONS = 1000
const MAX_RETRIES_PER_QUESTION = 2
const QUESTIONS_CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache

function cleanupOldSessions() {
  const now = Date.now()

  for (const [sessionId, timestamp] of sessionTimestamps.entries()) {
    if (now - timestamp > SESSION_TIMEOUT_MS) {
      conversationSessions.delete(sessionId)
      sessionTimestamps.delete(sessionId)
      for (const [retryKey] of questionRetryMap.entries()) {
        if (retryKey.startsWith(`${sessionId}:`)) {
          questionRetryMap.delete(retryKey)
        }
      }
    }
  }

  if (conversationSessions.size > MAX_SESSIONS) {
    const sortedSessions = Array.from(sessionTimestamps.entries())
      .sort((a, b) => a[1] - b[1])

    const toDelete = conversationSessions.size - MAX_SESSIONS
    for (let i = 0; i < toDelete; i++) {
      const [sessionId] = sortedSessions[i]
      conversationSessions.delete(sessionId)
      sessionTimestamps.delete(sessionId)
      for (const [retryKey] of questionRetryMap.entries()) {
        if (retryKey.startsWith(`${sessionId}:`)) {
          questionRetryMap.delete(retryKey)
        }
      }
    }
  }
}

setInterval(cleanupOldSessions, 10 * 60 * 1000)

function transformQuestions(questions: string[]): InterviewQuestion[] {
  if (!questions || questions.length === 0) {
    return []
  }

  return questions.map((question, index) => ({
    id: (index + 1).toString(),
    question: question.trim(),
  }))
}

async function getJobInterviewQuestions(jobId: string): Promise<{ questions: InterviewQuestion[], language: IntiLanguage }> {
  try {
    const cached = interviewQuestionsCache.get(jobId)
    const now = Date.now()
    if (cached && (now - cached.timestamp) < QUESTIONS_CACHE_TTL) {
      return { questions: cached.questions, language: cached.language }
    }

    const jobQuestions = await prisma.jobInterviewQuestions.findUnique({
      where: { jobId },
    })

    if (jobQuestions && jobQuestions.interviewQuestions.length > 0) {
      const questions = transformQuestions(jobQuestions.interviewQuestions)
      const language = parseIntiLanguage(jobQuestions.intiLanguage)
      interviewQuestionsCache.set(jobId, { questions, language, timestamp: now })
      return { questions, language }
    }

    return { questions: [], language: 'en' }
  } catch (error) {
    console.error('Error fetching job interview questions:', error)
    return { questions: [], language: 'en' }
  }
}

async function transcribeAudio(filePath: string, language: IntiLanguage = 'en'): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error('OPENAI_API_KEY not configured')
    return null
  }

  const langCode = whisperLanguageCode(language)

  try {
    const openai = new OpenAI({ apiKey })

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'gpt-4o-transcribe',
      language: langCode,
      response_format: 'json',
    })
    return transcription.text

  } catch (error) {
    console.error('Error transcribing audio:', error)

    if (error instanceof Error && error.message.includes('model')) {
      try {
        const openai = new OpenAI({ apiKey })
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(filePath),
          model: 'whisper-1',
          language: langCode,
          response_format: 'json',
        })
        return transcription.text
      } catch (fallbackError) {
        console.error('Fallback transcription error:', fallbackError)
        return null
      }
    }

    return null
  }
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null

  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const sessionId = formData.get('sessionId') as string
    const applicationId = formData.get('applicationId') as string | null

    const questionId = formData.get('questionId') as string
    const questionIndexStr = formData.get('questionIndex') as string
    const question = formData.get('question') as string
    const jobId = formData.get('jobId') as string | null
    const rawApplicantName = formData.get('applicantName') as string | null

    const formatName = (name: string | null): string | null => {
      if (!name) return null
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    }

    const applicantName = formatName(rawApplicantName)

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 200) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      )
    }

    const audioSize = audioFile.size
    const MAX_AUDIO_SIZE = 10 * 1024 * 1024
    if (audioSize > MAX_AUDIO_SIZE) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const questionIndex = parseInt(questionIndexStr)
    if (isNaN(questionIndex) || questionIndex < 0) {
      return NextResponse.json(
        { error: 'Invalid question index' },
        { status: 400 }
      )
    }

    const [interviewQuestionsResult, audioBuffer] = await Promise.all([
      jobId
        ? getJobInterviewQuestions(jobId)
        : Promise.resolve<{ questions: InterviewQuestion[]; language: IntiLanguage }>({
            questions: [],
            language: 'en',
          }),
      audioFile.arrayBuffer().then(bytes => Buffer.from(bytes))
    ])

    const interviewQuestions: InterviewQuestion[] = interviewQuestionsResult.questions
    const intiLanguage = parseIntiLanguage(interviewQuestionsResult.language)

    if (interviewQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No interview questions found for this job. Please contact the administrator.' },
        { status: 400 }
      )
    }

    const tempFileName = `interview-${Date.now()}.webm`
    tempFilePath = join(tmpdir(), tempFileName)
    await writeFile(tempFilePath, audioBuffer)

    const nextQuestionIndex = questionIndex + 1
    const nextQuestion = nextQuestionIndex < interviewQuestions.length
      ? interviewQuestions[nextQuestionIndex]
      : null
    const isLastQuestion = nextQuestion === null

    let conversationHistory = conversationSessions.get(sessionId) || []
    const isFirstMessage = conversationHistory.length === 0

    const [transcript, jobInfo] = await Promise.all([
      transcribeAudio(tempFilePath, intiLanguage),
      jobId && isFirstMessage
        ? prisma.job.findUnique({
            where: { id: jobId },
            select: { title: true, description: true, location: true }
          })
        : Promise.resolve(null)
    ])

    if (!transcript) {
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: 500 }
      )
    }

    const MAX_HISTORY_MESSAGES = 20
    if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
      const systemMessage = conversationHistory[0]
      const recentMessages = conversationHistory.slice(-(MAX_HISTORY_MESSAGES - 1))
      conversationHistory = [systemMessage, ...recentMessages]
    }

    sessionTimestamps.set(sessionId, Date.now())

    if (isFirstMessage) {
      conversationHistory = [
        {
          role: 'system',
          content: getSystemPrompt(intiLanguage, applicantName || undefined, jobInfo || undefined) + `\n\nInterview Questions Available:\n${interviewQuestions.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n')}`
        }
      ]
    }

    const truncatedTranscript = transcript.length > 2000
      ? transcript.substring(0, 2000) + '...'
      : transcript

    const originalQuestionData = interviewQuestions.find(q => q.id === questionId)

    if (!originalQuestionData) {
      return NextResponse.json(
        { error: `Question with ID ${questionId} not found in interview questions` },
        { status: 400 }
      )
    }

    const originalQuestion = originalQuestionData.question
    const originalQuestionId = questionId

    const saveResponseToDB = async (
      transcriptText: string,
      acknowledgementText: string | null = null,
      isRetryFlag: boolean = false,
      retryCountValue: number = 0,
      isFollowUpFlag: boolean = false
    ) => {
      if (!applicationId) {
        console.warn('No applicationId provided, skipping database save')
        return
      }

      try {
        let interviewSession = await prisma.interviewSession.findUnique({
          where: { applicationId },
        })

        if (!interviewSession) {
          interviewSession = await prisma.interviewSession.create({
            data: {
              applicationId,
              status: 'in-progress',
            },
          })
        }

        await prisma.interviewResponse.create({
          data: {
            sessionId: interviewSession.id,
            questionId: originalQuestionId,
            questionText: originalQuestion,
            transcript: transcriptText,
            acknowledgement: acknowledgementText || null,
            questionIndex,
            isFollowUp: isFollowUpFlag,
            isRetry: isRetryFlag,
            retryCount: retryCountValue,
          },
        })
      } catch (error) {
        console.error('Error saving response to database:', error)
      }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const openai = new OpenAI({ apiKey })

    const validationCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 40,
      messages: [
        {
          role: 'system',
          content: getValidationPrompt(intiLanguage)
        },
        {
          role: 'user',
          content: `Q: ${originalQuestion}\nA: ${truncatedTranscript}`
        }
      ],
    })

    const validationText = validationCompletion.choices[0]?.message?.content?.trim() || ''
    const parts = validationText.split('|')

    const adequacyLabel = parts[0]?.toLowerCase() ?? ''
    const isAdequate =
      adequacyLabel === 'acceptable' ||
      adequacyLabel === 'aceitável' ||
      adequacyLabel === 'aceptable'

    const retryKey = `${sessionId}:${originalQuestionId}`

    let retryState = questionRetryMap.get(retryKey)
    if (!retryState) {
      retryState = { retries: 0 }
      questionRetryMap.set(retryKey, retryState)
    }

    if (isAdequate) {
      conversationHistory.push({
        role: 'user',
        content: `Interview Question ${questionIndex + 1}: ${originalQuestion}\n\nCandidate Answer: ${truncatedTranscript}`
      })
    }

    if (!isAdequate) {
      retryState.retries += 1
      questionRetryMap.set(retryKey, retryState)

      if (retryState.retries <= MAX_RETRIES_PER_QUESTION) {
        const clarification = getClarificationMessage(intiLanguage, applicantName, originalQuestion, retryState.retries)
        const acknowledgement = clarification

        conversationHistory.push({
          role: 'assistant',
          content: acknowledgement
        })

        conversationSessions.set(sessionId, conversationHistory)
        sessionTimestamps.set(sessionId, Date.now())

        if (tempFilePath) {
          unlink(tempFilePath).catch(console.error)
        }

        saveResponseToDB(transcript, acknowledgement, true, retryState.retries, true).catch((error) => {
          console.error('Error saving response to database (non-blocking):', error)
        })

        return NextResponse.json({
          transcript,
          acknowledgement,
          nextQuestion: {
            id: originalQuestionId,
            question: clarification,
          },
          isComplete: false,
          isFollowUp: true,
          needsClarification: true,
          retryCount: retryState.retries,
          conversationHistory: conversationHistory.length,
        })
      } else {
        const moveOnAcknowledgement = getCompletionMessage(intiLanguage, applicantName, isLastQuestion)
        const shouldComplete = isLastQuestion

        conversationHistory.push({
          role: 'assistant',
          content: moveOnAcknowledgement
        })

        questionRetryMap.delete(retryKey)

        if (shouldComplete) {
          conversationSessions.delete(sessionId)
          sessionTimestamps.delete(sessionId)
        } else {
          conversationSessions.set(sessionId, conversationHistory)
          sessionTimestamps.set(sessionId, Date.now())
        }

        if (tempFilePath) {
          unlink(tempFilePath).catch(console.error)
        }

        saveResponseToDB(transcript, moveOnAcknowledgement, true, retryState.retries, false).catch((error) => {
          console.error('Error saving response to database (non-blocking):', error)
        })

        return NextResponse.json({
          transcript,
          acknowledgement: moveOnAcknowledgement,
          nextQuestion: shouldComplete ? null : nextQuestion,
          isComplete: shouldComplete,
          isFollowUp: false,
          needsClarification: false,
          retryCount: retryState.retries,
          conversationHistory: conversationHistory.length,
        })
      }
    }

    const retryKeyForCleanup = `${sessionId}:${questionId}`
    if (questionRetryMap.has(retryKeyForCleanup)) {
      questionRetryMap.delete(retryKeyForCleanup)
    }

    const acknowledgementPrompt = getAcknowledgementPromptForSession(intiLanguage, applicantName, isLastQuestion, nextQuestion?.question)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 200,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: acknowledgementPrompt
        }
      ],
    })

    const responseText = completion.choices[0]?.message?.content || ''

    const acknowledgementMatch = responseText.match(
      /(?:ACKNOWLEDGEMENT|RECONHECIMENTO|RECONOCIMIENTO):\s*([\s\S]+?)(?=\n|(?:ACTION|AÇÃO|ACCIÓN):|$)/i
    )
    const actionMatch = responseText.match(/(?:ACTION|AÇÃO|ACCIÓN):\s*([\s\S]+?)(?=\n|$)/i)
    const followUpMatch = responseText.match(
      /(?:FOLLOW_UP|ACOMPANHAMENTO|SEGUIMIENTO):\s*([\s\S]+?)(?=\n|$)/i
    )

    const acknowledgement =
      acknowledgementMatch?.[1]?.trim() || getDefaultSessionAcknowledgement(intiLanguage)
    const rawAction = actionMatch?.[1]?.trim().toLowerCase() || ''
    const action =
      rawAction === 'follow-up' ||
      rawAction === 'acompanhamento' ||
      rawAction === 'seguimiento'
        ? 'follow-up'
        : 'next-question'
    const followUpQuestion = followUpMatch?.[1]?.trim() || null

    conversationHistory.push({
      role: 'assistant',
      content: acknowledgement
    })

    const shouldAskFollowUp = !isLastQuestion && action === 'follow-up' && followUpQuestion !== null

    let finalNextQuestion: InterviewQuestion | null = null
    if (isLastQuestion) {
      finalNextQuestion = null
    } else if (shouldAskFollowUp && followUpQuestion) {
      finalNextQuestion = {
        id: originalQuestionId,
        question: followUpQuestion,
      }
    } else {
      finalNextQuestion = nextQuestion
    }

    conversationSessions.set(sessionId, conversationHistory)
    sessionTimestamps.set(sessionId, Date.now())

    if (isLastQuestion && !shouldAskFollowUp) {
      conversationSessions.delete(sessionId)
      sessionTimestamps.delete(sessionId)
      for (const [retryKey] of questionRetryMap.entries()) {
        if (retryKey.startsWith(`${sessionId}:`)) {
          questionRetryMap.delete(retryKey)
        }
      }
    }

    if (tempFilePath) {
      unlink(tempFilePath).catch(console.error)
    }

    saveResponseToDB(transcript, acknowledgement, false, 0, shouldAskFollowUp).catch((error) => {
      console.error('Error saving response to database (non-blocking):', error)
    })

    return NextResponse.json({
      transcript,
      acknowledgement,
      nextQuestion: finalNextQuestion,
      isComplete: isLastQuestion && !shouldAskFollowUp,
      isFollowUp: shouldAskFollowUp,
      needsClarification: false,
      retryCount: 0,
      conversationHistory: conversationHistory.length,
    })

  } catch (error) {
    console.error('Error in multimodal session:', error)

    if (tempFilePath) {
      await unlink(tempFilePath).catch(console.error)
    }

    return NextResponse.json(
      { error: 'Failed to process interview answer' },
      { status: 500 }
    )
  }
}
