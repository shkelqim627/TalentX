import { z } from 'zod';

export const CreateHireRequestSchema = z.object({
    client_name: z.string().min(1, "Client Name is required"),
    client_email: z.string().email("Invalid email"),
    company_name: z.string().optional(),
    hire_type: z.string(), // 'individual' | 'team' | 'agency' etc.
    category: z.string().optional(),
    project_description: z.string().optional(),
    budget: z.string().optional(),
    timeline: z.string().optional(),

    // Direct Hire Extensions
    matched_talent_id: z.string().optional(),
    matched_agency_id: z.string().optional(),
    data: z.string().optional(), // Metadata key from legacy, often contains projectID etc encoded JSON
});

export type CreateHireRequestDTO = z.infer<typeof CreateHireRequestSchema>;
