import { createApplication } from '@/features/applicant/services/applicationService'
import { adminCreateApplicationSchema } from '@/features/admin/schemas/createApplicantSchema'
import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const result = await verifyAdminAccess(request)

  if (!result.success) {
    return NextResponse.json(
      { message: result.error },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const parsed = adminCreateApplicationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { applicantId, jobId } = parsed.data

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      select: { id: true },
    })

    if (!applicant) {
      return NextResponse.json(
        { message: 'Applicant not found' },
        { status: 404 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, isActive: true },
    })

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      )
    }

    if (!job.isActive) {
      return NextResponse.json(
        { message: 'Job is not available' },
        { status: 400 }
      )
    }

    const applicationResult = await createApplication({
      applicantId,
      jobId,
    })

    if (applicationResult.isDuplicate) {
      return NextResponse.json(
        { message: 'This applicant has already applied to this job' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        message: 'Application created successfully',
        application: applicationResult.application,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating admin application:', error)
    return NextResponse.json(
      { message: 'Failed to create application' },
      { status: 500 }
    )
  }
}
