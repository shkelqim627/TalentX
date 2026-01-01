'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/api/talentXApi';
import { Button } from "@/components/ui/button";
import { Star, MapPin, Briefcase, DollarSign, CheckCircle, ArrowLeft, Loader2, Globe, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { X } from 'lucide-react';

function TalentProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [talentId, setTalentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTalentId(searchParams.get('id'));
    }, [searchParams]);

    const { data: talent, isLoading } = useQuery({
        queryKey: ['talent', talentId],
        queryFn: async () => {
            const talents = await talentXApi.entities.Talent.list();
            return talents.find(t => t.id === talentId);
        },
        enabled: !!talentId
    });

    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hireData, setHireData] = useState({
        rateType: 'hourly',
        rateAmount: 0,
        projectId: '',
        projectName: '',
    });

    const { data: userProjects = [] } = useQuery({
        queryKey: ['user-projects'],
        queryFn: async () => {
            const user = await talentXApi.auth.me();
            return await talentXApi.entities.Project.filter({ client_email: user.email });
        },
    });

    useEffect(() => {
        if (talent) {
            setHireData(prev => ({ ...prev, rateAmount: talent.hourly_rate || 0 }));
        }
    }, [talent]);

    const handleHire = async () => {
        if (!talent) return;
        setLoading(true);
        try {
            const user = await talentXApi.auth.me();

            // Check subscription
            const subscriptions = await talentXApi.entities.Subscription.filter({
                user_email: user.email,
                status: 'active'
            });

            if (subscriptions.length === 0) {
                toast.error('Please subscribe to hire talent');
                router.push(createPageUrl('Pricing'));
                return;
            }

            let finalProjectId = hireData.projectId;

            if (!finalProjectId || finalProjectId === 'new') {
                toast.error('Please select a project');
                setLoading(false);
                return;
            }

            // Create hire request with refined details
            await talentXApi.entities.HireRequest.create({
                client_name: user.full_name,
                client_email: user.email,
                hire_type: 'talent',
                category: talent.category,
                matched_talent_id: talent.id,
                status: 'pending',
                // Add rate and project details to metadata if supported, 
                // but better yet, we'll implement a proper membership creation in backend
                data: JSON.stringify({
                    projectId: finalProjectId,
                    rateType: hireData.rateType,
                    rateAmount: hireData.rateAmount
                })
            });

            toast.success('Hire request submitted successfully!');
            setIsHireModalOpen(false);
            router.push(createPageUrl('Dashboard'));
        } catch (error: any) {
            console.error('Hire request failed:', error);
            const message = error.response?.data?.message || 'Failed to submit hire request';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || !talent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading talent profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fa] pt-20 pb-12">
            {/* Back Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <Link href={createPageUrl('BrowseTalent')} className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Browse</span>
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            <div className="h-32 bg-gradient-to-r from-[#1a1a2e] to-[#204ecf]"></div>
                            <div className="px-8 pb-8">
                                <div className="relative flex justify-between items-end -mt-12 mb-6">
                                    <div className="relative">
                                        <img
                                            src={talent.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.full_name)}&size=200`}
                                            alt={talent.full_name}
                                            className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
                                        />
                                        {talent.availability === 'available' && (
                                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#00c853] border-2 border-white rounded-full" title="Available Now"></div>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="hidden sm:flex">
                                            Save Profile
                                        </Button>
                                        <Button className="bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25" onClick={() => setIsHireModalOpen(true)} disabled={loading}>
                                            Hire Now
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">{talent.full_name}</h1>
                                    <p className="text-xl text-primary font-medium mb-4">{talent.title}</p>

                                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
                                        {talent.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span>{talent.location}</span>
                                            </div>
                                        )}
                                        {talent.experience_years && (
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <span>{talent.experience_years} years exp.</span>
                                            </div>
                                        )}
                                        {talent.hourly_rate && (
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <span className="font-semibold text-[#1a1a2e]">${talent.hourly_rate}/hr</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            <span>Remote / Hybrid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                        >
                            <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">About</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {talent.bio || `${talent.full_name} is a highly skilled ${talent.title} with over ${talent.experience_years} years of experience delivering high-quality solutions for clients worldwide. Specialized in building scalable applications and intuitive user interfaces.`}
                            </p>
                        </motion.div>

                        {/* Experience Section */}
                        {talent.previous_companies && talent.previous_companies.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Work History</h2>
                                <div className="space-y-6">
                                    {talent.previous_companies.map((company, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Briefcase className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1a1a2e]">{company}</h3>
                                                <p className="text-sm text-gray-500 mb-2">Senior Role • 2020 - Present</p>
                                                <p className="text-sm text-gray-600">Led key initiatives and delivered critical projects contributing to company growth.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Skills Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Skills & Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {talent.skills?.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg font-medium border border-gray-100"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Performance</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <span className="font-medium text-yellow-900">Rating</span>
                                    </div>
                                    <span className="font-bold text-yellow-700">{talent.rating || 5.0}/5.0</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Award className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="font-medium text-green-900">Success</span>
                                    </div>
                                    <span className="font-bold text-green-700">100%</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium text-blue-900">On-time</span>
                                    </div>
                                    <span className="font-bold text-blue-700">98%</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Certifications Placeholder */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Certifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <span>AWS Certified Solutions Architect</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <span>Google Professional Cloud Developer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Hire Modal */}
            <AnimatePresence>
                {isHireModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary/5">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1a1a2e]">Hire {talent.full_name}</h3>
                                    <p className="text-sm text-gray-500">Configure your hiring terms</p>
                                </div>
                                <button onClick={() => setIsHireModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Rate Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700">Hiring Rate</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setHireData({ ...hireData, rateType: 'hourly', rateAmount: talent.hourly_rate || 0 })}
                                            className={`py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${hireData.rateType === 'hourly' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            <span className="font-bold">Hourly</span>
                                            <span className="text-xs">${talent.hourly_rate || 0}/hr</span>
                                        </button>
                                        <button
                                            onClick={() => setHireData({ ...hireData, rateType: 'monthly', rateAmount: (talent.hourly_rate || 0) * 160 })}
                                            className={`py-3 px-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${hireData.rateType === 'monthly' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                        >
                                            <span className="font-bold">Monthly</span>
                                            <span className="text-xs">${(talent.hourly_rate || 0) * 160}/mo</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Project Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700">Assign to Project</label>
                                    <select
                                        className="w-full text-black px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-primary outline-none transition-all bg-white"
                                        value={hireData.projectId}
                                        onChange={(e) => setHireData({ ...hireData, projectId: e.target.value })}
                                    >
                                        <option value="">Select a Project</option>
                                        {userProjects.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>

                                    {/* Project creation removed as per user request */}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        onClick={handleHire}
                                        disabled={loading}
                                        className="w-full bg-primary hover:bg-primary-hover text-white py-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Hiring'}
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-400 mt-4 px-6">
                                        By clicking confirm, you agree to TalentX's Terms of Service and hiring policies.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function TalentProfile() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <TalentProfileContent />
        </Suspense>
    );
}
