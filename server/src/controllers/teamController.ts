import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const listTeams = async (req: Request, res: Response) => {
    try {
        const teams = await prisma.team.findMany({
            include: {
                members: {
                    include: {
                        talent: {
                            include: {
                                user: {
                                    select: {
                                        full_name: true,
                                        avatar_url: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const formattedTeams = teams.map((t) => ({
            ...t,
            members: t.members.map((m) => ({
                name: m.talent.user.full_name,
                role: m.role,
                image_url: m.talent.user.avatar_url,
            })),
            coordinates: t.lat && t.lng ? { lat: t.lat, lng: t.lng } : undefined,
        }));

        res.json(formattedTeams);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTeam = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const team = await prisma.team.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        talent: {
                            include: {
                                user: {
                                    select: {
                                        full_name: true,
                                        avatar_url: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const formattedTeam = {
            ...team,
            members: team.members.map((m) => ({
                name: m.talent.user.full_name,
                role: m.role,
                image_url: m.talent.user.avatar_url,
            })),
            coordinates: team.lat && team.lng ? { lat: team.lat, lng: team.lng } : undefined,
        };

        res.json(formattedTeam);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const generateTeams = async (req: Request, res: Response) => {
    const { skills, team_size } = req.body;
    try {
        const skillsList = skills instanceof Array ? skills : (skills as string || '').split(',').map(s => s.trim()).filter(s => s);

        // Find talents that match at least one skill, or just get random ones if no skills provided
        const whereClause = skillsList.length > 0 ? {
            OR: skillsList.map((skill: string) => ({
                skills: {
                    contains: skill,
                    mode: 'insensitive',
                },
            })),
        } : {};

        const talents = await prisma.talent.findMany({
            where: whereClause as any,
            include: {
                user: {
                    select: {
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
            take: 20 // Limit pool
        });

        // Simple grouping logic: Create 3 options
        const teamOptions = [
            { id: 'team_option_1', name: 'Rapid Response Squad', strategy: 'Speed & Efficiency' },
            { id: 'team_option_2', name: 'Core Development Team', strategy: 'Balanced Experienced' },
            { id: 'team_option_3', name: 'Expert Innovation Lab', strategy: 'High Seniority' }
        ];

        const generatedTeams = teamOptions.map(option => {
            // Randomly pick unique talents for this team
            const shuffled = [...talents].sort(() => 0.5 - Math.random());
            const selectedMembers = shuffled.slice(0, team_size || 3).map(t => ({
                id: t.id,
                userId: t.userId,
                name: t.user.full_name,
                role: t.title || 'Specialist',
                image_url: t.user.avatar_url,
                skills: t.skills,
                hourly_rate: t.hourly_rate
            }));

            // Calculate total rate
            const totalRate = selectedMembers.reduce((sum, m) => sum + (m.hourly_rate || 50), 0);

            return {
                id: option.id,
                team_name: option.name,
                description: `${option.strategy} - ${selectedMembers.length} members tailored for your needs.`,
                members: selectedMembers,
                hourly_rate: totalRate,
                match_score: 85 + Math.floor(Math.random() * 14) // Mock score
            };
        });

        res.json(generatedTeams);
    } catch (error) {
        console.error("Error generating teams:", error);
        res.status(500).json({ message: 'Failed to generate teams' });
    }
};

export const hireTeam = async (req: Request, res: Response) => {
    const { talentIds, projectId } = req.body;

    if (!talentIds || !projectId) {
        return res.status(400).json({ message: 'Missing talent IDs or Project ID' });
    }

    try {
        // Find the project to verify existence and get type
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Create ProjectMembership for each talent
        // We use Promise.all to execute in parallel
        await Promise.all(talentIds.map(async (talentId: string) => {
            // Check if already member
            const existing = await prisma.projectMembership.findUnique({
                where: {
                    projectId_talentId: {
                        projectId,
                        talentId
                    }
                }
            });

            if (!existing) {
                // Get talent details for rate
                const talent = await prisma.talent.findUnique({ where: { id: talentId } });

                await prisma.projectMembership.create({
                    data: {
                        projectId,
                        talentId,
                        role: talent?.title || 'Team Member',
                        rateAmount: talent?.hourly_rate || 50,
                        rateType: 'hourly'
                    }
                });
            }
        }));

        res.json({ message: 'Team hired successfully', projectId });
    } catch (error) {
        console.error("Error hiring team:", error);
        res.status(500).json({ message: 'Failed to hire team' });
    }
};
