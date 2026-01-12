export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'pending';

export interface AssignedTo {
    id: string;
    name: string;
    image_url?: string;
    type: 'talent' | 'agency' | 'team';
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    progress: number;
    total_budget: number;
    budget_spent: number;
    start_date?: string;
    end_date?: string;
    next_milestone?: string;
    assigned_to?: AssignedTo;
    clientId: string;
    createdAt: string;
    updatedAt: string;
}
