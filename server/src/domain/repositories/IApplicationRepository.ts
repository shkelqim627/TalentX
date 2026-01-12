import { Application } from '../entities/Application';

export interface IApplicationRepository {
    create(application: Omit<Application, 'id' | 'created_at' | 'updated_at'>): Promise<Application>;
    findById(id: string): Promise<Application | null>;
    findAll(): Promise<Application[]>;
    updateStatus(id: string, status: Application['status']): Promise<Application>;
    delete(id: string): Promise<void>;
}
