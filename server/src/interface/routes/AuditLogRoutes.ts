import { Router } from 'express';
import { AuditLogController } from '../controllers/AuditLogController';

export const createAuditLogRoutes = (controller: AuditLogController) => {
    const router = Router();

    // In a real app, you'd add verifyAdmin middleware here
    router.get('/', (req, res) => controller.listLogs(req, res));

    return router;
};
