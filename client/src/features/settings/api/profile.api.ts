import { apiClient } from "@/shared/api/client";
import { Profile } from "../model/types";
import { User } from "@/features/auth/api/types";

export const profileApi = {
    getMyProfile: async (user: User): Promise<Profile | null> => {
        try {
            let endpoint = '';
            if (user.role === 'talent') {
                endpoint = `/talents/user/${user.id}`;
            } else if (user.role === 'agency') {
                endpoint = `/agencies/user/${user.id}`;
            } else {
                return null;
            }

            const response = await apiClient.get(endpoint);
            // Merge with user data for a complete view
            return {
                ...response.data,
                full_name: user.full_name,
                email: user.email
            };
        } catch (error) {
            console.warn("Profile not found or fetch failed", error);
            return null;
        }
    },

    updateProfile: async (role: string, id: string, data: Partial<Profile>): Promise<Profile> => {
        let endpoint = '';
        if (role === 'talent') {
            endpoint = `/talents/${id}`;
        } else if (role === 'agency') {
            endpoint = `/agencies/${id}`;
        } else {
            throw new Error("Invalid role for profile update");
        }

        const response = await apiClient.patch(endpoint, data);
        return response.data;
    }
};
