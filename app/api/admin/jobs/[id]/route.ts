import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { updateJobSchema } from '@/features/admin/schemas/jobSchema'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAccess(request)
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await params

    const body = await request.json()
    const validatedData = updateJobSchema.parse({ id, ...body })

    const existingJob = await prisma.job.findUnique({
      where: { id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      )
    }

    if (validatedData.jobId && validatedData.jobId !== existingJob.jobId) {
      const jobWithSameId = await prisma.job.findFirst({
        where: { jobId: validatedData.jobId }
      })

      if (jobWithSameId) {
        return NextResponse.json(
          { message: 'Job ID already exists' },
          { status: 400 }
        )
      }
    }

    const { id: _, ...updateData } = validatedData

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)

    if (error instanceof Error && error.message.includes('Job ID already exists')) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to update job' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAccess(request)
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.error },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    if (!existingJob) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      )
    }

    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        { message: 'Cannot delete job with existing applications' },
        { status: 400 }
      )
    }

    await prisma.job.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { message: 'Failed to delete job' },
      { status: 500 }
    )
  }
}
