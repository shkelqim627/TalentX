'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserRole } from '@/types';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const router = useRouter();
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            toast.error('Please login to access this page');
            router.push(createPageUrl('Login'));
            return;
        }

        if (!loading && isAuthenticated && user && allowedRoles) {
            if (!allowedRoles.includes(user.role as UserRole)) {
                toast.error('You do not have permission to access this page');
                router.push(createPageUrl('Home')); // Or a dedicated "Unauthorized" page
            }
        }
    }, [isAuthenticated, user, loading, router, allowedRoles]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
