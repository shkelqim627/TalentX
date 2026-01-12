import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import bcrypt from 'bcryptjs';

export class PrismaUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<any | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: any): Promise<any> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name)}&background=random`;

            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    full_name: data.full_name,
                    role: data.role,
                    avatar_url,
                    stripeCustomerId: data.stripeCustomerId || null,
                    status: 'active',
                },
            });

            if (data.role === 'talent') {
                await tx.talent.create({
                    data: {
                        userId: user.id,
                        title: data.title || 'Freelancer',
                        category: data.category || 'developer',
                        expertise: data.expertise || '[]',
                    },
                });
            } else if (data.role === 'agency') {
                await tx.agency.create({
                    data: {
                        userId: user.id,
                        agency_name: data.agency_name || `${data.full_name}'s Agency`,
                    },
                });
            }

            return user;
        });
    }

    async createUserFromApplication(application: any): Promise<any> {
        return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const hashedPassword = await bcrypt.hash('ChangesRequired123!', 10); // Temporary password
            const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(application.full_name)}&background=random`;

            const user = await tx.user.create({
                data: {
                    email: application.email,
                    password: hashedPassword,
                    full_name: application.full_name,
                    role: application.role,
                    avatar_url,
                    status: 'active',
                },
            });

            if (application.role === 'talent') {
                await tx.talent.create({
                    data: {
                        userId: user.id,
                        title: application.title || 'Freelancer',
                        category: application.category || 'developer',
                        experience_years: application.experience_years || 0,
                        skills: application.skills || '[]',
                        expertise: '[]',
                        resume_url: application.resume_url,
                        application_status: 'accepted',
                    },
                });
            } else if (application.role === 'agency') {
                await tx.agency.create({
                    data: {
                        userId: user.id,
                        agency_name: application.agency_name || `${application.full_name}'s Agency`,
                        team_size: application.team_size || 1,
                        resume_url: application.resume_url,
                        application_status: 'accepted',
                    },
                });
            }

            return user;
        });
    }

    async findAll(): Promise<any[]> {
        return prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { talent: true, agency: true }
        });
    }

    async findById(id: string): Promise<any | null> {
        return prisma.user.findUnique({
            where: { id },
            include: { talent: true, agency: true }
        });
    }

    async update(id: string, data: any): Promise<any> {
        // Handle nested updates for Talent/Agency if needed
        const { title, category, experience_years, skills, expertise, agency_name, team_size, ...userData } = data;

        // Basic User Update
        const updatedUser = await prisma.user.update({
            where: { id },
            data: userData,
            include: { talent: true, agency: true } // Return full object
        });

        // Update Talent/Agency specific fields if they exist and user has that role
        if (updatedUser.role === 'talent' && (title || category || skills)) {
            await prisma.talent.update({
                where: { userId: id },
                data: {
                    title, category, experience_years, skills, expertise
                }
            });
        } else if (updatedUser.role === 'agency' && (agency_name)) {
            await prisma.agency.update({
                where: { userId: id },
                data: {
                    agency_name, team_size
                }
            });
        }

        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        // Cascade handles most, but manual cleanup ensures no orphans if schema isn't strict
        const user = await prisma.user.findUnique({ where: { id } });
        if (user?.role === 'talent') {
            await prisma.talent.delete({ where: { userId: id } }).catch(() => { });
        } else if (user?.role === 'agency') {
            await prisma.agency.delete({ where: { userId: id } }).catch(() => { });
        }
        await prisma.user.delete({ where: { id } });
    }
}
