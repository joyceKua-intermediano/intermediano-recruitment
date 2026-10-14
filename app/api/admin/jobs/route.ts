import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { createJobSchema } from '@/features/admin/schemas/jobSchema'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const result = await verifyAdminAccess(request)

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    const where: any = {}
    if (category) where.category = category
    if (location) where.location = location
    if (isActive !== null) where.isActive = isActive === 'true'

    const [total, jobs] = await Promise.all([
      prisma.job.count({ where }),
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { applications: true }
          }
        }
      })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { message: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await verifyAdminAccess(request)

    const body = await request.json()

    const validatedData = createJobSchema.parse(body)

    const existingJob = await prisma.job.findFirst({
      where: { jobId: validatedData.jobId }
    })

    if (existingJob) {
      return NextResponse.json(
        { message: 'Job ID already exists' },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: validatedData,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)

    if (error instanceof Error && error.message.includes('Job ID already exists')) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to create job' },
      { status: 500 }
    )
  }
}
