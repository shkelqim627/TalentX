import { apiClient } from "@/shared/api/client";
import { Project } from "@/entities/project/model/types";

export const projectApi = {
    getAll: async (): Promise<Project[]> => {
        const response = await apiClient.get<Project[]>('/projects');
        return response.data;
    },

    getById: async (id: string): Promise<Project> => {
        const response = await apiClient.get<Project>(`/projects/${id}`);
        return response.data;
    },

    create: async (data: Partial<Project>): Promise<Project> => {
        const response = await apiClient.post<Project>('/projects', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Project>): Promise<Project> => {
        const response = await apiClient.patch<Project>(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/projects/${id}`);
    }
};
