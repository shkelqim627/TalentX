import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createMessageRoutes = (controller: MessageController) => {
    const router = Router();

    router.use(authenticateToken); // All message actions require auth

    router.get('/', controller.listMessages);
    router.get('/list', controller.listMessages); // Alias

    router.post('/', controller.createMessage);

    router.get('/unread', controller.getUnreadCount);
    router.get('/unread-count', controller.getUnreadCount); // Legacy alias

    router.post('/read', controller.markAsRead);
    router.post('/mark-read', controller.markAsRead); // Legacy alias

    return router;
};
