import { z } from 'zod'

export const basicInformationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
  mobile: z
    .string()
    .regex(/^\d+$/, 'Phone must be a number')
    .min(1, 'Phone is required')
    .max(15, 'Phone must be under 15 digits'),
  birthDate: z.string().date().optional().nullable(),
  city: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
  country: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be under 50 characters'),
})

export const basicInformationWithMetadataSchema = basicInformationSchema.extend({
  id: z.string().uuid(),
  updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
});

export type BasicInformationFormSchemaType = z.infer<typeof basicInformationSchema>;

export type BasicInformationWithMetadata = z.infer<typeof basicInformationWithMetadataSchema>;
