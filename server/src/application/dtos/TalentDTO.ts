import { z } from 'zod';

export const UpdateTalentSchema = z.object({
    title: z.string().optional(),
    category: z.string().optional(),
    expertise: z.union([z.string(), z.array(z.string())]).optional(),
    skills: z.union([z.string(), z.array(z.string())]).optional(),
    previous_companies: z.union([z.string(), z.array(z.any())]).optional(), // Should refine 'any' to specific structure
    experience_years: z.number().optional(),
    availability: z.string().optional(),
    hourly_rate: z.number().optional(),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

export type UpdateTalentDTO = z.infer<typeof UpdateTalentSchema>;
