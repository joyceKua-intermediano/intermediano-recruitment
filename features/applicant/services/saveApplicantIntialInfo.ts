'use server'

import prisma from '@/lib/prisma'

export async function saveApplicantInitialInfo(user: {
  name: string
  email: string
}) {
  try {
    const email = user.email.toLowerCase().trim()
    let existingUser = await prisma.applicant.findUnique({
      where: { email },
    })

    if (!existingUser) {
      existingUser = await prisma.applicant.create({
        data: {
          name: user.name,
          email,
        },
      })
    }

    return existingUser
  } catch (error) {
    console.error('Error saving user:', error)
    throw new Error('Failed to save user')
  }
}
