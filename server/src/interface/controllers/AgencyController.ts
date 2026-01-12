import { Request, Response } from 'express';
import { AgencyService } from '../../application/services/AgencyService';
import { UpdateAgencySchema } from '../../application/dtos/AgencyDTO';

export class AgencyController {
    constructor(private agencyService: AgencyService) { }

    getAllAgencies = async (req: Request, res: Response) => {
        try {
            const agencies = await this.agencyService.getAllAgencies();
            res.json(agencies);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching agencies' });
        }
    };

    getAgencyById = async (req: Request, res: Response) => {
        try {
            const agency = await this.agencyService.getAgencyById(req.params.id);
            res.json(agency);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Agency not found' });
        }
    };

    getAgencyByUserId = async (req: Request, res: Response) => {
        try {
            const agency = await this.agencyService.getAgencyByUserId(req.params.userId);
            res.json(agency);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'Agency not found' });
        }
    };

    updateAgency = async (req: Request, res: Response) => {
        try {
            const validationResult = UpdateAgencySchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ errors: (validationResult.error as any).errors });
            }

            const updatedAgency = await this.agencyService.updateAgency(req.params.id, validationResult.data);
            res.json(updatedAgency);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating agency' });
        }
    };
}
