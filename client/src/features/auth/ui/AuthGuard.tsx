'use client';

import { useAuthStore } from "@/features/auth/model/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createPageUrl } from "@/shared/lib/utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Short timeout to allow store rehydration if using persist
        const timer = setTimeout(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    router.push(createPageUrl('Login'));
                }
                setIsChecking(false);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#204ecf]" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
