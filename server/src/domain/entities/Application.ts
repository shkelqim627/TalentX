export interface Application {
    id: string;
    full_name: string;
    email: string;
    role: 'talent' | 'agency';
    resume_url: string;
    status: 'pending' | 'interview_invited' | 'rejected' | 'accepted';

    // Talent Fields
    title?: string | null;
    category?: string | null;
    experience_years?: number | null;
    linkedin?: string | null;
    portfolio?: string | null;
    skills?: string | null;

    // Agency Fields
    agency_name?: string | null;
    team_size?: number | null;
    company_website?: string | null;
    linkedin_company_page?: string | null;
    founded_year?: number | null;

    created_at?: Date;
    updated_at?: Date;
}
