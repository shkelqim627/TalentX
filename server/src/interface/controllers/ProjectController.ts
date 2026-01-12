import { Request, Response } from 'express';
import { ProjectService } from '../../application/services/ProjectService';
import { CreateProjectSchema, UpdateProjectSchema, RecordPaymentSchema, CompleteProjectSchema, ReleasePaymentSchema } from '../../application/dtos/ProjectDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class ProjectController {
    constructor(private projectService: ProjectService) { }

    createProject = async (req: AuthRequest, res: Response) => {
        try {
            // Augment with user info if missing
            const body = {
                ...req.body,
                clientId: req.body.clientId || req.user?.id,
                client_email: req.body.client_email || req.user?.email
            };

            const validation = CreateProjectSchema.safeParse(body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }

            const project = await this.projectService.createProject(validation.data);
            res.status(201).json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error creating project' });
        }
    };

    listProjects = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;
            const filters = req.query; // e.g. { talentId: '...', status: 'completed' }
            const projects = await this.projectService.listProjects(userId, role, filters);
            res.json(projects);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error listing projects' });
        }
    };

    getProject = async (req: Request, res: Response) => {
        try {
            const project = await this.projectService.getProjectById(req.params.id);
            res.json(project);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Project not found' });
        }
    };

    updateProject = async (req: AuthRequest, res: Response) => {
        try {
            const validation = UpdateProjectSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const project = await this.projectService.updateProject(req.user!.id, req.params.id, validation.data);
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating project' });
        }
    };

    deleteProject = async (req: AuthRequest, res: Response) => {
        try {
            await this.projectService.deleteProject(req.user!.id, req.params.id);
            res.json({ message: 'Project deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error deleting project' });
        }
    };

    recordPayment = async (req: AuthRequest, res: Response) => {
        try {
            const validation = RecordPaymentSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const result = await this.projectService.recordPayment(req.user!.id, validation.data);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error recording payment' });
        }
    };

    completeProject = async (req: AuthRequest, res: Response) => {
        try {
            const validation = CompleteProjectSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const project = await this.projectService.completeProject(req.user!.id, req.params.id, validation.data);
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error completing project' });
        }
    };

    releasePayment = async (req: AuthRequest, res: Response) => {
        try {
            const project = await this.projectService.releasePayment(req.user!.id, req.params.id);
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error releasing payment' });
        }
    };
}
