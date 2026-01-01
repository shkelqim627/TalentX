import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from '../controllers/userController';

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
