import { Request, Response } from 'express';
import { AuditLogService } from '../../application/services/AuditLogService';

export class AuditLogController {
    constructor(private auditLogService: AuditLogService) { }

    async listLogs(req: Request, res: Response) {
        try {
            const { entityType, startDate, endDate } = req.query as any;
            const logs = await this.auditLogService.listLogs({ entityType, startDate, endDate });
            res.json(logs);
        } catch (error: any) {
            console.error('Error listing audit logs:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
