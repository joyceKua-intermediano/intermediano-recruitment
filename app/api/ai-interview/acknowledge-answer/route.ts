import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import {
  getAcknowledgementPrompt,
  getSimpleAcknowledgementFallback,
} from '@/features/ai-interview/utils/languagePrompts'
import { parseIntiLanguage } from '@/features/ai-interview/types/language'

export async function POST(request: NextRequest) {
  try {
    const { question, answer, language = 'en' } = await request.json()

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const intiLanguage = parseIntiLanguage(language)
    const openai = new OpenAI({ apiKey })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 80,
      messages: [
        {
          role: 'system',
          content: getAcknowledgementPrompt(intiLanguage)
        },
        {
          role: 'user',
          content: `Interview Question: "${question}"\n\nCandidate's Answer: "${answer}"\n\nProvide a brief, conversational acknowledgement.`
        }
      ],
    })

    const fallbackMessage = getSimpleAcknowledgementFallback(intiLanguage)
    const acknowledgement = completion.choices[0]?.message?.content?.trim() || fallbackMessage

    return NextResponse.json({
      acknowledgement,
    })

  } catch (error) {
    console.error('Error generating acknowledgement:', error)
    return NextResponse.json(
      { error: 'Failed to generate acknowledgement' },
      { status: 500 }
    )
  }
}

