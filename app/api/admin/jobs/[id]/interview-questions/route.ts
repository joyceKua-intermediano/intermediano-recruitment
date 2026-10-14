import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    await verifyAdminAccess(request)

    const jobId = (await params).id
    const questions = await prisma.jobInterviewQuestions.findUnique({
      where: { jobId },
    })
    return NextResponse.json(questions || { jobId, interviewQuestions: [] })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch interview questions' },
      { status: 500 }
    )
  }
}
