import { z } from 'zod';

export const UpdateUserSchema = z.object({
    full_name: z.string().optional(),

    // Talent Specific (for now simpler to keep here or split?)
    // Legacy userController handled everything via generic updates often, 
    // but let's be specific.
    title: z.string().optional(),
    category: z.string().optional(),
    experience_years: z.number().optional(),
    skills: z.union([z.string(), z.array(z.string())]).optional(), // Handle stringified JSON or array
    expertise: z.union([z.string(), z.array(z.string())]).optional(),

    // Agency Specific
    agency_name: z.string().optional(),
    team_size: z.union([z.string(), z.number()]).optional(),

    // Common
    resume_url: z.string().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
