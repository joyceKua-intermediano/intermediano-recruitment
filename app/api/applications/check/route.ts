import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

export async function GET(request: Request) {
  const session = await auth0.getSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const applicantId = searchParams.get('applicantId')

    if (!jobId || !applicantId) {
      return NextResponse.json(
        { error: 'Job ID and Applicant ID are required' },
        { status: 400 }
      )
    }

    const application = await prisma.application.findFirst({
      where: {
        applicantId: applicantId,
        jobId: jobId,
      },
      include: {
        job: {
          select: {
            title: true,
            jobId: true,
          }
        }
      }
    })

    if (application) {
      return NextResponse.json({
        hasApplied: true,
        application: {
          id: application.id,
          status: application.status,
          createdAt: application.createdAt,
          jobTitle: application.job.title,
          jobId: application.job.jobId
        }
      })
    } else {
      return NextResponse.json({
        hasApplied: false
      })
    }
  } catch (error) {
    console.error('Error checking application status:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
