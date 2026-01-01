import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                status: true,
                avatar_url: true,
                createdAt: true,
                talent: {
                    select: { id: true }
                },
                agency: {
                    select: { id: true }
                }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, full_name, role, avatar_url, ...otherData } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                full_name,
                role,
                avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${full_name.replace(' ', '+')}`,
            },
        });

        // Initialize related profile based on role
        if (role === 'talent') {
            await prisma.talent.create({
                data: {
                    userId: user.id,
                    title: otherData.title || 'New Talent',
                    category: otherData.category || 'developer',
                    expertise: '[]',
                    availability: 'available',
                    hourly_rate: 0,
                    experience_years: 0
                }
            });
        } else if (role === 'agency') {
            await prisma.agency.create({
                data: {
                    userId: user.id,
                    agency_name: otherData.agency_name || `${full_name}'s Agency`,
                    team_size: 1,
                    description: 'New Agency'
                }
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { password, role, email, full_name, status, avatar_url } = req.body;

        const updateData: any = {};
        if (email) updateData.email = email;
        if (full_name) updateData.full_name = full_name;
        if (status) updateData.status = status;
        if (avatar_url) updateData.avatar_url = avatar_url;
        if (role) updateData.role = role;

        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                status: true,
                avatar_url: true,
                createdAt: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                status: true,
                avatar_url: true,
                createdAt: true,
                talent: {
                    select: { id: true }
                },
                agency: {
                    select: { id: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Delete related records first (cascade should handle this but manual safety)
        const user = await prisma.user.findUnique({ where: { id } });
        if (user?.role === 'talent') {
            await prisma.talent.delete({ where: { userId: id } }).catch(() => { });
        } else if (user?.role === 'agency') {
            await prisma.agency.delete({ where: { userId: id } }).catch(() => { });
        }

        await prisma.user.delete({ where: { id } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
