'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "@/widgets/Navbar/Navbar";
import Footer from "@/widgets/Footer/Footer";
import { useAuthStore } from '@/features/auth/model/auth.store';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();

    // Pages where Footer should be hidden (Dashboard paths)
    const isDashboardPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/interview') || pathname?.startsWith('/messages');

    // Footer is hidden on dashboard pages OR if the user is authenticated anywhere
    const showFooter = !isDashboardPage && !isAuthenticated;
    // Navbar is always shown to provide consistent branding and logout
    const showNavbar = true;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
                {showNavbar && <Navbar />}
            </Suspense>
            <main className="flex-grow">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
