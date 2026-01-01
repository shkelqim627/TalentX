import { Router } from 'express';
import { listProjects, getProject, createProject, updateProject, deleteProject, recordPayment } from '../controllers/projectController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, listProjects);
router.post('/pay', authenticateToken, requireRole(['client', 'admin']), recordPayment);
router.get('/:id', authenticateToken, getProject);
router.post('/', authenticateToken, requireRole(['client', 'admin']), createProject);
router.patch('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteProject);

export default router;
