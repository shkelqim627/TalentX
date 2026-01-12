'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, Star, Building2, Users, MapPin, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Pagination } from '@/shared/components/ui/pagination';

export default function BrowseAgenciesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const { data: agencies = [], isLoading } = useQuery({
        queryKey: ['agencies'],
        queryFn: () => talentXApi.entities.Agency.list(),
    });

    const filteredAgencies = (agencies as any[]).filter(agency => {
        return !searchQuery ||
            agency.agency_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agency.services?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
    const paginatedAgencies = filteredAgencies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <main className="min-h-screen bg-linear-to-b from-white via-gray-50/40 to-gray-100/60 pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center space-y-4"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] tracking-tight">
                        Expert Agencies for Large-Scale Projects
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Partner with world-class agencies verified for technical excellence, reliable delivery, and strategic innovation.
                    </p>
                </motion.div>

                {/* Search & Stats Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="relative w-full md:max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Search agencies by name, services, or expertise..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-14 bg-white/90 backdrop-blur-sm border-gray-200/80 focus:border-[#204ecf] focus:ring-[#204ecf]/20 text-lg shadow-sm hover:shadow-md transition-all duration-300 rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-2 px-6 py-3 bg-white/80 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-2xl font-bold text-[#204ecf]">{filteredAgencies.length}</span>
                        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Agencies Found</span>
                    </div>
                </div>

                {/* Agencies Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl h-96 animate-pulse border border-gray-100 shadow-xs"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {paginatedAgencies.map((agency, index) => (
                                    <motion.div
                                        key={agency.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        layout
                                    >
                                        <Link href={createPageUrl(`agency-profile?id=${agency.id}`)}>
                                            <Card className="h-full bg-white hover:shadow-2xl hover:shadow-[#204ecf]/5 transition-all duration-500 border-gray-100 group cursor-pointer overflow-hidden flex flex-col hover:border-[#204ecf]/20">
                                                <CardContent className="p-0 flex-1 flex flex-col">
                                                    {/* Agency Brand Header */}
                                                    <div className="p-6 flex items-start gap-4 border-b border-gray-50 bg-linear-to-br from-gray-50/50 to-white">
                                                        <div className="w-16 h-16 bg-[#1a1a2e] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 text-white group-hover:scale-105 transition-transform duration-300">
                                                            <Building2 className="w-8 h-8" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="text-xl font-bold text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors truncate">
                                                                {agency.agency_name}
                                                            </h3>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="font-bold text-sm text-gray-900">{agency.rating || 5.0}</span>
                                                                <span className="text-gray-400 text-sm">/ 5.0</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 flex-1 flex flex-col">
                                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                                            {agency.description || 'Full-service agency providing comprehensive solutions for enterprise clients and scaling startups.'}
                                                        </p>

                                                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 mt-auto">
                                                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                                <Users className="w-4 h-4 text-[#204ecf]" />
                                                                <span className="font-medium">{agency.team_size || '10+'}+ experts</span>
                                                            </div>
                                                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                                <Briefcase className="w-4 h-4 text-[#204ecf]" />
                                                                <span className="font-medium">{agency.completed_projects || 0} projects</span>
                                                            </div>
                                                            {agency.location && (
                                                                <div className="flex items-center gap-2.5 text-sm text-gray-600 col-span-2">
                                                                    <MapPin className="w-4 h-4 text-[#204ecf]" />
                                                                    <span className="font-medium">{agency.location}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {agency.services && agency.services.length > 0 && (
                                                            <div className="border-t border-gray-50 pt-5">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {agency.services.slice(0, 3).map((service: string, i: number) => (
                                                                        <span
                                                                            key={i}
                                                                            className="px-2.5 py-1 bg-gray-50 text-gray-700 text-[11px] rounded-md font-bold border border-gray-100 uppercase tracking-tighter"
                                                                        >
                                                                            {service}
                                                                        </span>
                                                                    ))}
                                                                    {agency.services.length > 3 && (
                                                                        <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[11px] rounded-md font-bold border border-gray-100">
                                                                            +{agency.services.length - 3} MORE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>

                                                <CardFooter className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                                                    {agency.min_project_size ? (
                                                        <div className="text-xs font-semibold text-gray-500">
                                                            MIN. PROJECT: <span className="text-gray-900 font-bold">${(agency.min_project_size).toLocaleString()}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs font-semibold text-gray-500">
                                                            EXPERT REPUTATION
                                                        </div>
                                                    )}
                                                    <span className="text-sm font-bold text-[#204ecf] group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5 ml-auto">
                                                        Explore Full Profile <ChevronRight className="w-4 h-4" />
                                                    </span>
                                                </CardFooter>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredAgencies.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100"
                            >
                                <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">No agencies match your criteria</h3>
                                <p className="text-gray-500">Try broadening your search or exploring different services.</p>
                            </motion.div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
