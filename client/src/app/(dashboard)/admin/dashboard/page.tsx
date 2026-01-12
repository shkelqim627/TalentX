'use client';

import React, { Suspense } from 'react';
import AdminDashboard from "@/widgets/Dashboard/AdminDashboard";
import { Loader2 } from "lucide-react";
import AuthGuard from '@/features/auth/ui/AuthGuard';

export default function AdminDashboardPage() {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                    <AdminDashboard />
                </Suspense>
            </div>
        </AuthGuard>
    );
}
