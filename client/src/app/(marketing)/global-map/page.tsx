'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Talent, Team, Agency } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Dynamically import the map component to avoid SSR issues
const GlobalMap = dynamic(() => import('@/widgets/map/GlobalMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function GlobalMapPage() {
    const [talents, setTalents] = useState<Talent[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [agencies, setAgencies] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, fetch from API
                // For now, using mock data for initial load
                setTalents([]);
                setTeams([]);
                setAgencies([]);
            } catch (error) {
                console.error("Failed to fetch map data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-left">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between font-bold">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-[#1a1a2e]">Global Talent Map</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Explore Our Global Network</h2>
                    <p className="text-gray-500">
                        Visualize where our top talents, specialized teams, and partner agencies are located around the world.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-6 mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm inline-flex">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-sm font-medium text-gray-700">Talents</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                        <span className="text-sm font-medium text-gray-700">Teams</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium text-gray-700">Agencies</span>
                    </div>
                </div>

                {/* Map */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <GlobalMap talents={talents} teams={teams} agencies={agencies} className="w-full h-[600px] rounded-none border-none shadow-none" />
                </div>
            </main>
        </div>
    );
}
