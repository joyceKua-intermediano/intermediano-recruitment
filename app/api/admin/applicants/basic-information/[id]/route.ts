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

    const applicantWithInfo = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: {
        information: true,
      },
    })

    if (!applicantWithInfo) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }
    
    const { information, name, id: applicantIdFromDb, email } = applicantWithInfo
    const applicantInformation = information[0]

    const transformedData = {
      id: applicantIdFromDb ?? '',
      name: name ?? '',
      email: email ?? '',
      mobile: applicantInformation?.mobile?.toString() ?? '',
      birthDate: applicantInformation?.birthDate?.toISOString().split('T')[0] ?? '',
      city: applicantInformation?.city ?? '',
      country: applicantInformation?.country ?? '',
      updatedAt: applicantInformation?.updatedAt
    }

    return NextResponse.json(transformedData, { status: 200 })
  } catch (error) {
    console.error('Error fetching applicant basic information:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
