import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth.api';
import { AuthState } from '../api/types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await authApi.login(credentials);
                    set({ user, token, isAuthenticated: true, isLoading: false });
                    // Also set in localStorage for apiClient to pick up immediately if needed
                    // though persist middleware handles state rehydration
                    localStorage.setItem('talentx_token', token);
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            register: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const { user, token } = await authApi.register(data);
                    set({ user, token, isAuthenticated: true, isLoading: false });
                    localStorage.setItem('talentx_token', token);
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('talentx_token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('talentx_token');
                if (!token) return;

                set({ isLoading: true });
                try {
                    const user = await authApi.me();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                    localStorage.removeItem('talentx_token');
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
