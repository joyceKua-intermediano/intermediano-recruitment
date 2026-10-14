import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth0 } from '@/lib/auth0'
import { resumeBuilderSchema, ResumeBuilderFormSchemaType } from '@/features/applicant/schemas/resumeBuilderSchema'

export async function POST(request: Request) {
  try {

    const session = await auth0.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const validatedData = resumeBuilderSchema.parse(body)
    const applicant = await prisma.applicant.findFirst({
      where: {
        email: session.user.email
      }
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    const resumeData = await prisma.resumeData.upsert({
      where: {
        applicantId: applicant.id
      },
      update: {
        fullName: validatedData.fullName,
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth).toISOString()
          : undefined,
        gender: validatedData.gender,
        nationalities: validatedData.nationalities,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        phoneNumber: validatedData.phoneNumber,
        whatsapp: validatedData.whatsapp,
        email: validatedData.email,
        linkedin: validatedData.linkedin,
        availabilityToRelocate: validatedData.availabilityToRelocate,
        relocationCountries: validatedData.relocationCountries,
        careerSummary: validatedData.careerSummary,
        professionalExperience: validatedData.professionalExperience,
        education: validatedData.education,
        certifications: validatedData.certifications,
        languageSkills: validatedData.languageSkills,
        digitalSkills: validatedData.digitalSkills,
        availabilityToTravel: validatedData.availabilityToTravel,
        travelFrequency: validatedData.travelFrequency,
        salaryExpectation: validatedData.salaryExpectation,
        areasOfInterest: validatedData.areasOfInterest,
        updatedAt: new Date()
      },
      create: {
        applicantId: applicant.id,
        fullName: validatedData.fullName,
        dateOfBirth: validatedData.dateOfBirth
          ? new Date(validatedData.dateOfBirth).toISOString()
          : '',
        gender: validatedData.gender,
        nationalities: validatedData.nationalities,
        address: validatedData.address,
        city: validatedData.city,
        country: validatedData.country,
        phoneNumber: validatedData.phoneNumber,
        whatsapp: validatedData.whatsapp,
        email: validatedData.email,
        linkedin: validatedData.linkedin,
        availabilityToRelocate: validatedData.availabilityToRelocate,
        relocationCountries: validatedData.relocationCountries,
        careerSummary: validatedData.careerSummary,
        professionalExperience: validatedData.professionalExperience,
        education: validatedData.education,
        certifications: validatedData.certifications,
        languageSkills: validatedData.languageSkills,
        digitalSkills: validatedData.digitalSkills,
        availabilityToTravel: validatedData.availabilityToTravel,
        travelFrequency: validatedData.travelFrequency,
        salaryExpectation: validatedData.salaryExpectation,
        areasOfInterest: validatedData.areasOfInterest
      }
    })

    return NextResponse.json({
      success: true,
      data: resumeData
    })
  } catch (error) {
    console.error('Error saving resume data:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data format', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth0.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const applicant = await prisma.applicant.findFirst({
      where: {
        email: session.user.email
      }
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    const resumeData = await prisma.resumeData.findUnique({
      where: {
        applicantId: applicant.id
      }
    })

    if (!resumeData) {
      return NextResponse.json({
        success: true,
        data: null
      })
    }

    const transformedData: ResumeBuilderFormSchemaType = {
      fullName: resumeData.fullName,
      dateOfBirth: resumeData.dateOfBirth
        ? new Date(resumeData.dateOfBirth).toISOString().split('T')[0]
        : undefined,
      gender: resumeData.gender,
      nationalities: resumeData.nationalities,
      address: resumeData.address,
      city: resumeData.city,
      country: resumeData.country,
      phoneNumber: resumeData.phoneNumber,
      whatsapp: resumeData.whatsapp || '',
      email: resumeData.email,
      linkedin: resumeData.linkedin || '',
      availabilityToRelocate: resumeData.availabilityToRelocate ?? false,
      relocationCountries: resumeData.relocationCountries,
      careerSummary: resumeData.careerSummary,
      professionalExperience: resumeData.professionalExperience as any,
      education: resumeData.education as any,
      certifications: resumeData.certifications as any,
      languageSkills: resumeData.languageSkills as any,
      digitalSkills: resumeData.digitalSkills as any,
      availabilityToTravel: resumeData.availabilityToTravel ?? false,
      travelFrequency: resumeData.travelFrequency || '',
      salaryExpectation: resumeData.salaryExpectation || '',
      areasOfInterest: resumeData.areasOfInterest || []
    }

    return NextResponse.json({
      success: true,
      data: transformedData
    })
  } catch (error) {
    console.error('Error fetching resume data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
