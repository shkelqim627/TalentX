export interface Talent {
    id: string;
    userId: string;
    title: string;
    skills: string[]; // or JSON string if coming raw from DB, but try to parse in API layer
    experience_years: number;
    hourly_rate: number;
    bio: string;
    availability_status: 'available' | 'busy' | 'open_to_offers';
    location: string;
    // Relations that might be joined
    user?: {
        full_name: string;
        email: string;
        avatar_url?: string;
    };
}
