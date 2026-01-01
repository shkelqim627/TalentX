import { Router } from 'express';
import { createHireRequest, listHireRequests } from '../controllers/hireRequestController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', createHireRequest);
router.get('/', authenticateToken, requireRole(['admin']), listHireRequests);

export default router;
