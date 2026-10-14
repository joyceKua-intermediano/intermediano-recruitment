import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'
import { NextRequest, NextResponse } from 'next/server'
import { createApplicantFieldsSchema } from '@/features/admin/schemas/createApplicantSchema'
import {
  uploadApplicantResume,
  validateResumeFile,
} from '@/features/applicant/services/uploadResumeToR2'
import {
  Auth0ManagementError,
  createAuth0User,
  deleteAuth0User,
  generateTemporaryPassword,
} from '@/lib/auth0Management'

export async function GET(request: NextRequest) {
  try {

    const result = await verifyAdminAccess(request)

    if (!result.success) {
      return NextResponse.json(
        { message: result.error },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const jobId = searchParams.get('jobId')

    const availableJobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        type: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    let applicationWhere: any = {}
    if (status && status !== 'all') {
      applicationWhere.status = status
    }
    if (jobId && jobId !== 'all') {
      applicationWhere.jobId = jobId
    }

    const applicants = await prisma.applicant.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        information: true,
        applications: {
          where: applicationWhere,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                category: true,
                location: true,
                type: true,
                salary: true,
                isActive: true,
                createdAt: true,
              }
            },
            interviewSession: {
              include: {
                responses: {
                  orderBy: [
                    { questionIndex: 'asc' },
                    { createdAt: 'asc' }
                  ]
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    const total = await prisma.applicant.count()
    const totalPages = Math.ceil(total / limit)

    const applicantIds = applicants.map(app => app.id)

    const skillsData = await prisma.applicantSkillsExpertise.findMany({
      where: { applicantId: { in: applicantIds } }
    })

    const resumeData = await prisma.applicantResumeDetails.findMany({
      where: { applicantId: { in: applicantIds } }
    })

    const discResults = await prisma.discResult.findMany({
      where: { applicantId: { in: applicantIds } }
    })

    const transformedApplicants = applicants.map(applicant => {
      const applicantSkills = skillsData.find(s => s.applicantId === applicant.id)
      const applicantResume = resumeData.find(r => r.applicantId === applicant.id)
      const applicantInfo = applicant.information[0]
      const discResult = discResults.find(d => d.applicantId === applicant.id)

      let parsedSkills: Array<{ name: string; years: number }> = []
      if (applicantSkills?.skills) {
        try {
          parsedSkills = JSON.parse(JSON.stringify(applicantSkills.skills))
        } catch (error) {
          console.error(`Error parsing skills for ${applicant.name}:`, error)
          parsedSkills = []
        }
      }

      let discResultData = null
      if (discResult) {
        try {
          discResultData = {
            naturalProfile: discResult.naturalProfile as { D: number; I: number; S: number; C: number },
            adaptedProfile: discResult.adaptedProfile as { D: number; I: number; S: number; C: number },
          }
        } catch (error) {
          console.error(`Error parsing DISC result for ${applicant.name}:`, error)
        }
      }
      return {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        mobile: applicantInfo?.mobile?.toString() || '',
        city: applicantInfo?.city || '',
        country: applicantInfo?.country || '',
        birthDate: applicantInfo?.birthDate?.toISOString() || '',
        createdAt: applicant.createdAt.toISOString(),
        skills: parsedSkills,
        resumeFileName: applicantResume?.fileName || '',
        resumeFileSize: applicantResume?.fileSize || 0,
        discResult: discResultData,
        applications: applicant.applications.map(app => ({
          id: app.id,
          jobId: app.jobId,
          jobTitle: app.job.title,
          jobLocation: app.job.location,
          jobType: app.job.type,
          jobIsActive: app.job.isActive,
          jobPostedDate: app.job.createdAt.toISOString(),
          status: app.status,
          appliedAt: app.createdAt.toISOString(),
          lastUpdated: app.updatedAt.toISOString(),
          notes: '',
          interviewSession: app.interviewSession ? {
            id: app.interviewSession.id,
            status: app.interviewSession.status,
            startedAt: app.interviewSession.startedAt.toISOString(),
            completedAt: app.interviewSession.completedAt?.toISOString() || null,
            averageScore: app.interviewSession.averageScore,
            isAnalyzed: app.interviewSession.isAnalyzed,
            responses: app.interviewSession.responses.map(response => ({
              id: response.id,
              questionId: response.questionId,
              questionText: response.questionText,
              questionIndex: response.questionIndex,
              transcript: response.transcript,
              acknowledgement: response.acknowledgement,
              videoId: response.videoId,
              isFollowUp: response.isFollowUp,
              isRetry: response.isRetry,
              retryCount: response.retryCount,
              score: response.score,
              analysis: response.analysis,
              answeredAt: response.answeredAt.toISOString(),
              createdAt: response.createdAt.toISOString(),
            }))
          } : null,
        }))
      }
    })

    const response = NextResponse.json({
      applicants: transformedApplicants,
      availableJobs: availableJobs.map(job => ({
        id: job.id,
        title: job.title,
        category: job.category,
        location: job.location,
        type: job.type,
        isActive: job.isActive,
        postedDate: job.createdAt.toISOString(),
        applicationCount: job._count.applications,
        displayName: `${job.title} - ${job.location} (${job.isActive ? 'Active' : 'Closed'})`
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

    response.headers.set('Cache-Control', 'private, no-store')

    return response
  } catch (error) {
    console.error('Error in applicants endpoint:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }

    if (error instanceof Error) {
      if (error.message.includes('Response from the Engine was empty') ||
        error.message.includes('connect ECONNREFUSED') ||
        error.message.includes('MongoNetworkError')) {
        return NextResponse.json(
          { message: 'Service temporarily unavailable' },
          { status: 503 }
        )
      }
    }
    return NextResponse.json(
      { message: 'Failed to fetch applicants' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const result = await verifyAdminAccess(request)

  if (!result.success) {
    return NextResponse.json(
      { message: result.error },
      { status: 401 }
    )
  }

  let auth0UserId: string | null = null
  let applicantId: string | null = null

  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const email = formData.get('email')
    const file = formData.get('file')

    const parsedFields = createApplicantFieldsSchema.safeParse({
      name: typeof name === 'string' ? name : '',
      email: typeof email === 'string' ? email : '',
    })

    if (!parsedFields.success) {
      return NextResponse.json(
        { message: parsedFields.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const resumeFile = file instanceof File ? file : null
    if (resumeFile) {
      const fileValidation = validateResumeFile(resumeFile, resumeFile.name)
      if (!fileValidation.ok) {
        return NextResponse.json(
          { message: fileValidation.message },
          { status: 400 }
        )
      }
    }

    const normalizedEmail = parsedFields.data.email
      ? parsedFields.data.email.toLowerCase()
      : null

    if (normalizedEmail) {
      const existingApplicant = await prisma.applicant.findUnique({
        where: { email: normalizedEmail },
        select: { id: true },
      })

      if (existingApplicant) {
        return NextResponse.json(
          { message: 'An applicant with this email already exists' },
          { status: 409 }
        )
      }
    }

    let temporaryPassword: string | null = null
    if (normalizedEmail) {
      temporaryPassword = generateTemporaryPassword()
      const auth0User = await createAuth0User({
        email: normalizedEmail,
        name: parsedFields.data.name,
        password: temporaryPassword,
      })
      auth0UserId = auth0User.user_id
    }

    const applicant = await prisma.applicant.create({
      data: {
        name: parsedFields.data.name,
        email: normalizedEmail,
      },
    })
    applicantId = applicant.id

    if (resumeFile) {
      await uploadApplicantResume({
        applicantId: applicant.id,
        file: resumeFile,
        fileName: resumeFile.name,
        fileSize: resumeFile.size,
      })
    }

    return NextResponse.json(
      {
        applicant: {
          id: applicant.id,
          name: applicant.name,
          email: applicant.email,
          createdAt: applicant.createdAt.toISOString(),
        },
        temporaryPassword,
      },
      { status: 201 }
    )
  } catch (error) {
    if (applicantId) {
      try {
        await prisma.applicantResumeDetails.deleteMany({
          where: { applicantId },
        })
        await prisma.applicant.delete({ where: { id: applicantId } })
      } catch {
        console.error('Failed to roll back applicant record')
      }
    }

    if (auth0UserId) {
      await deleteAuth0User(auth0UserId)
    }

    if (error instanceof Auth0ManagementError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      )
    }

    console.error('Error creating applicant:', error)
    return NextResponse.json(
      { message: 'Failed to create applicant' },
      { status: 500 }
    )
  }
}
