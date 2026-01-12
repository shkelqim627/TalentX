import { apiClient } from "@/shared/api/client";
import { User, LoginCredentials, RegisterData, AuthResponse } from "./types";

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    me: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        // Optional: Call backend to invalidate token if needed
        // await apiClient.post('/auth/logout');
    }
};
