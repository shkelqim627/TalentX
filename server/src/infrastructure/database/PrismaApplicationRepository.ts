import { prisma } from './prisma';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/entities/Application';

export class PrismaApplicationRepository implements IApplicationRepository {
    // Helper to map Prisma result to Domain Entity if fields differ exactly, 
    // but they seem to match 1:1 based on my review.
    // Prisma types are generated globally, so I can cast or map.

    async create(data: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application> {
        const created = await prisma.application.create({
            data: {
                ...data,
                skills: data.skills || null, // handle optional -> nullable
            } as any // flexible casting for now, ideally we use Prisma types
        });
        return created as unknown as Application;
    }

    async findById(id: string): Promise<Application | null> {
        const found = await prisma.application.findUnique({ where: { id } });
        if (!found) return null;
        return found as unknown as Application;
    }

    async findAll(): Promise<Application[]> {
        const all = await prisma.application.findMany({ orderBy: { applied_at: 'desc' } });
        return all as unknown as Application[];
    }

    async updateStatus(id: string, status: Application['status']): Promise<Application> {
        const updated = await prisma.application.update({
            where: { id },
            data: { status }
        });
        return updated as unknown as Application;
    }

    async delete(id: string): Promise<void> {
        await prisma.application.delete({ where: { id } });
    }
}
