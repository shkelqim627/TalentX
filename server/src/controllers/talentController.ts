import { Request, Response } from 'express';
import { prisma } from '../prisma';

export const listTalents = async (req: Request, res: Response) => {
    try {
        const talents = await prisma.talent.findMany({
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });

        const formattedTalents = talents.map((t) => ({
            ...t,
            full_name: t.user.full_name,
            email: t.user.email,
            expertise: JSON.parse(t.expertise || '[]'),
            skills: JSON.parse(t.skills || '[]'),
            previous_companies: JSON.parse(t.previous_companies || '[]'),
            coordinates: t.lat && t.lng ? { lat: t.lat, lng: t.lng } : undefined,
        }));

        res.json(formattedTalents);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTalent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const talent = await prisma.talent.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });

        if (!talent) {
            return res.status(404).json({ message: 'Talent not found' });
        }

        const formattedTalent = {
            ...talent,
            full_name: talent.user.full_name,
            email: talent.user.email,
            expertise: JSON.parse(talent.expertise || '[]'),
            skills: JSON.parse(talent.skills || '[]'),
            previous_companies: JSON.parse(talent.previous_companies || '[]'),
            coordinates: talent.lat && talent.lng ? { lat: talent.lat, lng: talent.lng } : undefined,
        };

        res.json(formattedTalent);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTalentByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const talent = await prisma.talent.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });

        if (!talent) {
            return res.status(404).json({ message: 'Talent not found' });
        }

        const formattedTalent = {
            ...talent,
            full_name: talent.user.full_name,
            email: talent.user.email,
            expertise: JSON.parse(talent.expertise || '[]'),
            skills: JSON.parse(talent.skills || '[]'),
            previous_companies: JSON.parse(talent.previous_companies || '[]'),
            coordinates: talent.lat && talent.lng ? { lat: talent.lat, lng: talent.lng } : undefined,
        };

        res.json(formattedTalent);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTalent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    try {
        // Convert array fields to JSON strings if they are present in the body
        const updateData: any = { ...data };
        if (data.expertise) updateData.expertise = JSON.stringify(data.expertise);
        if (data.skills) updateData.skills = JSON.stringify(data.skills);
        if (data.previous_companies) updateData.previous_companies = JSON.stringify(data.previous_companies);

        const updatedTalent = await prisma.talent.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        full_name: true,
                        email: true,
                        avatar_url: true,
                    },
                },
            },
        });

        const formattedTalent = {
            ...updatedTalent,
            full_name: updatedTalent.user.full_name,
            email: updatedTalent.user.email,
            expertise: JSON.parse(updatedTalent.expertise || '[]'),
            skills: JSON.parse(updatedTalent.skills || '[]'),
            previous_companies: JSON.parse(updatedTalent.previous_companies || '[]'),
            coordinates: updatedTalent.lat && updatedTalent.lng ? { lat: updatedTalent.lat, lng: updatedTalent.lng } : undefined,
        };

        res.json(formattedTalent);
    } catch (error) {
        console.error('Update talent error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
