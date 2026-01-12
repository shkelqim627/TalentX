import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email("Invalid email").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
    full_name: z.string().min(1, "Full Name is required").max(100),
    role: z.enum(['client', 'talent', 'agency', 'admin']),

    // Optional / Role Specific
    company_name: z.string().optional(),
    title: z.string().optional(),
    category: z.string().optional(),
    expertise: z.string().optional(), // JSON string or array? Legacy seems to handle strings for JSON
    agency_name: z.string().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
