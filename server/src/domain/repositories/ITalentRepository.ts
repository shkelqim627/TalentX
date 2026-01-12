export interface ITalentRepository {
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any | null>;
    findByUserId(userId: string): Promise<any | null>;
    update(id: string, data: any): Promise<any>;
}
