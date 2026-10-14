'use server'
import prisma from '@/lib/prisma'
import { BasicInformationFormSchemaType } from '../schemas/basicInformationSchema'

export const saveApplicantWithInformation = async (
  data: BasicInformationFormSchemaType & { email: string }
) => {
  const email = data.email.toLowerCase().trim()
  const informationData = {
    mobile: parseInt(data.mobile),
    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    city: data.city,
    country: data.country,
  }

  const applicant = await prisma.applicant.findUnique({
    where: { email },
  })

  if (!applicant) {
    return await prisma.applicant.create({
      data: {
        name: data.name,
        email,
        information: {
          create: informationData,
        },
      },
      include: {
        information: true,
      },
    })
  }

  return await prisma.applicant.update({
    where: { email },
    data: {
      name: data.name,
      information: {
        upsert: {
          where: { applicantId: applicant.id },
          create: informationData,
          update: informationData,
        },
      },
    },
    include: {
      information: true,
    },
  })
}
