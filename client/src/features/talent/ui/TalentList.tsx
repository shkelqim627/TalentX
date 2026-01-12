'use client';

import { useTalents } from '../model/useTalents';
import { TalentCard } from './TalentCard';

export const TalentList = () => {
    const { data: talents, isLoading, error } = useTalents();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
                <p>Failed to load talents. Please try again later.</p>
            </div>
        );
    }

    if (!talents || talents.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <p>No talents found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
            ))}
        </div>
    );
};
