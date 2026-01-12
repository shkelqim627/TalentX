import { z } from 'zod';

export const CreateApplicationSchema = z.object({
    full_name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email"),
    role: z.enum(['talent', 'agency']),
    password: z.string().optional(), // Not stored, but incoming

    // Talent
    title: z.string().optional(),
    category: z.string().optional(),
    experience: z.string().optional(), // Incoming as string sometimes
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),

    // Agency
    agency_name: z.string().optional(),
    team_size: z.string().optional(),
    company_website: z.string().optional(),
    linkedin_company_page: z.string().optional(),
    founded_year: z.string().optional(),
});

export type CreateApplicationDTO = z.infer<typeof CreateApplicationSchema>;
