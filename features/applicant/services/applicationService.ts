'use server'
import prisma from '@/lib/prisma'

export interface CreateApplicationData {
  applicantId: string
  jobId: string
}

export interface ApplicationResult {
  success: boolean
  message: string
  isDuplicate?: boolean
  application?: any
}

export const createApplication = async (data: CreateApplicationData): Promise<ApplicationResult> => {
  try {

    const existingApplication = await prisma.application.findFirst({
      where: {
        applicantId: data.applicantId,
        jobId: data.jobId,
      },
    })

    if (existingApplication) {
      return {
        success: true,
        message: 'You have already applied for this job. Please wait for our email regarding the next steps.',
        isDuplicate: true,
        application: existingApplication
      }
    }

    const application = await prisma.application.create({
      data: {
        applicantId: data.applicantId,
        jobId: data.jobId,
        status: 'applied',
      },
      include: {
        applicant: true,
        job: true,
      },
    })

    return {
      success: true,
      message: 'Application submitted successfully!',
      application: application
    }
  } catch (error) {
    console.error('Error creating application:', error)
    throw error
  }
}
