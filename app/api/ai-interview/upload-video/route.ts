import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { applicationId, videoId, questionIndex } = body

    if (!applicationId || !videoId || questionIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: applicationId, videoId, and questionIndex are required' },
        { status: 400 }
      )
    }

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { applicationId },
    })
    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Interview session not found' },
        { status: 404 }
      )
    }

    const response = await prisma.interviewResponse.findFirst({
      where: {
        sessionId: interviewSession.id,
        questionIndex: parseInt(questionIndex.toString()),
      },
      orderBy: { createdAt: 'desc' },
    })
    if (!response) {
      return NextResponse.json(
        { error: `No response found for questionIndex ${questionIndex}` },
        { status: 404 }
      )
    }

    setImmediate(async () => {
      try {
        await prisma.interviewResponse.update({
          where: { id: response.id },
          data: { videoId },
        })
        console.log(`VideoId ${videoId} saved to question ${questionIndex}`)
      } catch (error) {
        console.error('Error updating response with videoId (non-blocking):', error)
      }
    })

    return NextResponse.json({
      success: true,
      videoId,
    })

  } catch (error) {
    console.error('Error saving videoId:', error)
    return NextResponse.json(
      { error: 'Failed to save videoId' },
      { status: 500 }
    )
  }
}
