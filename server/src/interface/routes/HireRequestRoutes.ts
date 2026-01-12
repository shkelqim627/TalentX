import { Router } from 'express';
import { HireRequestController } from '../controllers/HireRequestController';
// import { authenticateToken } from '../middleware/AuthMiddleware'; 

export const createHireRequestRoutes = (controller: HireRequestController) => {
    const router = Router();

    // Legacy routes seemed public? Except maybe list?
    // Let's keep public for creation (lead gen)

    router.post('/', controller.createHireRequest);
    router.get('/', controller.listHireRequests); // Likely should be admin protected in real app

    return router;
};
