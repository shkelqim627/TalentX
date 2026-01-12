import { Request, Response } from 'express';
import { NotificationService } from '../../application/services/NotificationService';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class NotificationController {
    constructor(private notificationService: NotificationService) { }

    listNotifications = async (req: Request, res: Response) => {
        try {
            const userId = req.query.userId as string;
            const notifications = await this.notificationService.listNotifications(userId);
            res.json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error listing notifications' });
        }
    };

    markAsRead = async (req: AuthRequest, res: Response) => {
        try {
            await this.notificationService.markAsRead(req.params.id);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error marking notification as read' });
        }
    };
}
