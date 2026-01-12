import { useQuery } from '@tanstack/react-query';
import { talentApi, TalentFilters } from '../api/talent.api';

export const useTalents = (filters?: TalentFilters) => {
    return useQuery({
        queryKey: ['talents', filters],
        queryFn: () => talentApi.getAll(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useTalent = (id: string) => {
    return useQuery({
        queryKey: ['talent', id],
        queryFn: () => talentApi.getById(id),
        enabled: !!id,
    });
};
