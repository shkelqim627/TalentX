import { PrismaClient } from '@prisma/client';

export class AuditLogService {
    constructor(private prisma: PrismaClient) { }

    async logAction(adminId: string | null, action: string, entityType: string, entityId?: string, details?: any) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    adminId,
                    action,
                    entityType,
                    entityId,
                    details: details ? JSON.stringify(details) : null
                }
            });
        } catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }

    async listLogs(filters: { entityType?: string; startDate?: string; endDate?: string } = {}) {
        const where: any = {};

        if (filters.entityType && filters.entityType !== 'all') {
            where.entityType = filters.entityType;
        }

        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                where.createdAt.lte = end;
            }
        }

        return this.prisma.auditLog.findMany({
            where,
            include: {
                admin: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 200 // Increased limit
        });
    }
}
