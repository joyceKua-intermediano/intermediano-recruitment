import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await verifyAdminAccess(request)

    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = [
      'applied',
      'psychological-test',
      'ai-interview',
      'second-rating',
      'personal-interview',
      'approved',
      'rejected',
      'resigned'
    ]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            type: true,
            salary: true,
          }
        },
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Application status updated successfully',
      application: {
        id: updatedApplication.id,
        status: updatedApplication.status,
        updatedAt: updatedApplication.updatedAt,
        job: updatedApplication.job,
        applicant: updatedApplication.applicant
      }
    })
  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { message: 'Failed to update application status' },
      { status: 500 }
    )
  }
}
