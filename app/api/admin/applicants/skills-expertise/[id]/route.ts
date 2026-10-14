import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await verifyAdminAccess(request)
    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      )
    }

    const applicantId = id

    const getApplicantSkillsExpertise = await prisma.applicantSkillsExpertise.findFirst({
      where: {
        applicantId,
      },
    })

    if (!getApplicantSkillsExpertise) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(getApplicantSkillsExpertise)
  } catch (error) {
    console.error('Error fetching applicant skills expertise:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
