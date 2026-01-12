export interface ITeamRepository {
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any | null>;

    // For "Generation" we query talents
    findTalentsBySkills(skills: string[], limit: number): Promise<any[]>;

    // For "Hiring"
    addProjectMembership(data: any): Promise<any>;
    findProjectMembership(projectId: string, talentId: string): Promise<any | null>;
}
