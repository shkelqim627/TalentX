import { Request, Response } from 'express';
import { prisma } from '../prisma';
import bcrypt from 'bcryptjs';

import { uploadToDrive } from '../services/driveService';
import { appendToSheet } from '../services/googleSheetService';

export const submitApplication = async (req: Request, res: Response) => {
    try {
        const {
            full_name,
            email,
            role: userRole, // 'talent' or 'agency'
            password,
            // Talent specific
            title,
            category,
            experience,
            linkedin,
            portfolio,
            // Agency specific
            agency_name,
            team_size,
            company_website,
            linkedin_company_page,
            founded_year
        } = req.body;

        // Validations
        if (!req.file) {
            return res.status(400).json({ message: 'Resume/Profile file is required' });
        }

        // Upload to Drive
        const resume_url = await uploadToDrive(req.file);

        // ... existing checks ...

        // 3. Create Application Record
        const application = await prisma.application.create({
            data: {
                full_name,
                email,
                role: userRole,
                resume_url,
                // Talent fields
                title: userRole === 'talent' ? (title || 'Freelancer') : null,
                category: userRole === 'talent' ? (category || 'developer') : null,
                experience_years: userRole === 'talent' ? (experience ? parseInt(experience) : 0) : null,
                linkedin: userRole === 'talent' ? linkedin : null,
                portfolio: userRole === 'talent' ? portfolio : null,
                skills: userRole === 'talent' ? JSON.stringify([]) : null,

                // Agency fields
                agency_name: userRole === 'agency' ? (agency_name || `${full_name}'s Agency`) : null,
                team_size: userRole === 'agency' ? (team_size ? parseInt(team_size) : 1) : null,
                company_website: userRole === 'agency' ? company_website : null,
                linkedin_company_page: userRole === 'agency' ? linkedin_company_page : null,
                founded_year: userRole === 'agency' ? (founded_year ? parseInt(founded_year) : null) : null, // Store founded year

                status: 'pending'
            }
        });

        // 4. Log to Google Sheets
        const profileDataForSheet = {
            full_name,
            email,
            role: userRole,
            resume_url,
            category: userRole === 'talent' ? category : undefined,
            title: userRole === 'talent' ? title : undefined,
            experience_years: userRole === 'talent' ? experience : undefined,
            linkedin: userRole === 'talent' ? linkedin : undefined,
            portfolio: userRole === 'talent' ? portfolio : undefined,
            agency_name: userRole === 'agency' ? agency_name : undefined,
            team_size: userRole === 'agency' ? team_size : undefined,
            company_website: userRole === 'agency' ? company_website : undefined,
            linkedin_company_page: userRole === 'agency' ? linkedin_company_page : undefined,
            founded_year: userRole === 'agency' ? founded_year : undefined,
        };
        await appendToSheet(profileDataForSheet);

        // 5. Create Notification for Admin
        await prisma.notification.create({
            data: {
                type: 'application_received',
                content: `New ${userRole} application from ${full_name}`,
                data: JSON.stringify({ applicationId: application.id, role: userRole }),
            },
        });

        res.status(201).json({ message: 'Application submitted successfully', applicationId: application.id });
    } catch (error: any) {
        console.error('Submit Application Error Details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        });
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            details: error.meta || 'No additional details'
        });
    }
};

export const getApplications = async (req: Request, res: Response) => {
    try {
        const applications = await prisma.application.findMany({
            orderBy: { applied_at: 'desc' },
        });

        // Format to match frontend expectation (though frontend might need slight adjustment)
        const formattedApps = applications.map(app => ({
            id: app.id,
            userId: null, // No userId yet
            type: app.role,
            name: app.full_name,
            email: app.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.full_name)}&background=random`,
            role: app.role === 'talent' ? app.title : 'Agency',
            status: app.status,
            appliedAt: app.applied_at,
            resumeUrl: app.resume_url,
            details: app, // Pass full object for details view
        }));

        res.json(formattedApps);
    } catch (error) {
        console.error('Get Applications Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
    const { id } = req.params; // Application ID
    const { status } = req.body; // 'interview_invited' | 'rejected' | 'accepted'

    try {
        const application = await prisma.application.update({
            where: { id },
            data: { status },
        });

        if (status === 'accepted') {
            const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
            if (!existingUser) {
                // Create User System Account
                await prisma.$transaction(async (prisma) => {
                    const hashedPassword = await bcrypt.hash('ChangesRequired123!', 10); // Temporary password
                    const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(application.full_name)}&background=random`;

                    const user = await prisma.user.create({
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
                        await prisma.talent.create({
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
                        await prisma.agency.create({
                            data: {
                                userId: user.id,
                                agency_name: application.agency_name || `${application.full_name}'s Agency`,
                                team_size: application.team_size || 1,
                                resume_url: application.resume_url,
                                application_status: 'accepted',
                            },
                        });
                    }

                    // Notify: Account Created
                    await prisma.notification.create({
                        data: {
                            type: 'application_status_update',
                            content: `Your application has been accepted! Welcome to TalentX.`,
                            userId: user.id,
                            data: JSON.stringify({ userId: user.id }),
                        },
                    });

                    // Also notify Admin
                    await prisma.notification.create({
                        data: {
                            type: 'application_accepted',
                            content: `Application accepted for ${application.full_name}.`,
                            data: JSON.stringify({ userId: user.id, applicationId: application.id }),
                        },
                    });
                });
            }
        }

        res.json({ message: `Application status updated to ${status}` });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteApplication = async (req: Request, res: Response) => {
    const { id } = req.params; // Application ID

    try {
        await prisma.application.delete({ where: { id } });
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Delete Application Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;
        const whereClause = userId ? { userId } : {};

        const notifications = await prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 20, // Limit to last 20
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const markNotificationRead = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSheetUrl = async (req: Request, res: Response) => {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (sheetId) {
        res.json({ url: `https://docs.google.com/spreadsheets/d/${sheetId}` });
    } else {
        res.status(404).json({ message: 'Google Sheet ID not configured' });
    }
};
