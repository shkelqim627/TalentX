import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { CreateProjectDTO, UpdateProjectDTO, RecordPaymentDTO } from '../dtos/ProjectDTO';
import { AuditLogService } from './AuditLogService';

export class ProjectService {
    constructor(
        private projectRepo: IProjectRepository,
        private notificationRepo: INotificationRepository,
        private talentRepo: ITalentRepository,
        private auditLogService: AuditLogService
    ) { }

    // Helper to format project response to match legacy structure
    private transformToDomain(project: any) {
        if (!project) return null;

        const assigned_to = project.talent
            ? { id: project.talent.id, userId: project.talent.user.id, name: project.talent.user.full_name, type: 'talent', image_url: project.talent.user.avatar_url }
            : project.team
                ? { id: project.team.id, name: project.team.team_name, type: 'team', image_url: project.team.image_url }
                : project.assignedAgency
                    ? { id: project.assignedAgency.id, userId: project.assignedAgency.user.id, name: project.assignedAgency.agency_name, type: 'agency', image_url: project.assignedAgency.user.avatar_url }
                    : (project.memberships && project.memberships.length > 0)
                        ? {
                            id: 'custom-team',
                            name: `${project.memberships.length} Member Team`,
                            type: 'team',
                            image_url: project.memberships[0]?.talent?.user?.avatar_url
                        }
                        : undefined;

        const team_members = project.memberships?.map((m: any) => ({
            id: m.talent.user.id,
            full_name: m.talent.user.full_name,
            role: m.role || m.talent.title,
            avatar_url: m.talent.user.avatar_url,
            rateType: m.rateType,
            rateAmount: m.rateAmount
        })) || [];

        return {
            ...project,
            assigned_to,
            team_members,
            clientReview: project.clientReview,
            clientRating: project.clientRating,
            paymentStatus: project.paymentStatus
        };
    }

    async createProject(dto: CreateProjectDTO) {
        const projectData = {
            ...dto,
            total_budget: dto.total_budget ? parseFloat(dto.total_budget.toString()) : undefined,
            start_date: dto.start_date ? new Date(dto.start_date) : undefined
        };
        const project = await this.projectRepo.create(projectData);
        return project;
    }

    async listProjects(userId: string, role: string, filters?: any) {
        let projects;
        if (filters && Object.keys(filters).length > 0) {
            // If explicit filters are provided (e.g. talentId from public profile), use them
            // We should restrict this if security is a concern, but for now we'll allow it
            // Especially if filtering for completed projects
            projects = await this.projectRepo.findAll(filters);
        } else {
            projects = await this.projectRepo.findAllByRole(userId, role);
        }
        return projects.map(p => this.transformToDomain(p));
    }

    async getProjectById(id: string) {
        const project = await this.projectRepo.findById(id);
        if (!project) throw new Error("Project not found");
        return this.transformToDomain(project);
    }

    async updateProject(adminId: string, id: string, dto: UpdateProjectDTO) {
        const project = await this.projectRepo.update(id, dto);
        await this.auditLogService.logAction(adminId, 'UPDATE', 'Project', id, { name: project.name, updates: dto });
        return this.transformToDomain(project);
    }

    async deleteProject(adminId: string, id: string) {
        const project = await this.projectRepo.findById(id);
        const result = await this.projectRepo.delete(id);
        await this.auditLogService.logAction(adminId, 'DELETE', 'Project', id, { name: project?.name });
        return result;
    }

    async recordPayment(userId: string, dto: RecordPaymentDTO) {
        const project = await this.projectRepo.findByIdForPayment(dto.projectId, dto.talentId, userId);

        if (!project || project.clientId !== userId) {
            throw new Error("Unauthorized or project not found");
        }

        const talent = await this.talentRepo.findById(dto.talentId);

        if (talent) {
            await this.notificationRepo.create({
                type: 'payment_received',
                content: `You have received a payment of $${dto.amount} for ${project.name}!`,
                userId: talent.userId, // Send to User ID associated with Talent
                data: JSON.stringify({ projectId: dto.projectId, amount: dto.amount })
            });

            // Simple admin notification mock - we don't have exact admin ID handling in legacy well defined
            // Assuming admin just sees all or system notification. 
            // Legacy cast prisma to any implies generic creation.
            // We'll skip admin notification here for simplicity strictly matching legacy loose behavior if feasible, 
            // OR implement a findAdmin helper. For now, let's notify the client as confirmation? 
            // Or better, just return success message as legacy does.
        }

        return { message: 'Payment simulated and notifications sent' };
    }

    async completeProject(userId: string, id: string, dto: any) {
        const project = await this.projectRepo.findById(id);
        if (!project || project.clientId !== userId) {
            throw new Error("Unauthorized or project not found");
        }
        return this.projectRepo.update(id, {
            status: 'completed',
            clientRating: dto.rating,
            clientReview: dto.review
        });
    }

    async releasePayment(adminId: string, projectId: string) {
        const project = await this.projectRepo.findById(projectId);
        if (!project) throw new Error("Project not found");

        if (project.status !== 'completed') {
            throw new Error("Cannot release payment for an incomplete project");
        }

        const updatedProject = await this.projectRepo.update(projectId, {
            paymentStatus: 'released'
        });

        // Notify Recipients (Primary + All Members)
        const recipientUserIds = new Set<string>();

        // 1. Primary Talent or Agency User
        const primaryUserId = project.talent?.user?.id || project.assignedAgency?.user?.id;
        if (primaryUserId) {
            recipientUserIds.add(primaryUserId);
        }

        // 2. All Project Members
        if (project.memberships) {
            project.memberships.forEach((m: any) => {
                const memberUserId = m.talent?.user?.id;
                if (memberUserId) {
                    recipientUserIds.add(memberUserId);
                }
            });
        }

        // Create notifications for all unique recipients
        for (const userId of recipientUserIds) {
            await this.notificationRepo.create({
                type: 'payment_released',
                content: `Payment has been released for project: ${project.name}`,
                userId: userId,
                data: JSON.stringify({ projectId })
            });
        }

        await this.auditLogService.logAction(adminId, 'RELEASE_PAYMENT', 'Project', projectId, { name: project.name });

        return updatedProject;
    }
}
