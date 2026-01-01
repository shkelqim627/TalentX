import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const listProjects = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        let projects;

        if (role === 'admin') {
            projects = await prisma.project.findMany({
                include: {
                    talent: { include: { user: true } },
                    team: true,
                    assignedAgency: { include: { user: true } },
                    memberships: { include: { talent: { include: { user: true } } } },
                } as any,
            });
        } else if (role === 'talent') {
            const talent = await prisma.talent.findUnique({ where: { userId } as any });
            projects = await prisma.project.findMany({
                where: {
                    OR: [
                        { talentId: talent?.id },
                        { memberships: { some: { talentId: talent?.id } } }
                    ]
                } as any,
                include: {
                    talent: { include: { user: true } },
                    team: true,
                    assignedAgency: { include: { user: true } },
                    memberships: { include: { talent: { include: { user: true } } } },
                } as any,
            });
        } else if (role === 'agency') {
            const agency = await prisma.agency.findUnique({ where: { userId } as any });
            projects = await prisma.project.findMany({
                where: { agencyId: agency?.id } as any,
                include: {
                    talent: { include: { user: true } },
                    team: true,
                    assignedAgency: { include: { user: true } },
                    memberships: { include: { talent: { include: { user: true } } } },
                } as any,
            });
        } else {
            // Client
            projects = await prisma.project.findMany({
                where: { clientId: userId } as any,
                include: {
                    talent: { include: { user: true } },
                    team: true,
                    assignedAgency: { include: { user: true } },
                    memberships: { include: { talent: { include: { user: true } } } },
                } as any,
            });
        }

        const formattedProjects = (projects as any[]).map((p) => ({
            ...p,
            assigned_to: p.talent
                ? { id: p.talent.id, userId: p.talent.user.id, name: p.talent.user.full_name, type: 'talent', image_url: p.talent.user.avatar_url }
                : p.team
                    ? { id: p.team.id, name: p.team.team_name, type: 'team', image_url: p.team.image_url }
                    : p.assignedAgency
                        ? { id: p.assignedAgency.id, userId: p.assignedAgency.user.id, name: p.assignedAgency.agency_name, type: 'agency', image_url: p.assignedAgency.user.avatar_url }
                        : (p.memberships && p.memberships.length > 0)
                            ? {
                                id: 'custom-team',
                                name: `${p.memberships.length} Member Team`,
                                type: 'team',
                                image_url: p.memberships[0]?.talent?.user?.avatar_url
                            }
                            : undefined,
            team_members: p.memberships?.map((m: any) => ({
                id: m.talent.user.id, // Using user.id to match Task assignee relation
                full_name: m.talent.user.full_name,
                role: m.role || m.talent.title,
                avatar_url: m.talent.user.avatar_url,
                rateType: m.rateType,
                rateAmount: m.rateAmount
            })) || []
        }));

        res.json(formattedProjects);
    } catch (error: any) {
        console.error('Error in listProjects:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id } as any,
            include: {
                talent: { include: { user: true } },
                team: true,
                assignedAgency: { include: { user: true } },
                tasks: true,
                memberships: { include: { talent: { include: { user: true } } } },
            } as any,
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const formattedProject = {
            ...project,
            assigned_to: (project as any).talent
                ? { id: (project as any).talent.id, userId: (project as any).talent.user.id, name: (project as any).talent.user.full_name, type: 'talent', image_url: (project as any).talent.user.avatar_url }
                : (project as any).team
                    ? { id: (project as any).team.id, name: (project as any).team.team_name, type: 'team', image_url: (project as any).team.image_url }
                    : (project as any).assignedAgency
                        ? { id: (project as any).assignedAgency.id, userId: (project as any).assignedAgency.user.id, name: (project as any).assignedAgency.agency_name, type: 'agency', image_url: (project as any).assignedAgency.user.avatar_url }
                        : ((project as any).memberships && (project as any).memberships.length > 0)
                            ? {
                                id: 'custom-team',
                                name: `${(project as any).memberships.length} Member Team`,
                                type: 'team',
                                image_url: (project as any).memberships[0]?.talent?.user?.avatar_url
                            }
                            : undefined,
            team_members: (project as any).memberships?.map((m: any) => ({
                id: m.talent.user.id,
                full_name: m.talent.user.full_name,
                role: m.role || m.talent.title,
                avatar_url: m.talent.user.avatar_url,
                rateType: m.rateType,
                rateAmount: m.rateAmount
            })) || []
        };

        res.json(formattedProject);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProject = async (req: AuthRequest, res: Response) => {
    console.log('Received createProject request body:', req.body);
    console.log('User from token:', req.user);

    try {
        const { name, description, status, progress, budget_spent, total_budget, next_milestone, start_date } = req.body;
        const client_email = req.body.client_email || req.user?.email;
        const clientId = req.body.clientId || req.user?.id;

        console.log('Derived client info:', { client_email, clientId });

        if (!client_email || !clientId) {
            console.error('Missing client email or ID');
            return res.status(400).json({ message: 'Client email and ID are required' });
        }

        const projectData = {
            name,
            description,
            client_email,
            clientId,
            status: status || 'active',
            progress: progress || 0,
            budget_spent: budget_spent || 0,
            total_budget: total_budget ? parseFloat(total_budget) : undefined,
            next_milestone,
            start_date: start_date ? new Date(start_date) : undefined,
        };

        console.log('Creating project with data:', projectData);

        const project = await prisma.project.create({
            data: projectData as any,
        });

        console.log('Project created successfully:', project);
        res.status(201).json(project);
    } catch (error: any) {
        console.error('Error creating project:', error);
        // Log detailed prisma error if available
        if (error.code) {
            console.error('Prisma Error Code:', error.code);
            console.error('Prisma Error Meta:', error.meta);
        }
        res.status(500).json({ message: 'Internal server error', error: error.message, details: error.meta });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data,
        });
        res.json(updatedProject);
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({
            where: { id },
        });
        res.json({ message: 'Project deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const recordPayment = async (req: AuthRequest, res: Response) => {
    const { projectId, talentId, amount } = req.body;
    const userId = req.user?.id;

    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { memberships: { where: { talentId } } }
        } as any);

        if (!project || project.clientId !== userId) {
            return res.status(403).json({ message: 'Unauthorized or project not found' });
        }

        const talent: any = await prisma.talent.findUnique({
            where: { id: talentId },
            include: { user: true }
        });

        if (talent) {
            // 1. Create Notification for Talent
            await prisma.notification.create({
                data: {
                    type: 'payment_received',
                    content: `You have received a payment of $${amount} for ${project.name}!`,
                    userId: talent.userId,
                    data: JSON.stringify({
                        projectId,
                        amount,
                    })
                }
            });

            // 2. Create Notification for Admin
            await (prisma as any).notification.create({
                data: {
                    type: 'talent_paid',
                    content: `Client has paid $${amount} to ${(talent as any).user.full_name} for project ${project.name}`,
                    data: JSON.stringify({
                        projectId,
                        talentId,
                        amount
                    })
                }
            });
        }

        return res.json({ message: 'Payment simulated and notifications sent' });
    } catch (error: any) {
        console.error('Payment error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
