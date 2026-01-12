import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createNotificationRoutes = (controller: NotificationController) => {
    const router = Router();

    // router.use(authenticateToken);

    router.get('/', controller.listNotifications);
    router.patch('/:id/read', controller.markAsRead);

    return router;
};
