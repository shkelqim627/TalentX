import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { toast } from 'sonner';

export const useProfile = () => {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['profile', user?.id],
        queryFn: () => user ? profileApi.getMyProfile(user) : null,
        enabled: !!user,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) =>
            profileApi.updateProfile(user?.role || '', id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profile updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    });
};
