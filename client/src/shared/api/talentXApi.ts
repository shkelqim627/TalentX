import { apiClient, API_URL } from './client';
import { Talent, Agency, Team, Subscription, HireRequest, Project, Task, User, Message, FAQ, Testimonial, CaseStudy, BlogPost, AuditLog } from '@/shared/types';

export { API_URL };

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
            list: async (): Promise<HireRequest[]> => {
                const response = await apiClient.get('/hire-requests');
                return response.data;
            },
            create: async (data: any) => {
                const response = await apiClient.post('/hire-requests', data);
                return response.data;
            },
            updateStatus: async (id: string, status: string) => {
                const response = await apiClient.patch(`/hire-requests/${id}/status`, { status });
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
            },
            complete: async (id: string, data: { rating: number; review: string }) => {
                const response = await apiClient.post(`/projects/${id}/complete`, data);
                return response.data;
            },
            releasePayment: async (id: string) => {
                const response = await apiClient.post(`/projects/${id}/release-payment`);
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
                const response = await apiClient.get('/messages/unread');
                return response.data;
            },
            markRead: async (data: { isSupport: boolean; threadUserId?: string }) => {
                const response = await apiClient.post('/messages/read', data);
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
            },
            toggleStatus: async (id: string, status: 'active' | 'disabled') => {
                const response = await apiClient.patch(`/users/${id}`, { status });
                return response.data;
            }
        },
        Notification: {
            list: async (userId?: string): Promise<any[]> => {
                const response = await apiClient.get('/notifications');
                return response.data;
            },
            markRead: async (id: string) => {
                const response = await apiClient.patch(`/notifications/${id}/read`);
                return response.data;
            }
        },
        Application: {
            list: async (): Promise<any[]> => {
                const response = await apiClient.get('/applications/list');
                return response.data;
            },
            notifications: async (): Promise<any[]> => {
                const response = await apiClient.get('/applications/notifications');
                return response.data;
            },
            updateStatus: async (id: string, data: { status: string; type: string }) => {
                const response = await apiClient.patch(`/applications/status/${id}`, data);
                return response.data;
            },
            delete: async (id: string) => {
                const response = await apiClient.delete(`/applications/${id}`);
                return response.data;
            },
            getSheetUrl: async () => {
                const response = await apiClient.get('/applications/sheet-url');
                return response.data;
            }
        },
        Admin: {
            getAnalytics: async () => {
                // Mock analytics data for now
                return {
                    revenue: {
                        total: 124500,
                        growth: 12,
                        history: [
                            { month: 'Jan', value: 85000 },
                            { month: 'Feb', value: 92000 },
                            { month: 'Mar', value: 105000 },
                            { month: 'Apr', value: 112000 },
                            { month: 'May', value: 124500 }
                        ]
                    },
                    users: {
                        total: 450,
                        growth: 24,
                        distribution: { talent: 300, agency: 50, client: 100 }
                    },
                    projects: {
                        total: 82,
                        active: 45,
                        completed: 37
                    }
                };
            },
            getAuditLogs: async (filters?: { entityType?: string; startDate?: string; endDate?: string }): Promise<AuditLog[]> => {
                const response = await apiClient.get('/admin/audit-logs', { params: filters });
                return response.data;
            }
        },
        CMS: {
            FAQ: {
                list: async (): Promise<FAQ[]> => (await apiClient.get('/cms/faqs')).data,
                create: async (data: Partial<FAQ>) => (await apiClient.post('/cms/faqs', data)).data,
                update: async (id: string, data: Partial<FAQ>) => (await apiClient.patch(`/cms/faqs/${id}`, data)).data,
                delete: async (id: string) => (await apiClient.delete(`/cms/faqs/${id}`)).data
            },
            Testimonial: {
                list: async (): Promise<Testimonial[]> => (await apiClient.get('/cms/testimonials')).data,
                create: async (data: Partial<Testimonial>) => (await apiClient.post('/cms/testimonials', data)).data,
                update: async (id: string, data: Partial<Testimonial>) => (await apiClient.patch(`/cms/testimonials/${id}`, data)).data,
                delete: async (id: string) => (await apiClient.delete(`/cms/testimonials/${id}`)).data
            },
            CaseStudy: {
                list: async (): Promise<CaseStudy[]> => (await apiClient.get('/cms/case-studies')).data,
                create: async (data: Partial<CaseStudy>) => (await apiClient.post('/cms/case-studies', data)).data,
                update: async (id: string, data: Partial<CaseStudy>) => (await apiClient.patch(`/cms/case-studies/${id}`, data)).data,
                delete: async (id: string) => (await apiClient.delete(`/cms/case-studies/${id}`)).data
            },
            BlogPost: {
                list: async (): Promise<BlogPost[]> => (await apiClient.get('/cms/blog-posts')).data,
                getBySlug: async (slug: string): Promise<BlogPost> => (await apiClient.get(`/cms/blog-posts/slug/${slug}`)).data,
                create: async (data: Partial<BlogPost>) => (await apiClient.post('/cms/blog-posts', data)).data,
                update: async (id: string, data: Partial<BlogPost>) => (await apiClient.patch(`/cms/blog-posts/${id}`, data)).data,
                delete: async (id: string) => (await apiClient.delete(`/cms/blog-posts/${id}`)).data
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
