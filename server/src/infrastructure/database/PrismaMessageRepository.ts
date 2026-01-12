import { prisma } from './prisma';
import { IMessageRepository } from '../../domain/repositories/IMessageRepository';

export class PrismaMessageRepository implements IMessageRepository {
    async create(data: any): Promise<any> {
        return prisma.message.create({
            data,
            include: {
                sender: {
                    select: {
                        id: true,
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
        });
    }

    async findSupportThreads(supportId: string): Promise<any[]> {
        return prisma.message.findMany({
            where: { receiverId: supportId },
            distinct: ["senderId"],
            include: { sender: true },
            orderBy: [
                { senderId: "asc" },
                { timestamp: "desc" }
            ],
        });
    }

    async findSupportMessages(userId: string, supportId: string): Promise<any[]> {
        return prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: supportId },
                    { senderId: supportId, receiverId: userId },
                ],
            },
            include: { sender: true },
            orderBy: { timestamp: "asc" },
        });
    }

    async findDirectMessages(userId: string, receiverId: string): Promise<any[]> {
        return prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: userId },
                ],
            },
            include: { sender: true },
            orderBy: { timestamp: "asc" },
        });
    }

    async countUnread(userId: string, supportId: string): Promise<{ general: number, support: number }> {
        // General: receiver is user, sender NOT support
        const general = await prisma.message.count({
            where: {
                receiverId: userId,
                read: false,
                NOT: [
                    { senderId: supportId },
                    { receiverId: supportId } // receiver check redundant if receiverId is user? Legacy had it.
                ]
            }
        });

        // Support: receiver is user, sender IS support
        const support = await prisma.message.count({
            where: {
                receiverId: userId,
                read: false,
                senderId: supportId
            }
        });

        return { general, support };
    }

    async countUnreadForAdmin(supportId: string): Promise<{ general: number, support: number }> {
        // General for Admin: receiver is admin, sender NOT support? 
        // Legacy logic for admin unread:
        // supportCount = receiver is supportId, read: false, sender NOT supportId (basically users messaging support)

        const support = await prisma.message.count({
            where: {
                receiverId: supportId,
                read: false,
                senderId: { not: supportId }
            }
        });

        // General for admin? Legacy code implies ONLY support count matters or logic is same?
        // Legacy getUnreadCount has 2 promises.
        // For admin:
        // 1. General (legacy line 78): receiverId = userData.id (admin's id). 
        const general = await prisma.message.count({
            where: {
                receiverId: "admin-id-placeholder", // We need admin's real ID passed to method
                // Wait, legacy passes userData.id.
                // So we need to accept userId in this method too.
                // Refactoring interface signature slightly to accommodate both
                read: false,
                // ... same exclusions
            }
        });
        return { general: 0, support }; // Placeholder, logic moved to service for flexible calling
    }

    // Consolidated Unread Count logic to match legacy flexibility
    async countUnreadLegacy(userId: string, supportId: string, isAdmin: boolean): Promise<{ general: number, support: number }> {
        const [general, support] = await Promise.all([
            // General messages (exclude support flows)
            prisma.message.count({
                where: {
                    receiverId: userId,
                    read: false,
                    NOT: [
                        { senderId: supportId },
                        { receiverId: supportId },
                    ],
                },
            }),
            // Support messages
            prisma.message.count({
                where: {
                    receiverId: isAdmin ? supportId : userId,
                    read: false,
                    senderId: isAdmin ? { not: supportId } : supportId,
                },
            }),
        ]);
        return { general, support };
    }


    async updateReadStatus(where: any): Promise<void> {
        await prisma.message.updateMany({
            where,
            data: { read: true }
        });
    }

    async deleteOldMessages(olderThan: Date, supportId: string): Promise<number> {
        const result = await prisma.message.deleteMany({
            where: {
                OR: [
                    { receiverId: supportId },
                    { senderId: supportId },
                ],
                timestamp: {
                    lt: olderThan,
                },
            },
        });
        return result.count;
    }
}
