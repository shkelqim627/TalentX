import { prisma } from './prisma';
import { ITeamRepository } from '../../domain/repositories/ITeamRepository';

export class PrismaTeamRepository implements ITeamRepository {
    async findAll(): Promise<any[]> {
        return prisma.team.findMany({
            include: { members: { include: { talent: { include: { user: true } } } } }
        });
    }

    async findById(id: string): Promise<any | null> {
        return prisma.team.findUnique({
            where: { id },
            include: { members: { include: { talent: { include: { user: true } } } } }
        });
    }

    async findTalentsBySkills(skills: string[], limit: number): Promise<any[]> {
        const whereClause = skills.length > 0 ? {
            OR: skills.map((skill: string) => ({
                skills: {
                    contains: skill,
                    mode: 'insensitive',
                },
            })),
        } : {};

        return prisma.talent.findMany({
            where: whereClause as any,
            include: {
                user: {
                    select: {
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
            take: limit
        });
    }

    async addProjectMembership(data: any): Promise<any> {
        return prisma.projectMembership.create({ data });
    }

    async findProjectMembership(projectId: string, talentId: string): Promise<any | null> {
        return prisma.projectMembership.findUnique({
            where: { projectId_talentId: { projectId, talentId } }
        });
    }
}
