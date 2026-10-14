import { NextResponse } from 'next/server'

import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'
import { saveApplicantWithInformation } from '@/features/applicant/services/basicInformationService'

export async function GET() {
  const session = await auth0.getSession()

  const email = session?.user?.email?.toLowerCase().trim()
  if (!email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }
  try {
    const applicantWithInfo = await prisma.applicant.findUnique({
      where: { email },
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

    const { information, name, id } = applicantWithInfo

    const applicantInformation = information[0]

    const transformedData = {
      id: id ?? '',
      name: name ?? '',
      mobile: applicantInformation?.mobile.toString() ?? '',
      birthDate: applicantInformation?.birthDate?.toISOString().split('T')[0],
      city: applicantInformation?.city ?? '',
      country: applicantInformation?.country ?? '',
      updatedAt: applicantInformation?.updatedAt
    }

    return NextResponse.json(transformedData, { status: 200 })
  } catch (error) {
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

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
    const email = session.user.email.toLowerCase().trim()
    const { name, mobile, birthDate, city, country } = body
    if (!name || !mobile || !city || !country) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    if (isNaN(Number(mobile))) {
      return NextResponse.json(
        { error: 'Mobile must be a number' },
        { status: 400 }
      )
    }
    const applicant = await saveApplicantWithInformation({
      email,
      name,
      mobile,
      birthDate: birthDate || undefined,
      city,
      country,
    })

    return NextResponse.json(applicant, { status: 201 })
  } catch (error) {
    console.error('Error creating applicant:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
