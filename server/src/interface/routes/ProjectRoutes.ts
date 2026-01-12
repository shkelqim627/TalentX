import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createProjectRoutes = (controller: ProjectController) => {
    const router = Router();

    // All routes require auth
    router.use(authenticateToken);

    router.get('/', controller.listProjects);
    router.post('/', controller.createProject); // Legacy allowed creating, technically should be 'client'/'admin'

    router.get('/:id', controller.getProject);
    router.put('/:id', controller.updateProject);
    router.delete('/:id', requireRole(['admin']), controller.deleteProject); // Only admin can delete based on user request in previous context? Or matching legacy?

    router.post('/:id/complete', controller.completeProject);
    router.post('/:id/release-payment', requireRole(['admin']), controller.releasePayment);
    router.post('/pay', controller.recordPayment);

    return router;
};
