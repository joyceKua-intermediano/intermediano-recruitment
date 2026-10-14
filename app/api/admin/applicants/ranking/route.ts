import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/verifyAdminAccess'

interface RankingCriteria {
  skillMatch: number
  experienceLevel: number
  resumeCompleteness: number
  applicationRecency: number
  totalScore: number
}

interface RankedApplicant {
  id: string
  name: string
  email: string | null
  mobile: string
  city: string
  country: string
  avatar?: string
  skills: Array<{ name: string; years: number }>
  resumeFileName?: string
  resumeFileSize?: number
  createdAt: string
  applications: Array<{
    id: string
    jobId: string
    jobTitle: string
    status: string
    appliedAt: string
    lastUpdated: string
    jobLocation?: string
    jobType?: string
    jobIsActive?: boolean
  }>
  ranking: RankingCriteria
  jobMatchScore?: number
}

function calculateSkillMatch(
  applicantSkills: Array<{ name: string; years: number }>,
  jobSkills: string[]
): number {
  if (!applicantSkills.length || !jobSkills.length) return 0

  const normalizedApplicantSkills = applicantSkills.map((skill) =>
    skill.name.toLowerCase().trim()
  )
  const normalizedJobSkills = jobSkills.map((skill) =>
    skill.toLowerCase().trim()
  )

  let totalMatch = 0
  let totalWeight = 0

  for (const jobSkill of normalizedJobSkills) {
    let bestMatch = 0
    let bestWeight = 1

    for (const applicantSkill of normalizedApplicantSkills) {
      if (applicantSkill === jobSkill) {
        bestMatch = 1
        bestWeight = 1.5
        break
      }

      if (
        applicantSkill.includes(jobSkill) ||
        jobSkill.includes(applicantSkill)
      ) {
        const matchScore =
          Math.min(applicantSkill.length, jobSkill.length) /
          Math.max(applicantSkill.length, jobSkill.length)
        if (matchScore > bestMatch) {
          bestMatch = matchScore * 0.8
          bestWeight = 1.2
        }
      }
    }

    totalMatch += bestMatch * bestWeight
    totalWeight += bestWeight
  }

  return totalWeight > 0 ? (totalMatch / totalWeight) * 100 : 0
}

function calculateExperienceLevel(
  applicantSkills: Array<{ name: string; years: number }>
): number {
  if (!applicantSkills.length) return 0

  const totalYears = applicantSkills.reduce(
    (sum, skill) => sum + skill.years,
    0
  )
  const averageYears = totalYears / applicantSkills.length

  if (averageYears >= 5) return 100
  if (averageYears >= 3) return 80
  if (averageYears >= 2) return 60
  if (averageYears >= 1) return 40
  return 20
}

function calculateResumeCompleteness(applicant: any): number {
  let score = 0
  const maxScore = 100

  // Basic information (30 points)
  if (applicant.name) score += 10
  if (applicant.email) score += 10
  if (applicant.mobile) score += 5
  if (applicant.city && applicant.country) score += 5

  // Skills (40 points)
  if (applicant.skills && applicant.skills.length > 0) {
    score += Math.min(40, applicant.skills.length * 8) // 8 points per skill, max 40
  }

  // Resume file (30 points)
  if (applicant.resumeFileName) {
    score += 30
  }

  return Math.min(score, maxScore)
}

function calculateApplicationRecency(applications: any[]): number {
  if (!applications.length) return 0

  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

  const recentCount = applications.reduce((count, app) => {
    const appliedDate = new Date(app.appliedAt).getTime()
    return now - appliedDate <= THIRTY_DAYS ? count + 1 : count
  }, 0)

  return Math.min(100, recentCount * 20)
}

function calculateRanking(applicant: any, job?: any): RankingCriteria {
  const skillMatch = job
    ? calculateSkillMatch(applicant.skills, job.essentialSkills)
    : 0
  const experienceLevel = calculateExperienceLevel(applicant.skills)
  const resumeCompleteness = calculateResumeCompleteness(applicant)
  const applicationRecency = calculateApplicationRecency(applicant.applications)

  const totalScore =
    skillMatch * 0.45 +
    experienceLevel * 0.35 +
    resumeCompleteness * 0.15 +
    applicationRecency * 0.05

  return {
    skillMatch: Math.round(skillMatch),
    experienceLevel: Math.round(experienceLevel),
    resumeCompleteness: Math.round(resumeCompleteness),
    applicationRecency: Math.round(applicationRecency),
    totalScore: Math.round(totalScore),
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {

    const adminResult = await verifyAdminAccess(request)
    if (!adminResult.success) {
      console.error('Admin verification failed:', adminResult.error)
      return NextResponse.json(
        { error: `Admin access denied: ${adminResult.error}` },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100) // Cap at 100 for performance
    const sortBy = searchParams.get('sortBy') || 'totalScore'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const useCache = searchParams.get('useCache') !== 'false' // Enable caching by default

    let job = null
    if (jobId && jobId !== 'all') {
      try {
        job = await prisma.job.findUnique({
          where: { id: jobId },
          select: {
            id: true,
            title: true,
            essentialSkills: true,
            category: true,
            location: true,
            type: true,
          },
        })
        if (!job) {
          console.warn(`Job not found: ${jobId}`)
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      }
    }

    const whereConditions: any = {}

    if (jobId && jobId !== 'all') {
      whereConditions.applications = {
        some: {
          jobId: jobId,
        },
      }
    }

    const skip = (page - 1) * limit

    const applicants = await prisma.applicant.findMany({
      where: whereConditions,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        information: {
          select: {
            mobile: true,
            city: true,
            country: true,
            birthDate: true,
          },
        },
        applications: {
          select: {
            id: true,
            jobId: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            job: {
              select: {
                id: true,
                title: true,
                location: true,
                type: true,
                isActive: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const totalCount = await prisma.applicant.count({
      where: whereConditions,
    })

    const applicantIds = applicants.map((app) => app.id)

    const skillsData = await prisma.applicantSkillsExpertise.findMany({
      where: { applicantId: { in: applicantIds } },
    })

    const resumeData = await prisma.applicantResumeDetails.findMany({
      where: { applicantId: { in: applicantIds } },
    })

    const rankedApplicants: RankedApplicant[] = applicants.map((applicant) => {
      const applicantSkills = skillsData.find(
        (s) => s.applicantId === applicant.id
      )
      const applicantResume = resumeData.find(
        (r) => r.applicantId === applicant.id
      )
      const information = applicant.information[0]

      let parsedSkills: Array<{ name: string; years: number }> = []
      if (applicantSkills?.skills) {
        try {
          parsedSkills = JSON.parse(JSON.stringify(applicantSkills.skills))
        } catch (error) {
          console.error(`Error parsing skills for ${applicant.name}:`, error)
          parsedSkills = []
        }
      }

      const transformedApplicant = {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        mobile: information?.mobile?.toString() || '',
        city: information?.city || '',
        country: information?.country || '',
        avatar: undefined,
        skills: parsedSkills,
        resumeFileName: applicantResume?.fileName,
        resumeFileSize: applicantResume?.fileSize,
        createdAt: applicant.createdAt.toISOString(),
        applications: applicant.applications.map((app) => ({
          id: app.id,
          jobId: app.jobId,
          jobTitle: app.job.title,
          status: app.status,
          appliedAt: app.createdAt.toISOString(),
          lastUpdated: app.updatedAt.toISOString(),
          jobLocation: app.job.location,
          jobType: app.job.type,
          jobIsActive: app.job.isActive,
        })),
      }

      const ranking = calculateRanking(transformedApplicant, job)
      const jobMatchScore = job
        ? calculateSkillMatch(transformedApplicant.skills, job.essentialSkills)
        : undefined
      return {
        ...transformedApplicant,
        ranking,
        jobMatchScore,
      }
    })

    rankedApplicants.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case 'skillMatch':
          aValue = a.ranking.skillMatch
          bValue = b.ranking.skillMatch
          break
        case 'experienceLevel':
          aValue = a.ranking.experienceLevel
          bValue = b.ranking.experienceLevel
          break
        case 'resumeCompleteness':
          aValue = a.ranking.resumeCompleteness
          bValue = b.ranking.resumeCompleteness
          break
        case 'applicationRecency':
          aValue = a.ranking.applicationRecency
          bValue = b.ranking.applicationRecency
          break
        case 'jobMatchScore':
          aValue = a.jobMatchScore || 0
          bValue = b.jobMatchScore || 0
          break
        default:
          aValue = a.ranking.totalScore
          bValue = b.ranking.totalScore
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })

    const totalPages = Math.ceil(totalCount / limit)

    const response = NextResponse.json({
      applicants: rankedApplicants,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
      job: job,
      rankingCriteria: {
        skillMatch: 'Skills matching job requirements (45% weight)',
        experienceLevel: 'Overall experience level (35% weight)',
        resumeCompleteness: 'Profile and resume completeness (15% weight)',
        applicationRecency: 'Recent application activity (5% weight)',
      },
      performance: {
        processingTime: Date.now() - startTime,
        totalApplicants: rankedApplicants.length,
        cacheEnabled: useCache,
      },
    })

    if (useCache) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=300, stale-while-revalidate=600'
      ) // 5 min cache, 10 min stale
      response.headers.set(
        'ETag',
        `"${jobId || 'all'}-${page}-${limit}-${sortBy}-${sortOrder}"`
      )
    }

    return response
  } catch (error) {
    console.error('❌ Error fetching ranked applicants:', error)

    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })

      if (
        error.message.includes('Response from the Engine was empty') ||
        error.message.includes('connect ECONNREFUSED') ||
        error.message.includes('MongoNetworkError')
      ) {
        return NextResponse.json(
          {
            error:
              'Database connection failed. Please check if MongoDB is running and accessible.',
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: `Failed to fetch ranked applicants: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch ranked applicants: Unknown error' },
      { status: 500 }
    )
  }
}
