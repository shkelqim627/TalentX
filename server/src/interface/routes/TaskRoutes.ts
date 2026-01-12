import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createTaskRoutes = (controller: TaskController) => {
    const router = Router();

    router.use(authenticateToken);

    router.get('/', controller.listTasks);
    router.post('/', controller.createTask);
    router.put('/:id', controller.updateTask);
    router.delete('/:id', controller.deleteTask);

    return router;
};
