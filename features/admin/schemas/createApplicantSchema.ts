import { z } from 'zod'

export const createApplicantFieldsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().trim().email('A valid email is required').optional()
  ),
})

export const adminCreateApplicationSchema = z.object({
  applicantId: z.string().min(1, 'Applicant ID is required'),
  jobId: z.string().min(1, 'Job ID is required'),
})

export type CreateApplicantFields = z.infer<typeof createApplicantFieldsSchema>
export type AdminCreateApplicationInput = z.infer<
  typeof adminCreateApplicationSchema
>
