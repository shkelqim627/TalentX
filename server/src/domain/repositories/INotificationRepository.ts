export interface NotificationData {
    type: string;
    content: string;
    userId?: string;
    data?: string;
}

export interface INotificationRepository {
    create(data: NotificationData): Promise<void>;
    createMany?(data: NotificationData[]): Promise<void>; // Optional helper
    findByUserId(userId: string): Promise<any[]>;
    markAsRead(id: string): Promise<void>;
}
