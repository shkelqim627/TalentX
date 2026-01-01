import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                <AdminDashboard />
            </Suspense>
        </div>
    );
}
