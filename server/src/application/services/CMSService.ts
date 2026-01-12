import { PrismaClient } from '@prisma/client';
import { AuditLogService } from './AuditLogService';

export class CMSService {
    constructor(
        private prisma: PrismaClient,
        private auditLogService: AuditLogService
    ) { }

    // FAQs
    async listFAQs() { return this.prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' } }); }
    async createFAQ(adminId: string, data: any) {
        const result = await this.prisma.fAQ.create({ data });
        await this.auditLogService.logAction(adminId, 'CREATE', 'FAQ', result.id, { question: result.question });
        return result;
    }
    async updateFAQ(adminId: string, id: string, data: any) {
        const { id: _, createdAt, updatedAt, ...updateData } = data;
        const result = await this.prisma.fAQ.update({ where: { id }, data: updateData });
        await this.auditLogService.logAction(adminId, 'UPDATE', 'FAQ', id, { question: result.question });
        return result;
    }
    async deleteFAQ(adminId: string, id: string) {
        const result = await this.prisma.fAQ.delete({ where: { id } });
        await this.auditLogService.logAction(adminId, 'DELETE', 'FAQ', id, { question: result.question });
        return result;
    }

    // Testimonials
    async listTestimonials() { return this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }); }
    async createTestimonial(adminId: string, data: any) {
        const result = await this.prisma.testimonial.create({ data });
        await this.auditLogService.logAction(adminId, 'CREATE', 'Testimonial', result.id, { author: result.author });
        return result;
    }
    async updateTestimonial(adminId: string, id: string, data: any) {
        const { id: _, createdAt, updatedAt, ...updateData } = data;
        const result = await this.prisma.testimonial.update({ where: { id }, data: updateData });
        await this.auditLogService.logAction(adminId, 'UPDATE', 'Testimonial', id, { author: result.author });
        return result;
    }
    async deleteTestimonial(adminId: string, id: string) {
        const result = await this.prisma.testimonial.delete({ where: { id } });
        await this.auditLogService.logAction(adminId, 'DELETE', 'Testimonial', id, { author: result.author });
        return result;
    }

    // Case Studies
    async listCaseStudies() { return this.prisma.caseStudy.findMany({ orderBy: { createdAt: 'desc' } }); }
    async createCaseStudy(adminId: string, data: any) {
        const result = await this.prisma.caseStudy.create({ data });
        await this.auditLogService.logAction(adminId, 'CREATE', 'CaseStudy', result.id, { title: result.title });
        return result;
    }
    async updateCaseStudy(adminId: string, id: string, data: any) {
        const { id: _, createdAt, updatedAt, ...updateData } = data;
        const result = await this.prisma.caseStudy.update({ where: { id }, data: updateData });
        await this.auditLogService.logAction(adminId, 'UPDATE', 'CaseStudy', id, { title: result.title });
        return result;
    }
    async deleteCaseStudy(adminId: string, id: string) {
        const result = await this.prisma.caseStudy.delete({ where: { id } });
        await this.auditLogService.logAction(adminId, 'DELETE', 'CaseStudy', id, { title: result.title });
        return result;
    }

    // Blog Posts
    async listBlogPosts() { return this.prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }); }
    async createBlogPost(adminId: string, data: any) {
        if (!data.title) throw new Error('Title is required for blog posts');

        let slug = data.title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

        if (!slug) slug = `post-${Date.now()}`;

        // Check for duplicates
        const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }

        const result = await this.prisma.blogPost.create({
            data: {
                ...data,
                slug,
                published: data.published ?? false,
                featured: data.featured ?? false
            }
        });
        await this.auditLogService.logAction(adminId, 'CREATE', 'BlogPost', result.id, { title: result.title });
        return result;
    }
    async updateBlogPost(adminId: string, id: string, data: any) {
        const { id: _, createdAt, updatedAt, ...updateData } = data;
        const result = await this.prisma.blogPost.update({ where: { id }, data: updateData });
        await this.auditLogService.logAction(adminId, 'UPDATE', 'BlogPost', id, { title: result.title });
        return result;
    }
    async getBlogPostBySlug(slug: string) {
        return this.prisma.blogPost.findUnique({
            where: { slug }
        });
    }
    async deleteBlogPost(adminId: string, id: string) {
        const result = await this.prisma.blogPost.delete({ where: { id } });
        await this.auditLogService.logAction(adminId, 'DELETE', 'BlogPost', id, { title: result.title });
        return result;
    }
}
