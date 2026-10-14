import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import OpenAI from 'openai'
import fs from 'fs'
import prisma from '@/lib/prisma'
import { parseIntiLanguage, type IntiLanguage } from '@/features/ai-interview/types/language'
import { whisperLanguageCode } from '@/features/ai-interview/utils/languagePrompts'

interface InterviewQuestion {
  id: string
  question: string
  timeLimit?: number
}

function transformQuestions(questions: string[]): InterviewQuestion[] {
  if (!questions || questions.length === 0) {
    return []
  }

  return questions.map((question, index) => ({
    id: (index + 1).toString(),
    question: question.trim(),
  }))
}

async function getJobInterviewQuestions(
  jobId: string
): Promise<{ questions: InterviewQuestion[]; language: IntiLanguage }> {
  try {
    const jobQuestions = await prisma.jobInterviewQuestions.findUnique({
      where: { jobId },
    })

    if (jobQuestions && jobQuestions.interviewQuestions.length > 0) {
      return {
        questions: transformQuestions(jobQuestions.interviewQuestions),
        language: parseIntiLanguage(jobQuestions.intiLanguage),
      }
    }

    return { questions: [], language: 'en' }
  } catch (error) {
    console.error('Error fetching job interview questions:', error)
    return { questions: [], language: 'en' }
  }
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const questionId = formData.get('questionId') as string
    const questionIndex = parseInt(formData.get('questionIndex') as string)
    const question = formData.get('question') as string
    const jobId = formData.get('jobId') as string | null

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    let interviewQuestions: InterviewQuestion[] = []
    let intiLanguage: IntiLanguage = 'en'
    if (jobId) {
      const jobData = await getJobInterviewQuestions(jobId)
      interviewQuestions = jobData.questions
      intiLanguage = jobData.language
    }

    if (interviewQuestions.length === 0) {
      if (tempFilePath) {
        await unlink(tempFilePath).catch(console.error)
      }
      return NextResponse.json(
        { error: 'No interview questions found for this job. Please contact the administrator.' },
        { status: 400 }
      )
    }

    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const tempFileName = `interview-${Date.now()}.webm`
    tempFilePath = join(tmpdir(), tempFileName)
    await writeFile(tempFilePath, buffer)

    const transcript = await transcribeAudio(tempFilePath, intiLanguage)

    if (!transcript) {
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: 500 }
      )
    }

    const analysis = null

    const nextQuestionIndex = questionIndex + 1
    const nextQuestion = nextQuestionIndex < interviewQuestions.length
      ? interviewQuestions[nextQuestionIndex]
      : null

    if (tempFilePath) {
      await unlink(tempFilePath).catch(console.error)
    }

    return NextResponse.json({
      transcript,
      nextQuestion,
      isComplete: nextQuestion === null,
    })

  } catch (error) {
    console.error('Error processing interview answer:', error)

    if (tempFilePath) {
      await unlink(tempFilePath).catch(console.error)
    }

    return NextResponse.json(
      { error: 'Failed to process answer' },
      { status: 500 }
    )
  }
}

async function transcribeAudio(
  filePath: string,
  language: IntiLanguage = 'en'
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error('OPENAI_API_KEY not configured')
    return '[Transcription unavailable - Please configure OPENAI_API_KEY]'
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

async function analyzeAnswer(
  transcript: string,
  question: string,
  questionIndex: number
): Promise<{ score: number; feedback: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.log('OPENAI_API_KEY not configured - skipping analysis')
    return null
  }

  try {
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `You are an expert interviewer analyzing candidate responses. Evaluate answers based on:
- Clarity and communication
- Relevance to the question
- Depth of experience/insight
- Professionalism

Provide a score (0-100) and brief constructive feedback.`
        },
        {
          role: 'user',
          content: `Question: "${question}"\n\nCandidate's Answer: "${transcript}"\n\nProvide your analysis.`
        }
      ],
    })

    const analysisText = completion.choices[0]?.message?.content || ''

    const scoreMatch = analysisText.match(/score[:\s]+(\d+)/i)
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75

    return {
      score,
      feedback: analysisText,
    }

  } catch (error) {
    console.error('Error analyzing answer:', error)
    return null
  }
}
