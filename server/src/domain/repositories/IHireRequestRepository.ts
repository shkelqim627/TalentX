export interface IHireRequestRepository {
    create(data: any): Promise<any>;
    findAll(): Promise<any[]>;
    // Transactional helpers? 
    // Ideally we keep transaction logic in service using a unit of work or similar, 
    // but for Prisma + Clean Arch simple bridge:
    // We might need methods to create memberships etc. directly if avoiding heavy transaction abstractions.
    // However, the legacy logic used a transaction block. 
    // We will entrust the service to coordinate multiple repository calls or pass a transaction object (PrismaClient|TransactionClient) if strictly needed,
    // OR we expose specific methods like `createWithDirectHire` in the implementation if it needs atomicity.
    // For now, let's stick to simple CRUD and handle "saga" in service or non-atomic if acceptable, 
    // OR use Prisma $transaction in service if we extract Prisma logic there (infrastructure leak).
    // Better: Helper method in repository "processDirectHire(data)" that encapsulates the transaction logic?

    processDirectHire(data: any, extraData: any): Promise<any>;
    processAgencyHire(data: any, extraData: any): Promise<any>;
}
