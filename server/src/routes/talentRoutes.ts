import { Router } from 'express';
import { listTalents, getTalent, getTalentByUserId, updateTalent } from '../controllers/talentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', listTalents);
router.get('/:id', getTalent);
router.get('/user/:userId', authenticateToken, getTalentByUserId);
router.patch('/:id', authenticateToken, updateTalent);

export default router;
