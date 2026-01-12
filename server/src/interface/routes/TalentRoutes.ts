import { Router } from 'express';
import { TalentController } from '../controllers/TalentController';
import { authenticateToken } from '../middleware/AuthMiddleware';

export const createTalentRoutes = (controller: TalentController) => {
    const router = Router();

    // Public routes? Legacy seems to be public for listing/getting, but update usually protected.
    // Legacy routes didn't seem to explicitly check auth for get functions (based on snippet), but likely should.
    // We will keep listing public if that aligns with "Browse Talent".

    router.get('/', controller.getAllTalents);
    router.get('/:id', controller.getTalentById);
    router.get('/user/:userId', controller.getTalentByUserId);

    // Protected
    router.put('/:id', authenticateToken, controller.updateTalent);

    return router;
};
