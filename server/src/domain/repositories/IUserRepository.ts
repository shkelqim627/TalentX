export interface IUserRepository {
    create(data: any): Promise<any>;
    createUserFromApplication(application: any): Promise<any>;
    findByEmail(email: string): Promise<any | null>;
    findById(id: string): Promise<any | null>;
    findAll(): Promise<any[]>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<void>;
}
