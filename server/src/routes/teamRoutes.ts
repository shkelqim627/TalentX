import { Router } from 'express';
import { listTeams, getTeam, generateTeams, hireTeam } from '../controllers/teamController';

const router = Router();

router.get('/', listTeams);
router.get('/:id', getTeam);

// Dynamic hiring
router.post('/generate', generateTeams);
router.post('/hire', hireTeam);

export default router;
