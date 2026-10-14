'use server'
import prisma from '@/lib/prisma'

interface saveApplicantResumeProps {
  applicantId: string
  fileName: string
  fileSize: number
}

export const saveResumeDetails = async (data: saveApplicantResumeProps) => {
  return await prisma.applicantResumeDetails.upsert({
    where: {
      applicantId: data.applicantId
    },
    update: {
      fileName: data.fileName,
      fileSize: data.fileSize
    },
    create: data
  })
}
