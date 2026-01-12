import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';
import { UpdateAgencyDTO } from '../dtos/AgencyDTO';

export class AgencyService {
    constructor(private agencyRepo: IAgencyRepository) { }

    private transformToDomain(agency: any) {
        if (!agency) return null;
        return {
            ...agency,
            full_name: agency.user?.full_name, // Map user fields as per legacy response
            email: agency.user?.email,
            avatar_url: agency.user?.avatar_url,
            services: JSON.parse(agency.services || '[]'),
            industry_focus: JSON.parse(agency.industry_focus || '[]'),
            coordinates: agency.lat && agency.lng ? { lat: agency.lat, lng: agency.lng } : undefined,
            user: undefined
        };
    }

    async getAllAgencies() {
        const agencies = await this.agencyRepo.findAll();
        return agencies.map(a => this.transformToDomain(a));
    }

    async getAgencyById(id: string) {
        const agency = await this.agencyRepo.findById(id);
        if (!agency) throw new Error("Agency not found");
        return this.transformToDomain(agency);
    }

    async getAgencyByUserId(userId: string) {
        const agency = await this.agencyRepo.findByUserId(userId);
        if (!agency) throw new Error("Agency not found");
        return this.transformToDomain(agency);
    }

    async updateAgency(id: string, dto: UpdateAgencyDTO) {
        const updateData: any = { ...dto };
        if (dto.services) updateData.services = JSON.stringify(dto.services);
        if (dto.industry_focus) updateData.industry_focus = JSON.stringify(dto.industry_focus);

        if (dto.coordinates) {
            updateData.lat = dto.coordinates.lat;
            updateData.lng = dto.coordinates.lng;
            delete updateData.coordinates;
        }

        const updated = await this.agencyRepo.update(id, updateData);
        return this.transformToDomain(updated);
    }
}
