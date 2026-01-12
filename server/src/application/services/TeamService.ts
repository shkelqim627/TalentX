import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import { ITalentRepository } from '../../domain/repositories/ITalentRepository';
import { GenerateTeamDTO, HireTeamDTO } from '../dtos/TeamDTO';

export class TeamService {
    constructor(
        private teamRepo: ITeamRepository,
        private projectRepo: IProjectRepository,
        private talentRepo: ITalentRepository
    ) { }

    private transformToDomain(team: any) {
        return {
            ...team,
            members: team.members.map((m: any) => ({
                name: m.talent.user.full_name,
                role: m.role,
                image_url: m.talent.user.avatar_url,
            })),
            coordinates: team.lat && team.lng ? { lat: team.lat, lng: team.lng } : undefined,
        };
    }

    async listTeams() {
        const teams = await this.teamRepo.findAll();
        return teams.map(t => this.transformToDomain(t));
    }

    async getTeamById(id: string) {
        const team = await this.teamRepo.findById(id);
        if (!team) throw new Error("Team not found");
        return this.transformToDomain(team);
    }

    async generateTeams(dto: GenerateTeamDTO) {
        const skillsList = Array.isArray(dto.skills) ? dto.skills : (dto.skills || '').split(',').map(s => s.trim()).filter(s => s);

        const talents = await this.teamRepo.findTalentsBySkills(skillsList, 20);

        const teamOptions = [
            { id: 'team_option_1', name: 'Rapid Response Squad', strategy: 'Speed & Efficiency' },
            { id: 'team_option_2', name: 'Core Development Team', strategy: 'Balanced Experienced' },
            { id: 'team_option_3', name: 'Expert Innovation Lab', strategy: 'High Seniority' }
        ];

        return teamOptions.map(option => {
            const shuffled = [...talents].sort(() => 0.5 - Math.random());
            const selectedMembers = shuffled.slice(0, dto.team_size || 3).map(t => ({
                id: t.id,
                userId: t.userId,
                name: t.user.full_name,
                role: t.title || 'Specialist',
                image_url: t.user.avatar_url,
                skills: t.skills,
                hourly_rate: t.hourly_rate
            }));

            const totalRate = selectedMembers.reduce((sum, m) => sum + (m.hourly_rate || 50), 0);

            return {
                id: option.id,
                team_name: option.name,
                description: `${option.strategy} - ${selectedMembers.length} members tailored for your needs.`,
                members: selectedMembers,
                hourly_rate: totalRate,
                match_score: 85 + Math.floor(Math.random() * 14)
            };
        });
    }

    async hireTeam(dto: HireTeamDTO) {
        const project = await this.projectRepo.findById(dto.projectId);
        if (!project) throw new Error("Project not found");

        await Promise.all(dto.talentIds.map(async (talentId) => {
            const existing = await this.teamRepo.findProjectMembership(dto.projectId, talentId);
            if (!existing) {
                const talent = await this.talentRepo.findById(talentId);
                await this.teamRepo.addProjectMembership({
                    projectId: dto.projectId,
                    talentId,
                    role: talent?.title || 'Team Member',
                    rateAmount: talent?.hourly_rate || 50,
                    rateType: 'hourly'
                });
            }
        }));

        return { message: 'Team hired successfully', projectId: dto.projectId };
    }
}
