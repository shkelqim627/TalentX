import { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateMessageDTO } from '../dtos/MessageDTO';

export class MessageService {
    private static SUPPORT_ID = "support-system-user-id-001";

    constructor(
        private messageRepo: IMessageRepository,
        private notificationRepo: INotificationRepository,
        private userRepo: IUserRepository // To find admins for notifications
    ) { }

    private formatMessage(m: any) {
        return {
            ...m,
            sender_name:
                m.senderId === MessageService.SUPPORT_ID
                    ? "Admin Support"
                    : m.sender?.full_name || "System",
            sender_avatar:
                m.senderId === MessageService.SUPPORT_ID
                    ? "https://ui-avatars.com/api/?name=Admin+Support&background=00c853&color=fff"
                    : m.sender?.avatar_url,
        };
    }

    private formatThreads(threads: any[]) {
        return threads.map((t) => ({
            userId: t.senderId,
            userName: t.sender?.full_name || "Unknown User",
            userAvatar: t.sender?.avatar_url || null,
            lastMessage: t.content,
            time: t.timestamp,
        }));
    }

    async listMessages(userId: string, role: string, query: any) {
        const isSupport = query.isSupport === 'true';
        const targetQueryId = query.userId || query.threadUserId || query.receiverID;

        if (isSupport && role === 'admin' && query.type === 'threads') {
            const threads = await this.messageRepo.findSupportThreads(MessageService.SUPPORT_ID);
            return this.formatThreads(threads);
        }

        if (isSupport) {
            const targetId = (role === 'admin' && targetQueryId) ? targetQueryId : userId;
            const messages = await this.messageRepo.findSupportMessages(targetId, MessageService.SUPPORT_ID);
            return messages.map(m => this.formatMessage(m));
        }

        // Direct Messages
        if (!targetQueryId) {
            // Return empty or list of recent chats? For now, empty to avoid 500
            return [];
        }
        const messages = await this.messageRepo.findDirectMessages(userId, targetQueryId);
        return messages.map(m => this.formatMessage(m));
    }

    async createMessage(senderId: string, role: string, dto: CreateMessageDTO) {
        const isSupport = dto.isSupport === true || dto.isSupport === "true";

        const actualSenderId = isSupport && role === "admin" ? MessageService.SUPPORT_ID : senderId;
        const actualReceiverId = isSupport && role !== "admin" ? MessageService.SUPPORT_ID : dto.receiver_id;

        const message = await this.messageRepo.create({
            senderId: actualSenderId,
            receiverId: actualReceiverId,
            content: dto.content
        });

        // Notifications
        if (isSupport && role !== "admin") {
            // Notify all admins
            const admins = await (this.userRepo as any).findAll();
            const adminUsers = (admins as any[]).filter(u => u.role === 'admin');

            for (const admin of adminUsers) {
                await this.notificationRepo.create({
                    userId: admin.id,
                    type: "support_ticket",
                    content: `New support ticket: "${dto.content.substring(0, 30)}..."`,
                    data: JSON.stringify({ senderId, messageId: message.id })
                });
            }
        }

        return this.formatMessage(message);
    }

    async getUnreadCount(userId: string, role: string) {
        return this.messageRepo.countUnreadLegacy(userId, MessageService.SUPPORT_ID, role === 'admin');
    }

    async markAsRead(userId: string, role: string, dto: any) {
        const { isSupport, threadUserId } = dto;
        let where: any = { read: false };

        if (isSupport) {
            if (role === "admin") {
                where = {
                    ...where,
                    senderId: threadUserId,
                    receiverId: MessageService.SUPPORT_ID,
                };
            } else {
                where = {
                    ...where,
                    senderId: MessageService.SUPPORT_ID,
                    receiverId: userId,
                };
            }
        } else {
            where = {
                ...where,
                receiverId: userId,
                NOT: [
                    { senderId: MessageService.SUPPORT_ID },
                    { receiverId: MessageService.SUPPORT_ID },
                ],
            };
        }

        await this.messageRepo.updateReadStatus(where);
        return { success: true };
    }
}
