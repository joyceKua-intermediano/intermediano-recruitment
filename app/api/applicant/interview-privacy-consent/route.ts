import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession()

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json(
        { message: 'Application ID is required' },
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
        id: applicationId,
        applicantId: applicant.id,
      },
    })

    if (!application) {
      return NextResponse.json(
        { message: 'Application not found or does not belong to this applicant' },
        { status: 404 }
      )
    }

    const consent = await prisma.interviewPrivacyConsent.upsert({
      where: {
        applicantId_applicationId: {
          applicantId: applicant.id,
          applicationId: applicationId,
        },
      },
      create: {
        applicantId: applicant.id,
        applicationId: applicationId,
        consentedAt: new Date(),
      },
      update: {
        consentedAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        message: 'Privacy consent saved successfully',
        consent: {
          id: consent.id,
          applicantId: consent.applicantId,
          applicationId: consent.applicationId,
          consentedAt: consent.consentedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving interview privacy consent:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

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
    const applicationId = searchParams.get('applicationId')

    if (!applicationId) {
      return NextResponse.json(
        { message: 'Application ID is required' },
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

    const consent = await prisma.interviewPrivacyConsent.findUnique({
      where: {
        applicantId_applicationId: {
          applicantId: applicant.id,
          applicationId: applicationId,
        },
      },
    })

    if (!consent) {
      return NextResponse.json(
        { message: 'Consent not found', hasConsented: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        hasConsented: true,
        consent: {
          id: consent.id,
          applicantId: consent.applicantId,
          applicationId: consent.applicationId,
          consentedAt: consent.consentedAt,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching interview privacy consent:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
