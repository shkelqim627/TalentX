import { Request, Response } from 'express';
import { HireRequestService } from '../../application/services/HireRequestService';
import { CreateHireRequestSchema } from '../../application/dtos/HireRequestDTO';

export class HireRequestController {
    constructor(private hireRequestService: HireRequestService) { }

    createHireRequest = async (req: Request, res: Response) => {
        try {
            const validation = CreateHireRequestSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const request = await this.hireRequestService.createHireRequest(validation.data);
            res.status(201).json(request);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error creating hire request' });
        }
    };

    listHireRequests = async (req: Request, res: Response) => {
        try {
            const requests = await this.hireRequestService.listHireRequests();
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error listing hire requests' });
        }
    };
}
