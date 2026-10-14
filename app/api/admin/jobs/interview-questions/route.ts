import { createJobInterviewQuestions } from '@/features/admin/schemas/jobSchema'
import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await verifyAdminAccess(request)

    const body = await request.json()
    const validateData = createJobInterviewQuestions.parse(body)

    const interviewQuestions = await prisma.jobInterviewQuestions.upsert({
      where: {
        jobId: validateData.jobId
      },
      update: {
        interviewQuestions: validateData.interviewQuestions,
        intiLanguage: validateData.intiLanguage
      },
      create: {
        jobId: validateData.jobId,
        interviewQuestions: validateData.interviewQuestions,
        intiLanguage: validateData.intiLanguage
      }
    })

    return NextResponse.json(interviewQuestions, { status: 201 })
  } catch (error) {
    console.error('Error creating job interview questions:', error)
    return NextResponse.json(
      { message: 'Failed to create job interview questions' },
      { status: 500 }
    )
  }
}
