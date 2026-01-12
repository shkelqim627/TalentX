import { Request, Response } from 'express';
import { CreateApplicationSchema } from '../../application/dtos/ApplicationDTO';
import { ApplicationService } from '../../application/services/ApplicationService';

export class ApplicationController {
    constructor(private applicationService: ApplicationService) { }

    submitApplication = async (req: Request, res: Response) => {
        try {
            // 1. Validate Input (Zod)
            // Note: req.body is parsed by express.json(), but multipart forms might need handling
            // Since we use Multer, req.body is populated.
            const validationResult = CreateApplicationSchema.safeParse(req.body);

            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Validation Error",
                    errors: (validationResult.error as any).errors
                });
            }

            // 2. Call Service
            const application = await this.applicationService.submitApplication(
                validationResult.data,
                req.file
            );

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId: application.id
            });

        } catch (error: any) {
            console.error('Submit Application Error:', error);
            res.status(500).json({
                message: error.message || 'Internal server error'
            });
        }
    };

    getApplications = async (req: Request, res: Response) => {
        try {
            const applications = await this.applicationService.getAllApplications();

            // Transform for frontend if needed (keeping existing shape logic)
            const formattedApps = applications.map(app => ({
                id: app.id,
                userId: null,
                type: app.role,
                name: app.full_name,
                email: app.email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.full_name)}&background=random`,
                role: app.role === 'talent' ? app.title : 'Agency',
                status: app.status,
                appliedAt: app.created_at || (app as any).applied_at, // Handle potential field name diff
                resumeUrl: app.resume_url,
                details: app,
            }));

            res.json(formattedApps);
        } catch (error) {
            console.error('Get Applications Error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    deleteApplication = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await this.applicationService.deleteApplication(id);
            res.json({ message: 'Application deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    updateStatus = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;
        try {
            await this.applicationService.updateStatus(id, status);
            res.json({ message: `Application status updated to ${status}` });
        } catch (error: any) {
            console.error('Update Status Error:', error);
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

    getSheetUrl = async (req: Request, res: Response) => {
        const sheetId = process.env.GOOGLE_SHEET_ID;
        if (sheetId) {
            res.json({ url: `https://docs.google.com/spreadsheets/d/${sheetId}` });
        } else {
            res.status(404).json({ message: 'Google Sheet ID not configured' });
        }
    };
}
