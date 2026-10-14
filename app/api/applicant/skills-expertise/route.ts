import { saveApplicantSkillExpertise } from '@/features/applicant/services/skillsExpertiseService'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const applicantId = searchParams.get('applicantId')
  if (!applicantId) {
    return NextResponse.json(
      { error: 'applicantId is required' },
      { status: 400 }
    )
  }

  try {
    const getApplicantSkillsExpertise =
      await prisma.applicantSkillsExpertise.findFirst({
        where: {
          applicantId,
        },
      })
    if (!getApplicantSkillsExpertise) {
      return NextResponse.json([], { status: 200 })
    }
    return NextResponse.json(getApplicantSkillsExpertise)
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

  const body = await req.json()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    )
  }

  try {
    const applicantSkillsExpertise = await saveApplicantSkillExpertise(body)
    return NextResponse.json(applicantSkillsExpertise, { status: 201 })
  } catch (error) {
    console.error('Error creating applicant:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
