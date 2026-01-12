import { z } from 'zod';

export const GenerateTeamSchema = z.object({
    skills: z.union([z.string(), z.array(z.string())]),
    team_size: z.number().optional().default(3)
});

export const HireTeamSchema = z.object({
    projectId: z.string(),
    talentIds: z.array(z.string())
});

export type GenerateTeamDTO = z.infer<typeof GenerateTeamSchema>;
export type HireTeamDTO = z.infer<typeof HireTeamSchema>;
