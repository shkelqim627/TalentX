import { Router } from 'express';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, listTasks);
router.post('/', authenticateToken, createTask);
router.patch('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);

export default router;
