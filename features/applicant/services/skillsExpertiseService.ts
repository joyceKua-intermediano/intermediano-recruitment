'use server'
import prisma from '@/lib/prisma'
import { SkillsExpertiseSchemaType } from '../schemas/skillsExpertiseSchema'

export const saveApplicantSkillExpertise = async (
  data: SkillsExpertiseSchemaType & { applicantId: string }
) => {
  return await prisma.applicantSkillsExpertise.upsert({
    where: { applicantId: data.applicantId },
    update: {
      skills: data.skills, 
      updatedAt: new Date(), 
    },
    create: {
      ...data, 
    },
  })
}
