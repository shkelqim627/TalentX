import { IHireRequestRepository } from '../../domain/repositories/IHireRequestRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';
import { CreateHireRequestDTO } from '../dtos/HireRequestDTO';

export class HireRequestService {
    constructor(
        private hireRequestRepo: IHireRequestRepository,
        private notificationRepo: INotificationRepository,
        private talentRepo: ITalentRepository,
        private agencyRepo: IAgencyRepository
    ) { }

    async createHireRequest(dto: CreateHireRequestDTO) {
        // Parse metadata
        let extraData: any = {};
        if (dto.data) {
            try {
                extraData = JSON.parse(dto.data);
            } catch (e) {
                console.error("Failed to parse hire request extra data", e);
            }
        }

        let request;

        if (dto.matched_talent_id && extraData.projectId) {
            request = await this.hireRequestRepo.processDirectHire(dto, extraData);

            // Post-transaction notifications
            const talent = await this.talentRepo.findById(dto.matched_talent_id);
            if (talent) {
                await this.notificationRepo.create({
                    type: 'hired',
                    content: `You have been hired for project by ${dto.client_name}!`,
                    userId: talent.userId,
                    data: JSON.stringify({ projectId: extraData.projectId, clientName: dto.client_name })
                });
                // Admin notification skipped or can be added
            }

        } else if (dto.matched_agency_id && extraData.projectId) {
            request = await this.hireRequestRepo.processAgencyHire(dto, extraData);

            const agency = await this.agencyRepo.findById(dto.matched_agency_id);
            if (agency) {
                await this.notificationRepo.create({
                    type: 'hired',
                    content: `Your agency has been hired for a project by ${dto.client_name}!`,
                    userId: agency.userId,
                    data: JSON.stringify({ projectId: extraData.projectId, clientName: dto.client_name, role: 'agency' })
                });
            }
        } else {
            // Standard general inquiry
            request = await this.hireRequestRepo.create(dto);
        }

        return request;
    }

    async listHireRequests() {
        return this.hireRequestRepo.findAll();
    }
}
