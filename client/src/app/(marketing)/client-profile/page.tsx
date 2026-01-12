'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { Button } from "@/shared/components/ui/button";
import { User, Briefcase, Mail, Calendar, ArrowLeft, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPageUrl } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import AuthGuard from '@/features/auth/ui/AuthGuard';

function ClientProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('id');
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        talentXApi.auth.me().then(user => {
            if (user.role !== 'admin') {
                router.push('/');
            } else {
                setIsAdmin(true);
            }
        }).catch(() => {
            router.push('/login');
        });
    }, [router]);

    const { data: client, isLoading: isClientLoading } = useQuery({
        queryKey: ['client', clientId],
        queryFn: async () => talentXApi.entities.User.getById(clientId!),
        enabled: !!clientId && isAdmin === true
    });

    const { data: projects, isLoading: isProjectsLoading } = useQuery({
        queryKey: ['client-projects', clientId],
        queryFn: async () => talentXApi.entities.Project.filter({ clientId }),
        enabled: !!clientId && isAdmin === true
    });

    if (isClientLoading || isAdmin === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-12 h-12 text-[#204ecf] animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading client profile...</p>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Client not found</h2>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.back()} className="rounded-full w-10 h-10 p-0 hover:bg-gray-100">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900">Client Profile</h1>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-[#204ecf] border-blue-100">
                        Admin View
                    </Badge>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="overflow-hidden border-none shadow-sm">
                            <div className="h-24 bg-[#204ecf]"></div>
                            <CardContent className="relative pt-12 text-center">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                                        <img
                                            src={client.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.full_name)}&background=204ecf&color=fff`}
                                            alt={client.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{client.full_name}</h2>
                                <p className="text-[#204ecf] font-medium mt-1">Direct Client</p>

                                <div className="mt-6 flex flex-col gap-3 text-left">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">Joined {new Date(client.createdAt!).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-sm capitalize">{client.status} Account</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400" /> Interaction History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-gray-500 italic">No recent interactions logged.</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Projects */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-[#204ecf]" /> Assigned Projects
                            </h3>
                            <Badge variant="secondary" className="bg-gray-200">
                                {projects?.length || 0} Total
                            </Badge>
                        </div>

                        {isProjectsLoading ? (
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-32 bg-white rounded-xl animate-pulse border border-gray-100"></div>
                                ))}
                            </div>
                        ) : projects && projects.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((project: any) => (
                                    <motion.div
                                        key={project.id}
                                        whileHover={{ y: -2 }}
                                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{project.name}</h4>
                                            <p className="text-sm text-gray-500 line-clamp-1 mb-3">{project.description || 'No description provided'}</p>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`px-2 py-0.5 rounded-full font-normal ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {project.status}
                                                </Badge>
                                                <span className="text-xs text-gray-400">Created {new Date(project.start_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Progress</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500" style={{ width: `${project.progress}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-bold">{project.progress}%</span>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-[#204ecf]" asChild>
                                                <Link href={`/dashboard?project=${project.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-gray-100/50 border-dashed border-2 border-gray-200 py-12 text-center">
                                <p className="text-gray-500 italic">No projects found for this client.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ClientProfilePage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-[#204ecf]" /></div>}>
                <ClientProfileContent />
            </Suspense>
        </AuthGuard>
    );
}
