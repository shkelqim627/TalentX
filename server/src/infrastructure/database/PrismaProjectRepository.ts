import { prisma } from './prisma';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';

export class PrismaProjectRepository implements IProjectRepository {

    private defaultInclude = {
        talent: { include: { user: true } },
        team: true,
        assignedAgency: { include: { user: true } },
        memberships: { include: { talent: { include: { user: true } } } },
        tasks: true // Included for getProject but maybe not lists? Legacy included it for getProject only mostly
    };

    async create(data: any): Promise<any> {
        return prisma.project.create({ data });
    }

    async update(id: string, data: any): Promise<any> {
        return prisma.project.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await prisma.project.delete({ where: { id } });
    }

    async findById(id: string): Promise<any | null> {
        return prisma.project.findUnique({
            where: { id },
            include: this.defaultInclude as any
        });
    }

    async findAllByRole(userId: string, role: string): Promise<any[]> {
        let whereClause: any = {};

        if (role === 'admin') {
            whereClause = {};
        } else if (role === 'talent') {
            const talent = await prisma.talent.findUnique({ where: { userId } as any });
            whereClause = {
                OR: [
                    { talentId: talent?.id },
                    { memberships: { some: { talentId: talent?.id } } }
                ]
            };
        } else if (role === 'agency') {
            const agency = await prisma.agency.findUnique({ where: { userId } as any });
            whereClause = { agencyId: agency?.id };
        } else {
            // Client
            whereClause = { clientId: userId };
        }

        return prisma.project.findMany({
            where: whereClause,
            include: this.defaultInclude as any // Legacy cast to any for complex includes
        });
    }

    async findAll(filters: any): Promise<any[]> {
        return prisma.project.findMany({
            where: filters,
            include: this.defaultInclude as any
        });
    }

    async findByIdForPayment(projectId: string, talentId: string, clientId: string): Promise<any | null> {
        return prisma.project.findUnique({
            where: { id: projectId },
            include: { memberships: { where: { talentId } } }
        });
    }
}
