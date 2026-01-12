import { Request, Response } from 'express';
import { TalentService } from '../../application/services/TalentService';
import { UpdateTalentSchema } from '../../application/dtos/TalentDTO';

export class TalentController {
    constructor(private talentService: TalentService) { }

    getAllTalents = async (req: Request, res: Response) => {
        try {
            const talents = await this.talentService.getAllTalents();
            res.json(talents);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching talents' });
        }
    };

    getTalentById = async (req: Request, res: Response) => {
        try {
            const talent = await this.talentService.getTalentById(req.params.id);
            res.json(talent);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Talent not found' });
        }
    };

    getTalentByUserId = async (req: Request, res: Response) => {
        try {
            const talent = await this.talentService.getTalentByUserId(req.params.userId);
            res.json(talent);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Talent not found' });
        }
    };

    updateTalent = async (req: Request, res: Response) => {
        try {
            const validationResult = UpdateTalentSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ errors: (validationResult.error as any).errors });
            }

            const updatedTalent = await this.talentService.updateTalent(req.params.id, validationResult.data);
            res.json(updatedTalent);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating talent' });
        }
    };
}
