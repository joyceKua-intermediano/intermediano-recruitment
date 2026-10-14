import { z } from 'zod'

export const skillsExpertiseSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, 'Skill cannot be empty'),
      years: z
        .number()
        .min(1, 'Must have at least 1 year of experience')
        .max(50, 'Must be realistic'),
    })
  ),
})

export type Skill = z.infer<typeof skillsExpertiseSchema>['skills'][number]
export type SkillsExpertiseSchemaType = z.infer<typeof skillsExpertiseSchema> & { updatedAt?: string }

export type SkillsExpertiseWithId = SkillsExpertiseSchemaType & { applicantId: string }
