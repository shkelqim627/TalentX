import { prisma } from './prisma';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class PrismaTaskRepository implements ITaskRepository {
    async create(data: any): Promise<any> {
        return prisma.task.create({
            data,
            include: { project: true }
        });
    }

    async update(id: string, data: any): Promise<any> {
        return prisma.task.update({
            where: { id },
            data,
            include: { project: true }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.task.delete({ where: { id } });
    }

    async findById(id: string): Promise<any | null> {
        return prisma.task.findUnique({
            where: { id },
            include: { project: true }
        });
    }

    async findAllByProject(projectId?: string): Promise<any[]> {
        return prisma.task.findMany({
            where: projectId ? { projectId } : {},
            include: {
                assignee: {
                    select: {
                        id: true,
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }
}
