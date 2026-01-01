import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/authRoutes';
import talentRoutes from './routes/talentRoutes';
import agencyRoutes from './routes/agencyRoutes';
import teamRoutes from './routes/teamRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import messageRoutes from './routes/messageRoutes';
import hireRequestRoutes from './routes/hireRequestRoutes';
import userRoutes from './routes/userRoutes';
import applicationRoutes from './routes/applicationRoutes';
import path from 'path';

import { prisma } from './prisma';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/hire-requests', hireRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);

    // Ensure 'support' user exists for messaging FK constraints
    try {
        const existingByEmail = await prisma.user.findUnique({
            where: { email: 'support@talentx.com' }
        });

        // 1. If old user exists with correct email but wrong ID, rename their email to free it up
        if (existingByEmail && existingByEmail.id !== 'support-system-user-id-001') {
            await prisma.user.update({
                where: { id: existingByEmail.id },
                data: { email: `old-support-${Date.now()}@talentx.com` }
            });
        }

        // 2. Upsert the new correct support user
        await prisma.user.upsert({
            where: { id: 'support-system-user-id-001' },
            update: { email: 'support@talentx.com' },
            create: {
                id: 'support-system-user-id-001',
                full_name: 'Admin Support',
                email: 'support@talentx.com',
                password: 'system_managed_account',
                role: 'admin'
            }
        });

        // 3. If we renamed an old user, migrate their messages and delete them
        if (existingByEmail && existingByEmail.id !== 'support-system-user-id-001') {
            await prisma.message.updateMany({
                where: { receiverId: existingByEmail.id },
                data: { receiverId: 'support-system-user-id-001' }
            });
            await prisma.message.updateMany({
                where: { senderId: existingByEmail.id },
                data: { senderId: 'support-system-user-id-001' }
            });

            await prisma.user.delete({ where: { id: existingByEmail.id } });
            console.log("Legacy support user migrated and removed successfully");
        }
        console.log("System 'support' user ensured");
    } catch (error) {
        console.error("Failed to ensure 'support' user:", error);
    }

    // Support message auto-deletion (48h purge)
    setInterval(async () => {
        try {
            const fortniteEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
            const deleted = await prisma.message.deleteMany({
                where: {
                    OR: [
                        { receiverId: 'support-system-user-id-001' },
                        { senderId: 'support-system-user-id-001' }
                    ],
                    timestamp: {
                        lt: fortniteEightHoursAgo
                    }
                }
            });
            if (deleted.count > 0) {
                console.log(`Auto-purged ${deleted.count} support messages older than 48h`);
            }
        } catch (error) {
            console.error('Error in message auto-deletion:', error);
        }
    }, 60 * 60 * 1000); // Check every hour
});

export { app, prisma };
