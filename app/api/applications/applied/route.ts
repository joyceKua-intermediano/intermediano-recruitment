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
    const applicantId = searchParams.get('applicantId')

    if (!applicantId) {
      return NextResponse.json(
        { error: 'Applicant ID is required' },
        { status: 400 }
      )
    }

    const applications = await prisma.application.findMany({
      where: {
        applicantId: applicantId,
      },
      include: {
        job: {
          select: {
            id: true,
            jobId: true,
            title: true,
            location: true,
            type: true,
            salary: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalApplied = applications.length

    return NextResponse.json({
      totalApplied,
      applications: applications.map(app => ({
        id: app.id,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        job: app.job
      }))
    })
  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
