import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/entities/Application';
import { CreateApplicationDTO } from '../dtos/ApplicationDTO';
// import { uploadToDrive } from '../../infrastructure/external-services/DriveService'; NO LONGER NEEDED
// import { appendToSheet } from '../../infrastructure/external-services/GoogleSheetService'; NO LONGER NEEDED

import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IStorageGateway } from '../../domain/gateways/IStorageGateway';
import { ISheetGateway } from '../../domain/gateways/ISheetGateway';

export class ApplicationService {
    constructor(
        private applicationRepo: IApplicationRepository,
        private notificationRepo: INotificationRepository,
        private userRepo: IUserRepository,
        private storageGateway: IStorageGateway,
        private sheetGateway: ISheetGateway
    ) { }

    async submitApplication(dto: CreateApplicationDTO, file?: Express.Multer.File): Promise<Application> {
        // 1. Upload Resume
        let resume_url = '';
        if (file) {
            resume_url = await this.storageGateway.uploadFile(file);
        } else {
            throw new Error("Resume file is required");
        }

        // 2. Prepare Data for Persistence
        // Map DTO to Entity (Entity fields are cleaner)
        const entityData: Omit<Application, 'id' | 'created_at' | 'updated_at'> = {
            full_name: dto.full_name,
            email: dto.email,
            role: dto.role,
            resume_url,
            status: 'pending',

            // Talent Mapping
            title: dto.role === 'talent' ? (dto.title || 'Freelancer') : null,
            category: dto.role === 'talent' ? (dto.category || 'developer') : null,
            experience_years: dto.role === 'talent' && dto.experience ? parseInt(dto.experience) : null,
            linkedin: dto.role === 'talent' ? dto.linkedin || null : null,
            portfolio: dto.role === 'talent' ? dto.portfolio || null : null,
            skills: dto.role === 'talent' ? JSON.stringify([]) : null, // Default empty

            // Agency Mapping
            agency_name: dto.role === 'agency' ? (dto.agency_name || `${dto.full_name}'s Agency`) : null,
            team_size: dto.role === 'agency' && dto.team_size ? parseInt(dto.team_size) : null,
            company_website: dto.role === 'agency' ? dto.company_website || null : null,
            linkedin_company_page: dto.role === 'agency' ? dto.linkedin_company_page || null : null,
            founded_year: dto.role === 'agency' && dto.founded_year ? parseInt(dto.founded_year) : null,
        };

        // 3. Save to Repo
        const application = await this.applicationRepo.create(entityData);

        // 4. Side Effects (Sheets, Notifications)
        // Note: In a pure clean arch, these would be separate use cases or event listeners.
        // For this refactor, we keep them here but isolated.
        try {
            await this.sheetGateway.appendApplication({ ...entityData, ...dto }); // Pass merged data to match sheet expectations
        } catch (e) {
            console.error("Sheet Sync Failed", e);
            // Don't fail the request
        }

        // 5. Create Notification
        try {
            await this.notificationRepo.create({
                type: 'application_received',
                content: `New ${dto.role} application from ${dto.full_name}`,
                data: JSON.stringify({ applicationId: application.id, role: dto.role }),
            });
        } catch (e) {
            console.error("Notification Failed", e);
        }

        return application;
    }

    async updateStatus(id: string, status: 'interview_invited' | 'rejected' | 'accepted'): Promise<Application> {
        const application = await this.applicationRepo.updateStatus(id, status);

        if (status === 'accepted') {
            const existingUser = await this.userRepo.findByEmail(application.email);
            if (!existingUser) {
                const user = await this.userRepo.createUserFromApplication(application);

                // Notify User
                await this.notificationRepo.create({
                    type: 'application_status_update',
                    content: `Your application has been accepted! Welcome to TalentX.`,
                    userId: user.id,
                    data: JSON.stringify({ userId: user.id }),
                });

                // Notify Admin
                await this.notificationRepo.create({
                    type: 'application_accepted',
                    content: `Application accepted for ${application.full_name}.`,
                    data: JSON.stringify({ userId: user.id, applicationId: application.id }),
                });
            }
        }

        return application;
    }

    async getAllApplications(): Promise<Application[]> {
        return this.applicationRepo.findAll();
    }

    async deleteApplication(id: string): Promise<void> {
        await this.applicationRepo.delete(id);
    }
}
