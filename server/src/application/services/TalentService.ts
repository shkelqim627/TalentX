import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { UpdateTalentDTO } from '../dtos/TalentDTO';

export class TalentService {
    constructor(private talentRepo: ITalentRepository) { }

    private transformToDomain(talent: any) {
        if (!talent) return null;
        return {
            ...talent,
            full_name: talent.user?.full_name,
            email: talent.user?.email,
            avatar_url: talent.user?.avatar_url, // Added to match other controllers
            expertise: JSON.parse(talent.expertise || '[]'),
            skills: JSON.parse(talent.skills || '[]'),
            previous_companies: JSON.parse(talent.previous_companies || '[]'),
            coordinates: talent.lat && talent.lng ? { lat: talent.lat, lng: talent.lng } : undefined,
            user: undefined // Remove raw user object if we flattened it
        };
    }

    async getAllTalents() {
        const talents = await this.talentRepo.findAll();
        return talents.map(t => this.transformToDomain(t));
    }

    async getTalentById(id: string) {
        const talent = await this.talentRepo.findById(id);
        if (!talent) throw new Error("Talent not found");
        return this.transformToDomain(talent);
    }

    async getTalentByUserId(userId: string) {
        const talent = await this.talentRepo.findByUserId(userId);
        if (!talent) throw new Error("Talent not found");
        return this.transformToDomain(talent);
    }

    async updateTalent(id: string, dto: UpdateTalentDTO) {
        const updateData: any = { ...dto };
        if (dto.expertise) updateData.expertise = JSON.stringify(dto.expertise);
        if (dto.skills) updateData.skills = JSON.stringify(dto.skills);
        if (dto.previous_companies) updateData.previous_companies = JSON.stringify(dto.previous_companies);

        if (dto.coordinates) {
            updateData.lat = dto.coordinates.lat;
            updateData.lng = dto.coordinates.lng;
            delete updateData.coordinates;
        }

        const updated = await this.talentRepo.update(id, updateData);
        return this.transformToDomain(updated);
    }
}
