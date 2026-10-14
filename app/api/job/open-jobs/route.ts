import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        jobId: true,
        title: true,
        category: true,
        description: true,
        location: true,
        type: true,
        salary: true,
        essentialSkills: true,
        responsibilities: true,
        qualifications: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching open jobs:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
