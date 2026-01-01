export type UserRole = 'client' | 'talent' | 'agency' | 'admin';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    status: 'active' | 'disabled';
    avatar_url?: string;
    rateType?: 'hourly' | 'monthly';
    rateAmount?: number;
    createdAt?: string;
    talent?: { id: string };
    agency?: { id: string };
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
    sender_name?: string; // For display convenience
    sender_avatar?: string;
}

export interface Agency {
    id?: string;
    agency_name: string;
    description?: string;
    services: string[];
    industry_focus?: string[];
    team_size: number;
    min_project_size?: number;
    hourly_rate_range?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    founded_year?: number;
    completed_projects?: number;
    rating?: number;
    image_url?: string;
    portfolio?: {
        project_name?: string;
        client?: string;
        image_url?: string;
    }[];
}

export interface HireRequest {
    id?: string;
    client_name: string;
    client_email: string;
    company_name?: string;
    hire_type: 'talent' | 'team' | 'agency';
    category?: string;
    project_description?: string;
    budget?: string;
    timeline?: string;
    status?: 'pending' | 'reviewing' | 'matched' | 'completed' | 'cancelled';
    matched_talent_id?: string;
    matched_team_id?: string;
    matched_agency_id?: string;
}

export interface Subscription {
    id?: string;
    user_email: string;
    plan_name?: string;
    price?: number;
    status?: 'active' | 'cancelled' | 'expired';
    start_date?: string;
    next_billing_date?: string;
    hires_count?: number;
}

export interface Talent {
    id?: string;
    full_name: string;
    title: string;
    category: 'developer' | 'designer' | 'marketing' | 'finance' | 'product_manager' | 'project_manager';
    expertise?: string[];
    hourly_rate?: number;
    experience_years?: number;
    availability?: 'available' | 'busy' | 'not_available';
    bio?: string;
    skills?: string[];
    previous_companies?: string[];
    image_url?: string;
    location?: string;
    coordinates?: { lat: number; lng: number };
    rating?: number;
    completed_projects?: number;
    match_score?: number;
}

export interface Team {
    id?: string;
    team_name: string;
    description?: string;
    specialization: 'full_stack_development' | 'mobile_development' | 'design_team' | 'marketing_team' | 'data_science' | 'devops' | 'ai_ml';
    team_size: number;
    hourly_rate?: number;
    members?: {
        name?: string;
        role?: string;
        image_url?: string;
    }[];
    availability?: 'available' | 'busy' | 'not_available';
    completed_projects?: number;
    rating?: number;
    image_url?: string;
    project_timeline?: string; // e.g. "3 months"
    expiration_date?: string; // ISO date string
    location?: string;
    coordinates?: { lat: number; lng: number };
}

export interface Project {
    id: string;
    name: string;
    client_email: string;
    status: 'active' | 'completed' | 'on_hold';
    start_date: string;
    description?: string;
    progress?: number; // 0-100
    budget_spent?: number;
    total_budget?: number;
    next_milestone?: string;
    team_members?: User[];
    assigned_to?: {
        id: string;
        userId?: string;
        name: string;
        type: 'talent' | 'team' | 'agency';
        image_url?: string;
    };
    whiteboard_url?: string;
    srs_content?: string;
    srs_file_url?: string;
    design_diagram_url?: string;
}

export interface Task {
    id: string;
    project_id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    assignee?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
}
