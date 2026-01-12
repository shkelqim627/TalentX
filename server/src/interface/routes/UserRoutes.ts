import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createUserRoutes = (controller: UserController) => {
    const router = Router();

    // Protect all user routes
    router.use(authenticateToken);

    router.get('/', controller.getAllUsers);
    router.get('/:id', controller.getUserById);
    router.put('/:id', controller.updateUser);
    router.delete('/:id', controller.deleteUser);

    return router;
};
