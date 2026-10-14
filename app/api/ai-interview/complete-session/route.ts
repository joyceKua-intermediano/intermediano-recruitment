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
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Missing required field: applicationId' },
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
      select: { id: true, applicantId: true },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    if (application.applicantId !== applicant.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only complete your own interview sessions' },
        { status: 403 }
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

    const updatedSession = await prisma.interviewSession.update({
      where: { id: interviewSession.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    })

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'second-rating',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedSession,
    })
  } catch (error) {
    console.error('Error completing interview session:', error)
    return NextResponse.json(
      { error: 'Failed to complete interview session' },
      { status: 500 }
    )
  }
}
