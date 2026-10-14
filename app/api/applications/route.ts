import { createApplication } from '@/features/applicant/services/applicationService'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

export async function POST(req: Request) {
  const session = await auth0.getSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const applicant = await prisma.applicant.findUnique({
      where: { email: session.user.email },
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const result = await createApplication({
      applicantId: applicant.id,
      jobId: jobId,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
