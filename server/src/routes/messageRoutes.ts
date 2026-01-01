import { Router } from 'express';
import { listMessages, createMessage, getUnreadCount, markMessagesAsRead } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, listMessages);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.post('/', authenticateToken, createMessage);
router.post('/mark-read', authenticateToken, markMessagesAsRead);

export default router;
