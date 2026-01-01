import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    submitApplication,
    getApplications,
    updateApplicationStatus,
    deleteApplication,
    getNotifications,
    markNotificationRead,
    getSheetUrl
} from '../controllers/applicationController';

const router = express.Router();

// Configure Multer
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only .pdf, .doc and .docx format allowed!'));
    }
});

// Public Routes
router.post('/submit', upload.single('resume'), submitApplication);

// Admin Routes (Should be protected in production, open for MVP as per context)
router.get('/list', getApplications);
router.patch('/status/:id', updateApplicationStatus); // :id is the Talent/Agency ID
router.delete('/:id', deleteApplication); // :id is the Talent/Agency ID
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.get('/sheet-url', getSheetUrl);

export default router;
