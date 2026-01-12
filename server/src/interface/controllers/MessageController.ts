import { Request, Response } from 'express';
import { MessageService } from '../../application/services/MessageService';
import { CreateMessageSchema } from '../../application/dtos/MessageDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class MessageController {
    constructor(private messageService: MessageService) { }

    listMessages = async (req: AuthRequest, res: Response) => {
        try {
            const messages = await this.messageService.listMessages(
                req.user!.id,
                req.user!.role,
                req.query as any
            );
            res.json(messages);
        } catch (error: any) {
            console.error('List Messages Error:', error);
            res.status(500).json({
                message: error.message || 'Error listing messages',
                stack: error.stack
            });
        }
    };

    createMessage = async (req: AuthRequest, res: Response) => {
        try {
            const validation = CreateMessageSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const message = await this.messageService.createMessage(
                req.user!.id,
                req.user!.role,
                validation.data
            );
            res.status(201).json(message);
        } catch (error: any) {
            console.error('Create Message Error:', error);
            res.status(500).json({
                message: error.message || 'Error creating message',
                stack: error.stack
            });
        }
    };

    getUnreadCount = async (req: AuthRequest, res: Response) => {
        try {
            const counts = await this.messageService.getUnreadCount(req.user!.id, req.user!.role);
            res.json(counts);
        } catch (error: any) {
            console.error('Get Unread Count Error:', error);
            res.status(500).json({
                message: error.message || 'Error getting unread counts',
                stack: error.stack
            });
        }
    };

    markAsRead = async (req: AuthRequest, res: Response) => {
        try {
            const result = await this.messageService.markAsRead(req.user!.id, req.user!.role, req.body);
            res.json(result);
        } catch (error: any) {
            console.error('Mark As Read Error:', error);
            res.status(500).json({
                message: error.message || 'Error marking as read',
                stack: error.stack
            });
        }
    };
}
