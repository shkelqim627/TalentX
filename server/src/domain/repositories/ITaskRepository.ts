export interface ITaskRepository {
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<any | null>;
    findAllByProject(projectId?: string): Promise<any[]>;
}
