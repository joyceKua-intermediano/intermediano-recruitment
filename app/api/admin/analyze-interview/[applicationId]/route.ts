import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import prisma from '@/lib/prisma'
import OpenAI from 'openai'
import type { IntiLanguage } from '@/features/ai-interview/types/language'
import { parseIntiLanguage } from '@/features/ai-interview/types/language'

function getAnalyzeSystemPrompt(language: IntiLanguage): string {
  if (language === 'pt') {
    return `Você é um entrevistador especializado analisando respostas de candidatos. Avalie as respostas com base em:
- Clareza e comunicação (0-25 pontos)
- Relevância para a pergunta (0-25 pontos)
- Profundidade da experiência/insight (0-25 pontos)
- Profissionalismo e articulação (0-25 pontos)

Forneça uma pontuação (0-100) e feedback construtivo breve (2-3 frases).

Formate sua resposta como:
SCORE: [número 0-100]
ANALYSIS: [seu texto de feedback em português]`
  }
  if (language === 'es') {
    return `Eres un entrevistador experto que analiza respuestas de candidatos. Evalúa las respuestas según:
- Claridad y comunicación (0-25 puntos)
- Relevancia para la pregunta (0-25 puntos)
- Profundidad de experiencia/insight (0-25 puntos)
- Profesionalismo y articulación (0-25 puntos)

Proporciona una puntuación (0-100) y feedback constructivo breve (2-3 frases).

Formatea tu respuesta como:
SCORE: [número 0-100]
ANALYSIS: [tu texto de feedback en español]`
  }
  return `You are an expert interviewer analyzing candidate responses. Evaluate answers based on:
- Clarity and communication (0-25 points)
- Relevance to the question (0-25 points)
- Depth of experience/insight (0-25 points)
- Professionalism and articulation (0-25 points)

Provide a score (0-100) and brief constructive feedback (2-3 sentences).

Format your response as:
SCORE: [number 0-100]
ANALYSIS: [your feedback text]`
}

function getAnalyzeUserPrompt(
  language: IntiLanguage,
  question: string,
  transcript: string
): string {
  if (language === 'pt') {
    return `Pergunta: "${question}"\n\nResposta do Candidato: "${transcript}"\n\nForneça sua análise com SCORE e ANALYSIS.`
  }
  if (language === 'es') {
    return `Pregunta: "${question}"\n\nRespuesta del candidato: "${transcript}"\n\nProporciona tu análisis con SCORE y ANALYSIS.`
  }
  return `Question: "${question}"\n\nCandidate's Answer: "${transcript}"\n\nProvide your analysis with SCORE and ANALYSIS.`
}

async function analyzeAnswer(
  transcript: string,
  question: string,
  language: IntiLanguage = 'en'
): Promise<{ score: number; analysis: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.log('OPENAI_API_KEY not configured - skipping analysis')
    return null
  }

  const systemPrompt = getAnalyzeSystemPrompt(language)
  const userPrompt = getAnalyzeUserPrompt(language, question, transcript)

  try {
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
    })

    const analysisText = completion.choices[0]?.message?.content || ''

    const scoreMatch = analysisText.match(/SCORE:\s*(\d+)/i)
    const score = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : null

    const analysisMatch = analysisText.match(/ANALYSIS:\s*([\s\S]+)/i)
    const analysis = analysisMatch?.[1]?.trim() || analysisText.trim()

    if (score === null) {
      console.warn('Could not parse score from analysis response')
      return null
    }

    return {
      score,
      analysis,
    }

  } catch (error) {
    console.error('Error analyzing answer:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const result = await verifyAdminAccess(request)
    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      )
    }

    const { applicationId } = await params

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { applicationId },
      select: {
        id: true,
        isAnalyzed: true,
        averageScore: true,
        status: true,
        responses: {
          select: {
            id: true,
            score: true,
          },
        },
      },
    })

    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Interview session not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      isAnalyzed: interviewSession.isAnalyzed,
      averageScore: interviewSession.averageScore,
      analyzedCount: interviewSession.responses.filter(r => r.score !== null).length,
      totalCount: interviewSession.responses.length,
    })

  } catch (error) {
    console.error('Error checking analysis status:', error)
    return NextResponse.json(
      { error: 'Failed to check analysis status' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const result = await verifyAdminAccess(request)
    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      )
    }

    const { applicationId } = await params

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { applicationId },
      include: {
        application: {
          include: {
            job: {
              include: {
                interviewQuestions: true
              }
            }
          }
        },
        responses: {
          orderBy: [
            { questionIndex: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    })

    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Interview session not found' },
        { status: 404 }
      )
    }

    if (interviewSession.isAnalyzed) {
      return NextResponse.json({
        success: true,
        message: 'Interview already analyzed',
        averageScore: interviewSession.averageScore,
        isAnalyzed: true,
      })
    }

    const language = parseIntiLanguage(
      interviewSession.application.job.interviewQuestions?.intiLanguage
    )

    const responsesToAnalyze = interviewSession.responses.filter((response, index, arr) => {
      const sameQuestionResponses = arr.filter(r => r.questionIndex === response.questionIndex)
      return response === sameQuestionResponses[sameQuestionResponses.length - 1]
    })

    const analysisPromises = responsesToAnalyze.map(async (response) => {
      if (response.score !== null) {
        return { responseId: response.id, score: response.score, analysis: response.analysis }
      }

      const result = await analyzeAnswer(response.transcript, response.questionText, language)
      
      if (result) {
        await prisma.interviewResponse.update({
          where: { id: response.id },
          data: {
            score: result.score,
            analysis: result.analysis,
          },
        })
        return { responseId: response.id, score: result.score, analysis: result.analysis }
      }
      
      return { responseId: response.id, score: null, analysis: null }
    })

    const analysisResults = await Promise.all(analysisPromises)

    const scores = analysisResults
      .map(r => r.score)
      .filter((score): score is number => score !== null)

    const averageScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null

    await prisma.interviewSession.update({
      where: { id: interviewSession.id },
      data: {
        averageScore,
        isAnalyzed: true,
      },
    })

    return NextResponse.json({
      success: true,
      averageScore,
      analyzedCount: scores.length,
      totalCount: responsesToAnalyze.length,
      isAnalyzed: true,
    })

  } catch (error) {
    console.error('Error analyzing interview:', error)
    return NextResponse.json(
      { error: 'Failed to analyze interview' },
      { status: 500 }
    )
  }
}
