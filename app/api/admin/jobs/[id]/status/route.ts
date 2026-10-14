import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await verifyAdminAccess(request)
    const { id } = await params

    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { message: 'isActive must be a boolean' },
        { status: 400 }
      )
    }

    const existingJob = await prisma.job.findUnique({
      where: { id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      )
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { isActive },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job status:', error)
    return NextResponse.json(
      { message: 'Failed to update job status' },
      { status: 500 }
    )
  }
}
