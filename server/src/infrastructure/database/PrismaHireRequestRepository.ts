import { prisma } from './prisma';
import { IHireRequestRepository } from '../../domain/repositories/IHireRequestRepository';

export class PrismaHireRequestRepository implements IHireRequestRepository {
    async create(data: any): Promise<any> {
        return prisma.hireRequest.create({ data });
    }

    async findAll(): Promise<any[]> {
        return prisma.hireRequest.findMany();
    }

    // Encapsulating transaction logic here to keep Service clean of Prisma types
    async processDirectHire(data: any, extraData: any): Promise<any> {
        return prisma.$transaction(async (tx: any) => {
            const request = await tx.hireRequest.create({ data });

            const { projectId, rateType, rateAmount } = extraData;
            if (projectId && rateType && rateAmount) {
                const membership = await tx.projectMembership.findUnique({
                    where: { projectId_talentId: { projectId, talentId: data.matched_talent_id } }
                });

                if (!membership) {
                    await tx.projectMembership.create({
                        data: {
                            projectId,
                            talentId: data.matched_talent_id,
                            rateType,
                            rateAmount: parseFloat(rateAmount),
                            role: 'Hired Talent'
                        }
                    });
                }

                // Notifications logic handled here or return flags?
                // Legacy did it all in one block. We can just return 'success' or the created items.
                // Ideally we separate notification creation, but for atomicity with DB record creation, it fits here if using Prisma.
            }
            return request;
        });
    }

    async processAgencyHire(data: any, extraData: any): Promise<any> {
        return prisma.$transaction(async (tx: any) => {
            const request = await tx.hireRequest.create({ data });

            const { projectId } = extraData;
            if (projectId) {
                await tx.project.update({
                    where: { id: projectId },
                    data: { agencyId: data.matched_agency_id, assignedType: 'agency' }
                });
            }
            return request;
        });
    }
}
