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
    const { naturalProfile, adaptedProfile } = body

    if (!naturalProfile || !adaptedProfile) {
      return NextResponse.json(
        { message: 'Natural profile and adapted profile are required' },
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

    const discResult = await prisma.discResult.upsert({
      where: { applicantId: applicant.id },
      create: {
        applicantId: applicant.id,
        naturalProfile,
        adaptedProfile,
      },
      update: {
        naturalProfile,
        adaptedProfile,
      },
    })

    await prisma.application.updateMany({
      where: {
        applicantId: applicant.id,
        status: 'applied',
      },
      data: {
        status: 'psychological-test',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(discResult, { status: 200 })
  } catch (error) {
    console.error('Error saving DISC result:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
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

    const applicant = await prisma.applicant.findUnique({
      where: { email: session.user.email },
    })

    if (!applicant) {
      return NextResponse.json(
        { message: 'Applicant not found' },
        { status: 404 }
      )
    }

    const discResult = await prisma.discResult.findUnique({
      where: { applicantId: applicant.id },
    })

    if (!discResult) {
      return NextResponse.json(
        { message: 'DISC result not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(discResult, { status: 200 })
  } catch (error) {
    console.error('Error fetching DISC result:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
