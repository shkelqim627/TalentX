'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, CheckCircle2, Palette, TrendingUp, Globe, Briefcase, Target, Zap } from 'lucide-react';
import GlobalMap from '../map/GlobalMap';
import { Talent, Team, Agency } from '@/shared/types';

// Mock data for the map
const mapTalents = Array.from({ length: 1250 }).map(() => ({
    coordinates: {
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 360,
    }
})) as Talent[];

const mapTeams = Array.from({ length: 250 }).map(() => ({
    coordinates: {
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 360,
    }
})) as Team[];

const mapAgencies = Array.from({ length: 125 }).map(() => ({
    coordinates: {
        lat: (Math.random() - 0.5) * 160,
        lng: (Math.random() - 0.5) * 360,
    }
})) as Agency[];

const categories = [
    { id: 'developers', name: 'Developers', icon: Code },
    { id: 'designers', name: 'Designers', icon: Palette },
    { id: 'researchers', name: 'Researchers', icon: Globe },
    { id: 'marketing', name: 'Marketing Experts', icon: TrendingUp },
    { id: 'project_managers', name: 'Project Managers', icon: Briefcase },
    { id: 'product_managers', name: 'Product Managers', icon: Target },
    { id: 'sales', name: 'Sales Experts', icon: Zap },
];

const talentData: Record<string, {
    name: string;
    role: string;
    image: string;
    verified: boolean;
    domain: string;
    expertise: string[];
    company: string;
    companyLogo: string;
}[]> = {
    developers: [
        {
            name: "Alexander M.",
            role: "Full-Stack Developer",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
            verified: true,
            domain: "Software Engineering",
            expertise: ["React", "Node.js", "AWS"],
            company: "Google",
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
        },
        {
            name: "Sofia R.",
            role: "Backend Engineer",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
            verified: true,
            domain: "Backend Architecture",
            expertise: ["Python", "Go", "Kubernetes"],
            company: "Meta",
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg"
        },
        {
            name: "Kaito T.",
            role: "Frontend Specialist",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            verified: true,
            domain: "UI Productivity",
            expertise: ["Next.js", "TypeScript", "Tailwind"],
            company: "AirBnB",
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Belo.svg"
        }
    ],
    designers: [
        {
            name: "Emma W.",
            role: "Product Designer",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            verified: true,
            domain: "UX/UI Design",
            expertise: ["Figma", "Interaction", "Prototyping"],
            company: "Apple",
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        },
        {
            name: "Lucas G.",
            role: "Visual Designer",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            verified: true,
            domain: "Visual Identity",
            expertise: ["Adobe CC", "Branding", "Motion"],
            company: "Nike",
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
        },
        {
            name: "Zoe B.",
            role: "Motion Designer",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
            verified: true,
            domain: "Motion Graphics",
            expertise: ["After Effects", "Rive", "Spline"],
            company: "Netflix",
            companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        }
    ],
    marketing: [],
    management: [],
    project_managers: [],
    product_managers: [],
    sales: [],
};

export default function TalentNetwork() {
    const [activeCategory, setActiveCategory] = useState('developers');

    const currentTalents = talentData[activeCategory] || [];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
                        Meet Talent in Our Network
                    </h2>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap justify-center gap-x-6 mb-6 p-3 border-b border-t border-gray-300">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-2 py-2 text-sm font-semibold transition-all whitespace-nowrap hover:rounded-md border-b-2 
                                ${activeCategory === cat.id
                                    ? 'bg-[#1a237e] text-white rounded-md'
                                    : 'border-transparent text-black/90 hover:text-[#1a237e]'}`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex flex-wrap justify-center gap-6">
                    <AnimatePresence mode="popLayout">
                        {currentTalents.map((talent, index) => (
                            <motion.div
                                key={`${activeCategory}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white border border-gray-200 p-2 shadow-lg transition-shadow w-[250px]"
                            >
                                <div className="p-3 relative flex justify-center">
                                    <img
                                        src={talent.image}
                                        alt={talent.name}
                                        className="relative w-[210px] h-[210px] object-cover overflow-hidden mx-auto"
                                    />
                                    <div className="absolute bottom-2 left-6 bg-white p-1 shadow-sm z-10">
                                        <Code className="w-3 h-3 text-[#204ecf]" />
                                    </div>
                                </div>

                                <div className="space-y-4 p-2 text-left">
                                    <div>
                                        <h3 className="font-bold text-[#1a1a2e] text-lg">{talent.name}</h3>
                                        {talent.verified && (
                                            <div className="flex items-center gap-1 mt-1 text-xs text-[#00c853] font-medium">
                                                <CheckCircle2 className="w-3 h-3 fill-current" />
                                                Verified Expert <span className="text-gray-400 font-normal">in {talent.domain}</span>
                                            </div>
                                        )}
                                        <div className="mt-2 text-[#204ecf] text-sm font-medium flex items-center gap-2">
                                            <span>{'</>'}</span>
                                            {talent.role}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">EXPERTISE</p>
                                        <div className="flex flex-wrap gap-2 text-left">
                                            {talent.expertise.map((skill: string) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 bg-white border border-gray-200 text-xs text-gray-600 font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">PREVIOUSLY AT</p>
                                        <div className="h-8 flex items-center">
                                            <img src={talent.companyLogo} alt={talent.company} className="h-6 w-auto opacity-80" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Functional Map Chart Card */}
                    <motion.div
                        className="bg-[#050510] overflow-hidden relative group min-h-[300px] border border-gray-100 h-[400px] w-[320px]"
                    >
                        <GlobalMap
                            talents={mapTalents}
                            teams={mapTeams}
                            agencies={mapAgencies}
                            className="w-full h-full absolute inset-0"
                        />
                        <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-left">
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-gray-300">Live Activity</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
