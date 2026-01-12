import { Request, Response } from 'express';
import { CMSService } from '../../application/services/CMSService';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class CMSController {
    constructor(private cmsService: CMSService) { }

    // FAQs
    async listFAQs(req: Request, res: Response) {
        try {
            const faqs = await this.cmsService.listFAQs();
            res.json(faqs);
        } catch (error: any) {
            console.error('Error listing FAQs:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async createFAQ(req: AuthRequest, res: Response) {
        try {
            const faq = await this.cmsService.createFAQ(req.user!.id, req.body);
            res.json(faq);
        } catch (error: any) {
            console.error('Error creating FAQ:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async updateFAQ(req: AuthRequest, res: Response) {
        try {
            const faq = await this.cmsService.updateFAQ(req.user!.id, req.params.id, req.body);
            res.json(faq);
        } catch (error: any) {
            console.error('Error updating FAQ:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async deleteFAQ(req: AuthRequest, res: Response) {
        try {
            await this.cmsService.deleteFAQ(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            console.error('Error deleting FAQ:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    // Testimonials
    async listTestimonials(req: Request, res: Response) {
        try {
            const items = await this.cmsService.listTestimonials();
            res.json(items);
        } catch (error: any) {
            console.error('Error listing testimonials:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async createTestimonial(req: AuthRequest, res: Response) {
        try {
            const item = await this.cmsService.createTestimonial(req.user!.id, req.body);
            res.json(item);
        } catch (error: any) {
            console.error('Error creating testimonial:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async updateTestimonial(req: AuthRequest, res: Response) {
        try {
            const item = await this.cmsService.updateTestimonial(req.user!.id, req.params.id, req.body);
            res.json(item);
        } catch (error: any) {
            console.error('Error updating testimonial:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async deleteTestimonial(req: AuthRequest, res: Response) {
        try {
            await this.cmsService.deleteTestimonial(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            console.error('Error deleting testimonial:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    // Case Studies
    async listCaseStudies(req: Request, res: Response) {
        try {
            const items = await this.cmsService.listCaseStudies();
            res.json(items);
        } catch (error: any) {
            console.error('Error listing case studies:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async createCaseStudy(req: AuthRequest, res: Response) {
        try {
            const item = await this.cmsService.createCaseStudy(req.user!.id, req.body);
            res.json(item);
        } catch (error: any) {
            console.error('Error creating case study:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async updateCaseStudy(req: AuthRequest, res: Response) {
        try {
            const item = await this.cmsService.updateCaseStudy(req.user!.id, req.params.id, req.body);
            res.json(item);
        } catch (error: any) {
            console.error('Error updating case study:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async deleteCaseStudy(req: AuthRequest, res: Response) {
        try {
            await this.cmsService.deleteCaseStudy(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            console.error('Error deleting case study:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    // Blog Posts
    async listBlogPosts(req: Request, res: Response) {
        try {
            const items = await this.cmsService.listBlogPosts();
            res.json(items);
        } catch (error: any) {
            console.error('Error listing blog posts:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async createBlogPost(req: AuthRequest, res: Response) {
        try {
            const item = await this.cmsService.createBlogPost(req.user!.id, req.body);
            res.json(item);
        } catch (error: any) {
            console.error('Error creating blog post:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async updateBlogPost(req: AuthRequest, res: Response) {
        try {
            const item = await this.cmsService.updateBlogPost(req.user!.id, req.params.id, req.body);
            res.json(item);
        } catch (error: any) {
            console.error('Error updating blog post:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async deleteBlogPost(req: AuthRequest, res: Response) {
        try {
            await this.cmsService.deleteBlogPost(req.user!.id, req.params.id);
            res.json({ message: 'Deleted' });
        } catch (error: any) {
            console.error('Error deleting blog post:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }

    async getBlogPostBySlug(req: Request, res: Response) {
        try {
            const item = await this.cmsService.getBlogPostBySlug(req.params.slug);
            if (!item) return res.status(404).json({ message: 'Blog post not found' });
            res.json(item);
        } catch (error: any) {
            console.error('Error fetching blog post by slug:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
