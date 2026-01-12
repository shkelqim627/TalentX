"use client";

import React, { useState, useEffect, Suspense } from "react";
// Removed tanstack query, use simple fetch for now as I don't have provider set up easily or just useState
import { talentXApi } from "@/shared/api/talentXApi";
import { Button } from "@/shared/components/ui/button";
import {
    Star,
    MapPin,
    Briefcase,
    DollarSign,
    CheckCircle,
    ArrowLeft,
    Loader2,
    Globe,
    Award,
    Clock,
    Sparkles,
    X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createPageUrl } from "@/shared/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AuthGuard from '@/features/auth/ui/AuthGuard';
import { Talent } from "@/shared/types";

function TalentProfileContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const talentId = searchParams.get("id");
    const [talent, setTalent] = useState<(Talent & { id: string }) | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userProjects, setUserProjects] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);

    // Fetch talent
    useEffect(() => {
        if (!talentId) return;
        const fetchTalent = async () => {
            try {
                const talents = await talentXApi.entities.Talent.list();
                const found = talents.find((t) => t.id === talentId);
                if (found) setTalent(found);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTalent();
    }, [talentId]);

    // Fetch user projects and talent reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await talentXApi.auth.me();
                if (user && user.email) {
                    const projects = await talentXApi.entities.Project.filter({ client_email: user.email });
                    setUserProjects(projects);
                }

                if (talentId) {
                    const talentProjects = await talentXApi.entities.Project.filter({ talentId, status: 'completed' });
                    setReviews(talentProjects.filter(p => p.clientReview));
                }
            } catch (error) {
                console.log("Could not fetch additional data", error);
            }
        };
        fetchData();
    }, [talentId]);

    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [hireData, setHireData] = useState({
        rateType: "hourly",
        rateAmount: 0,
        projectId: "",
        projectName: "",
    });

    useEffect(() => {
        if (talent) {
            setHireData((prev) => ({ ...prev, rateAmount: talent.hourly_rate || 0 }));
        }
    }, [talent]);

    const handleHire = async () => {
        if (!talent) return;
        setIsLoading(true);
        try {
            const user = await talentXApi.auth.me();

            // Check subscription
            const subscriptions = await talentXApi.entities.Subscription.filter({
                user_email: user.email,
                status: "active",
            });

            if (subscriptions.length === 0) {
                toast.error("Please subscribe to hire talent");
                router.push(createPageUrl("Pricing"));
                return;
            }

            const finalProjectId = hireData.projectId;

            if (!finalProjectId || finalProjectId === "new") {
                toast.error("Please select a project");
                setIsLoading(false);
                return;
            }

            // Create hire request with refined details
            await talentXApi.entities.HireRequest.create({
                client_name: user.full_name,
                client_email: user.email,
                hire_type: "talent",
                category: talent.category,
                matched_talent_id: talent.id,
                status: "pending",
                // Add rate and project details to metadata if supported,
                // but better yet, we'll implement a proper membership creation in backend
                data: JSON.stringify({
                    projectId: finalProjectId,
                    rateType: hireData.rateType,
                    rateAmount: hireData.rateAmount,
                }),
            });

            toast.success("Hire request submitted successfully!");
            setIsHireModalOpen(false);
            router.push(createPageUrl("Dashboard"));
        } catch (error: unknown) {
            console.error("Hire request failed:", error);
            const message =
                (error as { response?: { data?: { message?: string } } })?.response
                    ?.data?.message || "Failed to submit hire request";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading || !talent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-gray-50/40 to-gray-100/60">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#204ecf] animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading talent profile...</p>
                </div>
            </div>
        );
    }

    const roundedRating = talent.rating
        ? parseFloat(talent.rating.toString()).toFixed(1)
        : null;
    const previousCompanies =
        typeof talent.previous_companies === "string"
            ? JSON.parse(talent.previous_companies)
            : talent.previous_companies || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/40 to-gray-100/60 pt-20 pb-16">
            {/* Back Navigation */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
            >
                <Link
                    href={createPageUrl("BrowseTalent")}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#204ecf] transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Browse</span>
                </Link>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden"
                        >
                            <div className="px-8 pt-8 pb-6">
                                <div className="flex items-start gap-6 mb-6">
                                    {/* Profile Image */}
                                    <div className="relative shrink-0">
                                        <Image
                                            src={
                                                talent.image_url ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    talent.full_name
                                                )}&size=200`
                                            }
                                            alt={talent.full_name}
                                            width={120}
                                            height={120}
                                            unoptimized
                                            className="w-[120px] h-[120px] rounded-2xl border-[3px] border-gray-200 shadow-lg object-cover"
                                        />
                                        {talent.availability === "available" && (
                                            <div
                                                className="absolute bottom-0 right-0 w-6 h-6 bg-[#00c853] border-[3px] border-white rounded-full shadow-md"
                                                title="Available Now"
                                            ></div>
                                        )}
                                    </div>

                                    {/* Name and Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-2">
                                                    {talent.full_name}
                                                </h1>
                                                <p className="text-xl text-[#204ecf] font-semibold mb-4">
                                                    {talent.title}
                                                </p>
                                            </div>
                                            {roundedRating && (
                                                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 shrink-0">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-bold text-yellow-700">
                                                        {roundedRating}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            {talent.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">{talent.location}</span>
                                                </div>
                                            )}
                                            {talent.experience_years && (
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                                    <span className="font-medium">
                                                        {talent.experience_years} years
                                                    </span>
                                                </div>
                                            )}
                                            {talent.hourly_rate && (
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    <span className="font-bold text-[#1a1a2e]">
                                                        ${talent.hourly_rate}/hr
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">Remote / Hybrid</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-6 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        className="hidden sm:flex border-gray-200 hover:bg-gray-50"
                                    >
                                        Save Profile
                                    </Button>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 sm:flex-initial"
                                    >
                                        <Button
                                            className="w-full sm:w-auto bg-[#204ecf] hover:bg-[#1a3da8] text-white shadow-lg shadow-[#204ecf]/25 font-semibold px-8"
                                            onClick={() => setIsHireModalOpen(true)}
                                            disabled={isLoading}
                                        >
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Hire Now
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-8"
                        >
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">About</h2>
                            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                                {talent.bio ||
                                    `${talent.full_name} is a highly skilled ${talent.title} with over ${talent.experience_years} years of experience delivering high-quality solutions for clients worldwide. Specialized in building scalable applications and intuitive user interfaces.`}
                            </p>
                        </motion.div>

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.5 }}
                                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-8"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-[#1a1a2e]">Client Reviews</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{reviews.length} completed projects</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {reviews.map((rev, i) => (
                                        <div key={rev.id} className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 relative group transition-all hover:bg-white hover:shadow-md hover:border-blue-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors">{rev.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                        <span>Project Completed</span>
                                                        <span>•</span>
                                                        <span>{new Date(rev.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= (rev.clientRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <div className="text-3xl text-blue-200/40 absolute -left-1 -top-2 font-serif">"</div>
                                                <p className="text-gray-600 text-sm italic leading-relaxed pl-4">
                                                    {rev.clientReview}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Experience Section */}
                        {previousCompanies.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-8"
                            >
                                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">
                                    Work History
                                </h2>
                                <div className="space-y-5">
                                    {previousCompanies.map((company: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1 }}
                                            className="flex gap-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#204ecf]/10 to-[#204ecf]/5 rounded-xl flex items-center justify-center shrink-0 border border-[#204ecf]/10">
                                                <Briefcase className="w-6 h-6 text-[#204ecf]" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-[#1a1a2e] mb-1">
                                                    {company}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Senior Role • 2020 - Present
                                                </p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    Led key initiatives and delivered critical projects
                                                    contributing to company growth.
                                                </p>
                                            </div>
                                        </motion.div>
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
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6"
                        >
                            <h3 className="font-bold text-xl text-[#1a1a2e] mb-5">
                                Skills & Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2.5">
                                {talent.skills?.map((skill, i) => (
                                    <motion.span
                                        key={i}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        className="px-3.5 py-2 bg-gray-50 text-gray-700 text-sm rounded-lg font-medium border border-gray-200 hover:bg-[#204ecf]/5 hover:border-[#204ecf]/30 hover:text-[#204ecf] transition-all duration-200"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6"
                        >
                            <h3 className="font-bold text-xl text-[#1a1a2e] mb-5">
                                Performance
                            </h3>
                            <div className="space-y-3">
                                <motion.div
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100/80 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white rounded-lg shadow-sm">
                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        </div>
                                        <span className="font-semibold text-yellow-900">
                                            Rating
                                        </span>
                                    </div>
                                    <span className="font-bold text-lg text-yellow-700">
                                        {roundedRating || "5.0"}/5.0
                                    </span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100/80 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white rounded-lg shadow-sm">
                                            <Award className="w-5 h-5 text-green-600" />
                                        </div>
                                        <span className="font-semibold text-green-900">
                                            Success Rate
                                        </span>
                                    </div>
                                    <span className="font-bold text-lg text-green-700">100%</span>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100/80 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-white rounded-lg shadow-sm">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="font-semibold text-blue-900">
                                            On-time Delivery
                                        </span>
                                    </div>
                                    <span className="font-bold text-lg text-blue-700">98%</span>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Certifications Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 p-6"
                        >
                            <h3 className="font-bold text-xl text-[#1a1a2e] mb-5">
                                Certifications
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">
                                    <CheckCircle className="w-5 h-5 text-[#204ecf]" />
                                    <span className="text-sm font-medium text-gray-700">
                                        AWS Certified Solutions Architect
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50/50 transition-colors">
                                    <CheckCircle className="w-5 h-5 text-[#204ecf]" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Google Professional Cloud Developer
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            {/* Hire Modal */}
            <AnimatePresence>
                {isHireModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200/80"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#204ecf]/5 to-[#204ecf]/10">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1a1a2e]">
                                        Hire {talent.full_name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Configure your hiring terms
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsHireModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
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
                                    <label className="block text-sm font-bold text-gray-700">
                                        Assign to Project
                                    </label>
                                    <select
                                        className="w-full text-gray-900 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#204ecf] focus:ring-2 focus:ring-[#204ecf]/20 outline-none transition-all bg-white hover:border-gray-300"
                                        value={hireData.projectId}
                                        onChange={(e) =>
                                            setHireData({ ...hireData, projectId: e.target.value })
                                        }
                                    >
                                        <option value="">Select a Project</option>
                                        {userProjects.map((p: { id: string; name: string }) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <Button
                                            onClick={handleHire}
                                            disabled={isLoading}
                                            className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white py-6 rounded-xl font-bold shadow-lg shadow-[#204ecf]/25 transition-all flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                "Confirm Hiring"
                                            )}
                                        </Button>
                                    </motion.div>
                                    <p className="text-xs text-center text-gray-500 mt-4 px-4 leading-relaxed">
                                        By clicking confirm, you agree to TalentX&apos;s Terms of
                                        Service and hiring policies.
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
        <AuthGuard>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#204ecf]" /></div>}>
                <TalentProfileContent />
            </Suspense>
        </AuthGuard>
    );
}
