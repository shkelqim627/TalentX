'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { Button } from "@/shared/components/ui/button";
import { Star, Building2, Users, DollarSign, MapPin, Calendar, ArrowLeft, Loader2, Globe, CheckCircle, ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPageUrl } from '@/shared/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '@/features/auth/ui/AuthGuard';

function AgencyProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const agencyId = searchParams.get('id');
    const [loading, setLoading] = useState(false);

    const { data: agency, isLoading } = useQuery({
        queryKey: ['agency', agencyId],
        queryFn: async () => {
            const agencies = await talentXApi.entities.Agency.list();
            return agencies.find(a => a.id === agencyId);
        },
        enabled: !!agencyId
    });

    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    const { data: userProjects = [] } = useQuery({
        queryKey: ['user-projects'],
        queryFn: async () => {
            try {
                const user = await talentXApi.auth.me();
                return await talentXApi.entities.Project.filter({ client_email: user.email });
            } catch (error) {
                return [];
            }
        },
    });

    const { data: reviews = [] } = useQuery({
        queryKey: ['agency-reviews', agencyId],
        queryFn: async () => {
            if (!agencyId) return [];
            const projects = await talentXApi.entities.Project.filter({ agencyId, status: 'completed' });
            return projects.filter(p => p.clientReview);
        },
        enabled: !!agencyId
    });

    const handleHire = async () => {
        if (!agency) return;
        setLoading(true);
        try {
            const user = await talentXApi.auth.me();

            const subscriptions = await talentXApi.entities.Subscription.filter({
                user_email: user.email,
                status: 'active'
            });

            if (subscriptions.length === 0) {
                toast.error('Please subscribe to hire agencies');
                router.push(createPageUrl('Pricing'));
                return;
            }

            if (!selectedProjectId) {
                toast.error('Please select a project');
                setLoading(false);
                return;
            }

            await talentXApi.entities.HireRequest.create({
                client_name: user.full_name,
                client_email: user.email,
                hire_type: 'agency',
                matched_agency_id: agency.id,
                status: 'pending',
                data: JSON.stringify({
                    projectId: selectedProjectId
                })
            });

            toast.success('Agency hire request submitted!');
            setIsHireModalOpen(false);
            router.push(createPageUrl('Dashboard'));
        } catch (error) {
            toast.error('Please log in to hire');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || !agency) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#204ecf] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading agency profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa] pt-20 pb-12">
            {/* Back Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Link href={createPageUrl('BrowseTalent')} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#204ecf] transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Talent</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -z-0 opacity-50"></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4e] rounded-2xl flex items-center justify-center shadow-lg text-white flex-shrink-0">
                            <Building2 className="w-10 h-10" />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">{agency.agency_name}</h1>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold text-[#1a1a2e]">{agency.rating || 5.0}</span>
                                            <span>({agency.completed_projects || 0} reviews)</span>
                                        </div>
                                        {agency.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span>{agency.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            <span>Global Delivery</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsHireModalOpen(true)}
                                    disabled={loading}
                                    className="bg-[#204ecf] hover:bg-[#1a3fb3] text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-500/25"
                                >
                                    Hire Now
                                </Button>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                                {agency.description || 'A premier digital agency delivering enterprise-grade solutions. We combine strategic thinking with technical excellence to drive business growth.'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        >
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <Users className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#1a1a2e]">{agency.team_size}+</div>
                                <div className="text-xs text-gray-500 uppercase font-medium">Experts</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#1a1a2e]">${(agency.min_project_size || 5000) / 1000}k+</div>
                                <div className="text-xs text-gray-500 uppercase font-medium">Min Project</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#1a1a2e]">{agency.founded_year || '2015'}</div>
                                <div className="text-xs text-gray-500 uppercase font-medium">Founded</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-[#1a1a2e]">100%</div>
                                <div className="text-xs text-gray-500 uppercase font-medium">Success</div>
                            </div>
                        </motion.div>

                        {/* Services */}
                        {agency.services && agency.services.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Core Capabilities</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {agency.services.map((service: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-500/20 transition-colors">
                                            <div className="w-2 h-2 bg-[#204ecf] rounded-full"></div>
                                            <span className="font-medium text-gray-700">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-[#1a1a2e]">Client Reviews</h2>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100">
                                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-yellow-700">{reviews.length} completed projects</span>
                                    </div>
                                </div>
                                <div className="grid gap-6">
                                    {reviews.map((rev, i) => (
                                        <div key={rev.id} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-blue-100 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors">{rev.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">Project Completed • {new Date(rev.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</p>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= (rev.clientRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed italic border-l-2 border-blue-100 pl-4 py-1">
                                                "{rev.clientReview}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Portfolio Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#1a1a2e]">Featured Projects</h2>
                                <Button variant="ghost" className="text-[#204ecf] hover:text-[#1a3fb3]">
                                    View All <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map((item) => (
                                    <div key={item} className="group cursor-pointer">
                                        <div className="h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                        </div>
                                        <h3 className="font-bold text-[#1a1a2e] mb-1 group-hover:text-[#204ecf] transition-colors">Fintech Dashboard Redesign</h3>
                                        <p className="text-sm text-gray-500">UI/UX Design, React Development</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Industry Focus */}
                        {agency.industry_focus && agency.industry_focus.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                            >
                                <h3 className="font-bold text-[#1a1a2e] mb-4">Industry Focus</h3>
                                <div className="flex flex-wrap gap-2">
                                    {agency.industry_focus.map((industry: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg font-medium border border-gray-100"
                                        >
                                            {industry}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Tech Stack Placeholder */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'Node.js', 'Python', 'AWS', 'Flutter'].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hire Modal */}
            <AnimatePresence>
                {isHireModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1a1a2e]">Hire {agency.agency_name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">Select a project to assign this agency</p>
                                </div>
                                <button onClick={() => setIsHireModalOpen(false)} className="bg-gray-100 p-2 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700">Choose Project</label>
                                    {userProjects.length > 0 ? (
                                        <div className="grid gap-3 overflow-y-auto max-h-[300px] pr-2">
                                            {userProjects.map((project: any) => (
                                                <button
                                                    key={project.id}
                                                    onClick={() => setSelectedProjectId(project.id)}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${selectedProjectId === project.id
                                                        ? 'border-[#204ecf] bg-blue-50 ring-4 ring-blue-500/10'
                                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${selectedProjectId === project.id ? 'bg-[#204ecf] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {project.name.charAt(0)}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-bold text-[#1a1a2e]">{project.name}</div>
                                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{project.description || 'No description'}</div>
                                                        </div>
                                                    </div>
                                                    {selectedProjectId === project.id && (
                                                        <CheckCircle className="w-6 h-6 text-[#204ecf]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                            <p className="text-gray-500 mb-4">No active projects found</p>
                                            <Button
                                                variant="outline"
                                                onClick={() => router.push(createPageUrl('Dashboard'))}
                                                className="rounded-xl"
                                            >
                                                Create Project First
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={handleHire}
                                    disabled={loading || !selectedProjectId}
                                    className="w-full bg-[#204ecf] hover:bg-[#1a3fb3] text-white py-8 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Confirm Hire Request
                                            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    By clicking confirm, you agree to our terms of service regarding agency engagements.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AgencyProfilePage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#204ecf]" /></div>}>
                <AgencyProfileContent />
            </Suspense>
        </AuthGuard>
    );
}
