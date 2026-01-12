import { Router } from 'express';
import { CMSController } from '../controllers/CMSController';
import { authenticateToken, requireRole } from '../middleware/AuthMiddleware';

export const createCMSRoutes = (cmsController: CMSController) => {
    const router = Router();

    // Public getters
    router.get('/faqs', (req, res) => cmsController.listFAQs(req, res));
    router.get('/testimonials', (req, res) => cmsController.listTestimonials(req, res));
    router.get('/case-studies', (req, res) => cmsController.listCaseStudies(req, res));
    router.get('/blog-posts', (req, res) => cmsController.listBlogPosts(req, res));
    router.get('/blog-posts/slug/:slug', (req, res) => cmsController.getBlogPostBySlug(req, res));

    // Protected mutations
    router.use(authenticateToken);
    router.use(requireRole(['admin']));

    router.post('/faqs', (req, res) => cmsController.createFAQ(req, res));
    router.patch('/faqs/:id', (req, res) => cmsController.updateFAQ(req, res));
    router.delete('/faqs/:id', (req, res) => cmsController.deleteFAQ(req, res));

    router.post('/testimonials', (req, res) => cmsController.createTestimonial(req, res));
    router.patch('/testimonials/:id', (req, res) => cmsController.updateTestimonial(req, res));
    router.delete('/testimonials/:id', (req, res) => cmsController.deleteTestimonial(req, res));

    router.post('/case-studies', (req, res) => cmsController.createCaseStudy(req, res));
    router.patch('/case-studies/:id', (req, res) => cmsController.updateCaseStudy(req, res));
    router.delete('/case-studies/:id', (req, res) => cmsController.deleteCaseStudy(req, res));

    router.post('/blog-posts', (req, res) => cmsController.createBlogPost(req, res));
    router.patch('/blog-posts/:id', (req, res) => cmsController.updateBlogPost(req, res));
    router.delete('/blog-posts/:id', (req, res) => cmsController.deleteBlogPost(req, res));

    return router;
};
