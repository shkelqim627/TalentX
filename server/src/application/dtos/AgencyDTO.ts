import { z } from 'zod';

export const UpdateAgencySchema = z.object({
    agency_name: z.string().optional(),
    team_size: z.union([z.string(), z.number()]).optional(),
    description: z.string().optional(),
    services: z.union([z.string(), z.array(z.string())]).optional(),
    industry_focus: z.union([z.string(), z.array(z.string())]).optional(),
    coordinates: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

export type UpdateAgencyDTO = z.infer<typeof UpdateAgencySchema>;
