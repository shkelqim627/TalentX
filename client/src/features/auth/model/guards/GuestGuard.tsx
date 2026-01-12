'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../auth.store';

interface GuestGuardProps {
    children: React.ReactNode;
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || isAuthenticated) {
        return null; // Or a spinner
    }

    return <>{children}</>;
};
