import { z } from 'zod'

export const languageLevels = [
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper-Intermediate',
  'Advanced',
  'Proficient',
  'Native'
] as const

export const professionalExperienceSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
})

export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  eqfLevel: z.string().optional(),
  fieldOfStudy: z.string().optional(),
})

export const certificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Certification title is required'),
  institution: z.string().min(1, 'Institution is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  content: z.string().optional(),
})

export const languageSkillSchema = z.object({
  id: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  listening: z.enum(languageLevels),
  reading: z.enum(languageLevels),
  writing: z.enum(languageLevels),
  speaking: z.enum(languageLevels),
  interaction: z.enum(languageLevels),
})

export const digitalSkillsSchema = z.object({
  software: z.array(z.string()).default([]),
  systems: z.array(z.string()).default([]),
  socialMedia: z.array(z.string()).default([]),
  hardSkills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
})

export const resumeBuilderSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  dateOfBirth: z.string().date().optional(),
  gender: z.string().min(1, 'Gender is required'),
  nationalities: z.array(z.string()).min(1, 'At least one nationality is required - press Enter to add'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  whatsapp: z.string().optional(),
  email: z.string().email('Invalid email address'),
  linkedin: z.string().optional(),
  availabilityToRelocate: z.boolean().default(false),
  relocationCountries: z.array(z.string()).default([]),

  careerSummary: z.string().min(1, 'Career summary is required'),

  professionalExperience: z.array(professionalExperienceSchema).default([]),

  education: z.array(educationSchema).default([]),

  certifications: z.array(certificationSchema).default([]),

  languageSkills: z.array(languageSkillSchema).default([]),

  digitalSkills: digitalSkillsSchema,

  availabilityToTravel: z.boolean().default(false),
  travelFrequency: z.string().optional(),
  salaryExpectation: z.string().optional(),
  areasOfInterest: z.array(z.string()).default([]),
})

export type ResumeBuilderFormSchemaType = z.infer<typeof resumeBuilderSchema>
export type ProfessionalExperience = z.infer<typeof professionalExperienceSchema>
export type Education = z.infer<typeof educationSchema>
export type Certification = z.infer<typeof certificationSchema>
export type LanguageSkill = z.infer<typeof languageSkillSchema>
export type DigitalSkills = z.infer<typeof digitalSkillsSchema>
export type LanguageLevel = typeof languageLevels[number]
