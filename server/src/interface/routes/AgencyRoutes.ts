import { Router } from 'express';
import { AgencyController } from '../controllers/AgencyController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createAgencyRoutes = (controller: AgencyController) => {
    const router = Router();

    // Public for browsing
    router.get('/', controller.getAllAgencies);
    router.get('/:id', controller.getAgencyById);
    router.get('/user/:userId', controller.getAgencyByUserId);

    // Protected
    router.put('/:id', authenticateToken, controller.updateAgency);

    return router;
};
