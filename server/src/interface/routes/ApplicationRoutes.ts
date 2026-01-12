import { Router } from 'express';
import multer from 'multer';
import { ApplicationController } from '../controllers/ApplicationController';

const upload = multer({ storage: multer.memoryStorage() });

export const createApplicationRoutes = (controller: ApplicationController) => {
    const router = Router();

    router.post('/apply', upload.single('resume'), controller.submitApplication);
    router.post('/submit', upload.single('resume'), controller.submitApplication); // Legacy alias

    router.get('/', controller.getApplications);
    router.get('/list', controller.getApplications); // Legacy alias

    router.delete('/:id', controller.deleteApplication);

    router.put('/:id/status', controller.updateStatus);
    router.patch('/status/:id', controller.updateStatus); // Legacy alias

    router.get('/sheet-url', controller.getSheetUrl);

    return router;
};
