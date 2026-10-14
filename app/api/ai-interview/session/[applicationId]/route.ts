import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await auth0.getSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const { applicationId } = await params

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Missing applicationId' },
        { status: 400 }
      )
    }

    const applicant = await prisma.applicant.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        applicantId: true,
        job: {
          select: {
            id: true,
            jobId: true,
          }
        }
      },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.applicantId !== applicant.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only access your own interview sessions' },
        { status: 403 }
      )
    }

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { applicationId },
      include: {
        responses: {
          orderBy: [
            { questionIndex: 'asc' },
            { answeredAt: 'asc' },
          ],
        },
      },
    })

    if (!interviewSession) {
      return NextResponse.json({
        exists: false,
        session: null,
        resumePoint: null,
      })
    }

    const jobQuestions = await prisma.jobInterviewQuestions.findUnique({
      where: { jobId: application.job.id },
      select: { interviewQuestions: true },
    })

    const interviewQuestions = jobQuestions?.interviewQuestions || []

    let resumeQuestionIndex = 0
    let lastAnsweredIndex = -1
    let needsRetry = false
    const MAX_RETRIES_PER_QUESTION = 2

    if (interviewSession.responses.length > 0) {
      lastAnsweredIndex = Math.max(
        ...interviewSession.responses.map(r => r.questionIndex)
      )

      const lastQuestionResponses = interviewSession.responses
        .filter(r => r.questionIndex === lastAnsweredIndex)
        .sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime())

      if (lastQuestionResponses.length > 0) {
        const lastResponse = lastQuestionResponses[0]

        if (lastResponse.isRetry && lastResponse.retryCount < MAX_RETRIES_PER_QUESTION) {
          resumeQuestionIndex = lastAnsweredIndex
          needsRetry = true
        } else {
          resumeQuestionIndex = lastAnsweredIndex + 1
        }
      } else {
        // No responses for last index (shouldn't happen, but handle it)
        resumeQuestionIndex = lastAnsweredIndex + 1
      }

      if (resumeQuestionIndex >= interviewQuestions.length) {
        return NextResponse.json({
          exists: true,
          session: {
            id: interviewSession.id,
            status: interviewSession.status,
            startedAt: interviewSession.startedAt,
            completedAt: interviewSession.completedAt,
          },
          responses: interviewSession.responses,
          interviewQuestions,
          resumePoint: {
            questionIndex: interviewQuestions.length - 1,
            isComplete: true,
            lastAnsweredIndex,
            needsRetry: false,
          },
        })
      }
    }

    const allTranscripts = interviewSession.responses
      .map(r => r.transcript)
      .filter(Boolean)

    return NextResponse.json({
      exists: true,
      session: {
        id: interviewSession.id,
        status: interviewSession.status,
        startedAt: interviewSession.startedAt,
        completedAt: interviewSession.completedAt,
      },
      responses: interviewSession.responses,
      interviewQuestions,
      resumePoint: {
        questionIndex: resumeQuestionIndex,
        isComplete: false,
        lastAnsweredIndex,
        needsRetry,
      },
      allTranscripts,
    })
  } catch (error) {
    console.error('Error fetching interview session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interview session' },
      { status: 500 }
    )
  }
}
