import axios from 'axios';
import { Talent, Agency, Team, Subscription, HireRequest, Project, Task, User, Message, UserRole } from '@/types';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('talentx_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API Error:');
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('talentx_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const talentXApi = {
    auth: {
        login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
            const response = await apiClient.post('/auth/login', {
                email,
                password
            });

            const { user, token } = response.data;
            if (typeof window !== 'undefined') {
                localStorage.setItem('talentx_user', JSON.stringify(user));
                localStorage.setItem('talentx_token', token);
            }
            return { user, token };
        },
        register: async (data: any): Promise<{ user: User; token: string }> => {
            const response = await apiClient.post('/auth/register', data);

            const { user, token } = response.data;
            if (typeof window !== 'undefined') {
                localStorage.setItem('talentx_user', JSON.stringify(user));
                localStorage.setItem('talentx_token', token);
            }
            return { user, token };
        },
        me: async (): Promise<User> => {
            try {
                const response = await apiClient.get('/auth/me');
                return response.data;
            } catch (error) {
                // Fallback to localStorage if API fails or not logged in
                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('talentx_user');
                    if (stored) return JSON.parse(stored);
                }
                throw error;
            }
        },
        logout: async () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('talentx_user');
                localStorage.removeItem('talentx_token');
            }
        }
    },
    entities: {
        Talent: {
            list: async (): Promise<(Talent & { id: string })[]> => {
                const response = await apiClient.get('/talents');
                return response.data;
            },
            getByUserId: async (userId: string): Promise<Talent & { id: string }> => {
                const response = await apiClient.get(`/talents/user/${userId}`);
                return response.data;
            },
            update: async (id: string, data: Partial<Talent>): Promise<Talent & { id: string }> => {
                const response = await apiClient.patch(`/talents/${id}`, data);
                return response.data;
            }
        },
        Agency: {
            list: async (): Promise<(Agency & { id: string })[]> => {
                const response = await apiClient.get('/agencies');
                return response.data;
            },
            getByUserId: async (userId: string): Promise<Agency & { id: string }> => {
                const response = await apiClient.get(`/agencies/user/${userId}`);
                return response.data;
            },
            update: async (id: string, data: Partial<Agency>): Promise<Agency & { id: string }> => {
                const response = await apiClient.patch(`/agencies/${id}`, data);
                return response.data;
            }
        },
        Team: {
            list: async (): Promise<(Team & { id: string })[]> => {
                const response = await apiClient.get('/teams');
                return response.data;
            },
            generate: async (data: { skills: string; team_size: number }): Promise<any> => {
                const response = await apiClient.post('/teams/generate', data);
                return response.data;
            },
            hire: async (data: { talentIds: string[]; projectId: string }): Promise<any> => {
                const response = await apiClient.post('/teams/hire', data);
                return response.data;
            }
        },
        Subscription: {
            filter: async (query: any): Promise<Subscription[]> => {
                // Subscriptions are not fully implemented in backend yet, return mock
                return [{
                    user_email: 'demo@example.com',
                    status: 'active'
                }];
            },
            create: async (data: any) => ({ id: 'sub_123', ...data })
        },
        HireRequest: {
            create: async (data: any) => {
                const response = await apiClient.post('/hire-requests', data);
                return response.data;
            }
        },
        Project: {
            list: async (): Promise<Project[]> => {
                const response = await apiClient.get('/projects');
                return response.data;
            },
            filter: async (query: any): Promise<Project[]> => {
                const response = await apiClient.get('/projects', { params: query });
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/projects', data);
                return response.data;
            },
            update: async (id: string, data: Partial<Project>) => {
                const response = await apiClient.patch(`/projects/${id}`, data);
                return response.data;
            },
            recordPayment: async (data: { projectId: string; talentId: string; amount: number }) => {
                const response = await apiClient.post('/projects/pay', data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/projects/${id}`);
                return response.data;
            }
        },
        Task: {
            list: async (): Promise<Task[]> => {
                const response = await apiClient.get('/tasks');
                return response.data;
            },
            filter: async (query: any): Promise<Task[]> => {
                const response = await apiClient.get('/tasks', { params: query });
                return response.data;
            },
            update: async (id: string, data: Partial<Task>) => {
                const response = await apiClient.patch(`/tasks/${id}`, data);
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/tasks', data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/tasks/${id}`);
                return response.data;
            }
        },
        Message: {
            list: async (query?: any): Promise<Message[]> => {
                const response = await apiClient.get('/messages', { params: query });
                return response.data;
            },
            create: async (data: { receiver_id: string; content: string; isSupport?: boolean }) => {
                const response = await apiClient.post('/messages', data);
                return response.data;
            },
            getUnreadCount: async (): Promise<{ general: number; support: number }> => {
                const response = await apiClient.get('/messages/unread-count');
                return response.data;
            },
            markRead: async (data: { isSupport: boolean; threadUserId?: string }) => {
                const response = await apiClient.post('/messages/mark-read', data);
                return response.data;
            }
        },
        User: {
            list: async (): Promise<User[]> => {
                const response = await apiClient.get('/users');
                return response.data;
            },
            getById: async (id: string): Promise<User> => {
                const response = await apiClient.get(`/users/${id}`);
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/users', data);
                return response.data;
            },
            update: async (id: string, data: Partial<User>) => {
                const response = await apiClient.patch(`/users/${id}`, data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/users/${id}`);
                return response.data;
            }
        },
        Notification: {
            list: async (userId?: string): Promise<any[]> => {
                const params = userId ? { userId } : {};
                const response = await apiClient.get('/applications/notifications', { params });
                return response.data;
            },
            markRead: async (id: string) => {
                const response = await apiClient.patch(`/applications/notifications/${id}/read`);
                return response.data;
            }
        }
    },
    integrations: {
        Core: {
            InvokeLLM: async (params: any) => {
                // Keep mock for LLM for now
                if (params.prompt.includes('team compositions')) {
                    return {
                        teams: [
                            {
                                team_name: "The A-Team",
                                talent_ids: ["1", "2", "3"],
                                rationale: "Perfect blend of frontend, backend, and design skills.",
                                hourly_rate: 250
                            },
                            {
                                team_name: "Innovation Squad",
                                talent_ids: ["4", "5", "6"],
                                rationale: "High expertise in AI and Data Science.",
                                hourly_rate: 300
                            },
                            {
                                team_name: "Rapid Launchers",
                                talent_ids: ["1", "3", "5"],
                                rationale: "Optimized for quick MVP delivery.",
                                hourly_rate: 200
                            }
                        ]
                    };
                }
                return {
                    matches: []
                };
            }
        }
    }
};
