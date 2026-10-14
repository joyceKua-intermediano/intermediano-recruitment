import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession()

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { message: 'Job ID is required' },
        { status: 400 }
      )
    }

    const applicant = await prisma.applicant.findUnique({
      where: { email: session.user.email },
    })

    if (!applicant) {
      return NextResponse.json(
        { message: 'Applicant not found' },
        { status: 404 }
      )
    }

    const application = await prisma.application.findFirst({
      where: {
        applicantId: applicant.id,
        jobId: jobId,
      },
    })

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found for this job' },
        { status: 403 }
      )
    }

    const jobInterviewQuestions = await prisma.jobInterviewQuestions.findUnique({
      where: { jobId },
    })

    return NextResponse.json(
      jobInterviewQuestions || {
        id: null,
        jobId,
        interviewQuestions: []
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching job interview questions:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
