import { z } from 'zod';

export const CreateTaskSchema = z.object({
    project_id: z.string().min(1, "Project ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(['todo', 'in_progress', 'review', 'done']).optional().default('todo'),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    due_date: z.string().optional(),
    assignee_id: z.string().optional()
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
