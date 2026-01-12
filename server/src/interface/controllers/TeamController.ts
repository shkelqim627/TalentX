import { Request, Response } from 'express';
import { TeamService } from '../../application/services/TeamService';
import { GenerateTeamSchema, HireTeamSchema } from '../../application/dtos/TeamDTO';

export class TeamController {
    constructor(private teamService: TeamService) { }

    listTeams = async (req: Request, res: Response) => {
        try {
            const teams = await this.teamService.listTeams();
            res.json(teams);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error listing teams' });
        }
    };

    getTeam = async (req: Request, res: Response) => {
        try {
            const team = await this.teamService.getTeamById(req.params.id);
            res.json(team);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Team not found' });
        }
    };

    generateTeams = async (req: Request, res: Response) => {
        try {
            const validation = GenerateTeamSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const teams = await this.teamService.generateTeams(validation.data);
            res.json(teams);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error generating teams' });
        }
    };

    hireTeam = async (req: Request, res: Response) => {
        try {
            const validation = HireTeamSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const result = await this.teamService.hireTeam(validation.data);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error hiring team' });
        }
    };
}
