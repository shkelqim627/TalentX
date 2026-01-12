import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createAuthRoutes = (controller: AuthController) => {
    const router = Router();

    router.post('/register', controller.register);
    router.post('/login', controller.login);
    router.get('/me', authenticateToken, controller.me);

    return router;
};
