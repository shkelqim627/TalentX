export interface IMessageRepository {
    create(data: any): Promise<any>;
    findSupportThreads(supportId: string): Promise<any[]>;
    findSupportMessages(userId: string, supportId: string): Promise<any[]>;
    findDirectMessages(userId: string, receiverId: string): Promise<any[]>;
    countUnread(userId: string, supportId: string): Promise<{ general: number, support: number }>;
    countUnreadForAdmin(supportId: string): Promise<{ general: number, support: number }>;
    countUnreadLegacy(userId: string, supportId: string, isAdmin: boolean): Promise<{ general: number, support: number }>;
    updateReadStatus(where: any): Promise<void>;
    deleteOldMessages(olderThan: Date, supportId: string): Promise<number>;
}
