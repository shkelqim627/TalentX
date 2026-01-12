export interface IProjectRepository {
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<any | null>;
    findAllByRole(userId: string, role: string): Promise<any[]>;
    findAll(filters: any): Promise<any[]>;
    // Specialized find for payments
    findByIdForPayment(projectId: string, talentId: string, clientId: string): Promise<any | null>;
}
