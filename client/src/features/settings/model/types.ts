export interface Profile {
    id: string; // The specific profile ID (talentId or agencyId)
    userId: string;
    title?: string;
    bio?: string;
    location?: string;
    hourly_rate?: number;
    // Common fields that might be mapped from user or profile
    full_name?: string;
    email?: string;
}

export interface SettingsState {
    profile: Profile | null;
    isLoading: boolean;
}
