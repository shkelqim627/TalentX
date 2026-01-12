import { prisma } from './prisma';
import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';

export class PrismaAgencyRepository implements IAgencyRepository {
    async findAll(): Promise<any[]> {
        return prisma.agency.findMany({
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async findById(id: string): Promise<any | null> {
        return prisma.agency.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async findByUserId(userId: string): Promise<any | null> {
        return prisma.agency.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async update(id: string, data: any): Promise<any> {
        return prisma.agency.update({
            where: { id },
            data,
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }
}
