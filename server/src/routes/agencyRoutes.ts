import { Router } from 'express';
import { listAgencies, getAgency, getAgencyByUserId, updateAgency } from '../controllers/agencyController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', listAgencies);
router.get('/:id', getAgency);
router.get('/user/:userId', authenticateToken, getAgencyByUserId);
router.patch('/:id', authenticateToken, updateAgency);

export default router;
