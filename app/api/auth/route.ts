import { saveApplicantInitialInfo } from '@/features/applicant/services/saveApplicantIntialInfo'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, name } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    const applicant = await saveApplicantInitialInfo({
      name: name.trim(),
      email: email.toLowerCase().trim(),
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
