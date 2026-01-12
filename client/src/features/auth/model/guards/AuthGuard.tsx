'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../auth.store';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const init = async () => {
            await checkAuth();
            setChecked(true);
        };
        init();
    }, [checkAuth]);

    useEffect(() => {
        if (checked && !isAuthenticated && !isLoading) {
            router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isLoading, router, pathname, checked]);

    if (isLoading || !checked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
