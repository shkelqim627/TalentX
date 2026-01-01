import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const createHireRequest = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const hireRequest = await prisma.$transaction(async (tx) => {
            const request = await tx.hireRequest.create({
                data: {
                    client_name: data.client_name,
                    client_email: data.client_email,
                    company_name: data.company_name,
                    hire_type: data.hire_type,
                    category: data.category,
                    project_description: data.project_description,
                    budget: data.budget,
                    timeline: data.timeline,
                    status: 'pending',
                    matched_talent_id: data.matched_talent_id,
                    data: data.data, // This contains the project and rate info from frontend
                },
            });

            // If it's a direct hire from a talent profile
            if (data.matched_talent_id && data.data) {
                console.log('Processing direct talent hire request:', data);
                const extraData = JSON.parse(data.data);
                const { projectId, rateType, rateAmount } = extraData;

                if (projectId && rateType && rateAmount !== undefined && rateAmount !== null) {
                    const existingMembership = await tx.projectMembership.findUnique({
                        where: {
                            projectId_talentId: {
                                projectId,
                                talentId: data.matched_talent_id
                            }
                        }
                    });

                    if (!existingMembership) {
                        await tx.projectMembership.create({
                            data: {
                                projectId,
                                talentId: data.matched_talent_id,
                                rateType,
                                rateAmount: parseFloat(rateAmount),
                                role: 'Hired Talent'
                            }
                        });

                        const talent = await tx.talent.findUnique({
                            where: { id: data.matched_talent_id },
                            include: { user: true }
                        });

                        if (talent) {
                            await tx.notification.create({
                                data: {
                                    type: 'hired',
                                    content: `You have been hired for project by ${data.client_name}!`,
                                    userId: talent.userId,
                                    data: JSON.stringify({ projectId, clientName: data.client_name })
                                }
                            });

                            await tx.notification.create({
                                data: {
                                    type: 'talent_hired',
                                    content: `Talent ${talent.user.full_name} was hired by ${data.client_name}`,
                                    data: JSON.stringify({ projectId, talentId: talent.id, clientId: data.client_email })
                                }
                            });
                        }
                    }
                }
            }

            // If it's a direct hire for an agency
            if (data.matched_agency_id && data.data) {
                console.log('Processing direct agency hire request:', data);
                const extraData = JSON.parse(data.data);
                const { projectId } = extraData;

                if (projectId) {
                    // 1. Update project to assign the agency
                    await tx.project.update({
                        where: { id: projectId },
                        data: {
                            agencyId: data.matched_agency_id,
                            assignedType: 'agency'
                        }
                    });

                    // 2. Get Agency Details for notifications
                    const agency = await tx.agency.findUnique({
                        where: { id: data.matched_agency_id },
                        include: { user: true }
                    });

                    if (agency) {
                        // 3. Create Notification for Agency
                        await tx.notification.create({
                            data: {
                                type: 'hired',
                                content: `Your agency has been hired for a project by ${data.client_name}!`,
                                userId: agency.userId,
                                data: JSON.stringify({
                                    projectId,
                                    clientName: data.client_name,
                                    role: 'agency'
                                })
                            }
                        });

                        // 4. Create Notification for Admin
                        await tx.notification.create({
                            data: {
                                type: 'agency_hired',
                                content: `Agency ${agency.agency_name} was hired by ${data.client_name}`,
                                data: JSON.stringify({
                                    projectId,
                                    agencyId: agency.id,
                                    clientId: data.client_email
                                })
                            }
                        });
                    }
                }
            }

            return request;
        });

        res.status(201).json(hireRequest);
    } catch (error: any) {
        console.error('Hire request error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const listHireRequests = async (req: Request, res: Response) => {
    try {
        const hireRequests = await prisma.hireRequest.findMany();
        res.json(hireRequests);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
