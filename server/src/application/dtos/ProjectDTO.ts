import { z } from 'zod';

export const CreateProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),

    // Admin/Client might pass these, or derived from context
    client_email: z.string().email().optional(),
    clientId: z.string().optional(),

    status: z.enum(['active', 'completed', 'pending', 'archived']).optional().default('active'),
    progress: z.number().optional().default(0),
    budget_spent: z.number().optional().default(0),
    total_budget: z.union([z.string(), z.number()]).optional(), // Legacy allows string parsing
    next_milestone: z.string().optional(),
    start_date: z.string().optional(), // Date string

    // Assignments (optional at creation)
    talentId: z.string().optional(),
    agencyId: z.string().optional()
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const RecordPaymentSchema = z.object({
    projectId: z.string(),
    talentId: z.string(),
    amount: z.number().min(1)
});

export const CompleteProjectSchema = z.object({
    rating: z.number().min(1).max(5),
    review: z.string().min(10)
});

export const ReleasePaymentSchema = z.object({
    projectId: z.string()
});

export type CreateProjectDTO = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof UpdateProjectSchema>;
export type RecordPaymentDTO = z.infer<typeof RecordPaymentSchema>;
export type CompleteProjectDTO = z.infer<typeof CompleteProjectSchema>;
export type ReleasePaymentDTO = z.infer<typeof ReleasePaymentSchema>;
