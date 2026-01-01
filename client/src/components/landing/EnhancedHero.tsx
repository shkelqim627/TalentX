'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Filter, Box, Pen, ChevronLeft, ChevronRight, Code } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/utils';

const TALENTS = [
    {
        name: "Cheryl Da Silva",
        role: "Marketing Strategist",
        expertise: "Marketing",
        company: "Previously at Google",
        brand: "Google",
        image: "/images/person/1.png",
        successRate: "99%",
        type: "Marketing",
        location: { x: "15%", y: "25%" } // NYC/US East
    },
    {
        name: "Andre N. Walker",
        role: "Brand Strategist",
        expertise: "Branding",
        company: "Previously at Uber",
        brand: "Uber",
        image: "/images/person/0.png",
        successRate: "98%",
        type: "Branding",
        location: { x: "42%", y: "30%" } // Europe/London
    },
    {
        name: "Adrian Gonzalez",
        role: "AI Product Manager",
        expertise: "Product",
        company: "Previously at Microsoft",
        brand: "Microsoft",
        image: "/images/person/2.png",
        successRate: "100%",
        type: "Product",
        location: { x: "75%", y: "35%" } // Asia/China
    },
    {
        name: "Jensen",
        role: "Product Designer",
        expertise: "UI/UX Design",
        company: "Previously at Apple",
        brand: "Apple",
        image: "/images/person/3.png",
        successRate: "97%",
        type: "Design",
        location: { x: "10%", y: "40%" } // SF/US West
    },
    {
        name: "Sarah Jenkins",
        role: "Full Stack Engineer",
        expertise: "Engineering",
        company: "Previously at Meta",
        brand: "Meta",
        image: "/images/person/4.png",
        successRate: "99%",
        type: "Engineering",
        location: { x: "20%", y: "45%" } // Menlo Park
    },
    {
        name: "Marcus Thorne",
        role: "Senior Data Scientist",
        expertise: "Data Science",
        company: "Previously at Netflix",
        brand: "Netflix",
        image: "/images/person/5.png",
        successRate: "98%",
        type: "Product",
        location: { x: "45%", y: "25%" } // Los Gatos
    },
    {
        name: "Elena Petrova",
        role: "Product Designer",
        expertise: "Visual Design",
        company: "Previously at Spotify",
        brand: "Spotify",
        image: "/images/person/6.png",
        successRate: "100%",
        type: "Design",
        location: { x: "55%", y: "30%" } // Stockholm
    }
];

const HERO_DATA = {
    talent: {
        title: <>Hire the <span className="relative inline-block"><span className="relative z-10">Top 10%</span><span className="absolute bottom-1 left-0 w-full h-[2px] bg-black/80"></span></span> of Global Talent</>,
        description: "TalentX is an exclusive network of the top software developers, designers, finance experts, product managers, and project managers in the world.",
        ctaSecondary: "Apply as a Talent",
        ctaSecondaryLink: 'ApplyTalent',
        ctaPrimaryLink: 'BrowseTalent'
    },
    team: {
        title: <>AI-Managed <span className="relative inline-block"><span className="relative z-10 text-primary">Performance</span><span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/20 -z-0 transform -skew-x-12"></span></span> Teams</>,
        description: "Scale your engineering capacity instantly with high-performance, autonomous teams managed by our proprietary AI for peak execution.",
        ctaSecondary: "View Team Models",
        ctaSecondaryLink: 'AboutUs',
        ctaPrimaryLink: 'BrowseTeams'
    },
    agency: {
        title: <>Vetted Premium <span className="relative inline-block"><span className="relative z-10 text-primary">Partner</span><span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/20 -z-0 transform -skew-x-12"></span></span> Network</>,
        description: "Partner with world-class development and design agencies. We've pre-vetted the top boutique firms to handle your large-scale initiatives.",
        ctaSecondary: "Partner With Us",
        ctaSecondaryLink: 'ApplyAgency',
        ctaPrimaryLink: 'BrowseAgencies'
    }
};

export default function EnhancedHero() {
    const [activeTab, setActiveTab] = useState<'talent' | 'team' | 'agency'>('talent');
    const [talentIndex, setTalentIndex] = useState(0);

    useEffect(() => {
        if (activeTab !== 'talent') return;

        const container = document.getElementById('talent-carousel-container');
        const activeCard = document.getElementById(`talent-card-${talentIndex}`);

        if (container && activeCard) {
            const scrollLeft = activeCard.offsetLeft - container.offsetWidth / 2 + activeCard.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }

        const interval = setInterval(() => {
            setTalentIndex((prev) => (prev + 1) % TALENTS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeTab, talentIndex]);

    const currentTalent = TALENTS[talentIndex];
    const content = HERO_DATA[activeTab];

    return (
        <section className="relative pt-12 pb-0 bg-[#d2d6e2] overflow-hidden min-h-[900px]">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f5f7fa] to-[#eef2f7] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Top Tab Switcher - Custom Toggle */}
                <div className="flex justify-center items-center gap-4 mb-16">
                    <span className="text-[14px] font-medium text-black">I'm looking for</span>
                    <div className="inline-flex items-center bg-[#dce4ee]/50 p-1.5 rounded-full border border-[#aeb6cd] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
                        {(['talent', 'team', 'agency'] as const).map((id) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`relative px-5 py-2 rounded-full text-[14px] font-bold transition-colors duration-300 capitalize ${activeTab === id
                                    ? 'text-[#2563eb]'
                                    : 'text-[#2d3748] hover:text-black'
                                    }`}
                            >
                                {activeTab === id && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute inset-0 bg-white border-[2.5px] border-[#2563eb] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.08)]"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
                    {/* Left Content */}
                    <div className="pb-12 pr-6">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a2e] leading-[1.15] tracking-tight">
                                {content.title}
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                                {content.description}
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <Link href={createPageUrl(content.ctaPrimaryLink as any)}>
                                    <Button className="h-12 px-8 text-base font-bold bg-[#00d084] hover:bg-[#00ba76] text-white shadow-xl shadow-[#00d084]/20 hover:shadow-[#00d084]/30 border-none transition-all duration-300 transform hover:-translate-y-1 rounded-sm">
                                        {activeTab === 'talent' ? 'Hire Top Talent' : activeTab === 'team' ? 'Build a Squad' : 'Partner with Agencies'}
                                    </Button>
                                </Link>
                                <Link href={createPageUrl(content.ctaSecondaryLink as any)}>
                                    <Button className="h-12 px-8 bg-[#ffffff]/50 text-base text-[#2d3748] border-2 border-primary hover:border-primary hover:text-primary hover:bg-transparent transition-all duration-300 transform hover:-translate-y-1">
                                        {content.ctaSecondary}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content - Featured Visuals */}
                    <div className="relative hidden lg:block h-full min-h-[550px] -mt-20">
                        {/* Interactive Elements (Outer) */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />

                        <div className="relative z-10 flex items-center justify-center h-full pt-0">
                            <AnimatePresence mode="wait">
                                {activeTab === 'talent' ? (
                                    <motion.div
                                        key={`talent-${talentIndex}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="relative w-full max-w-2xl flex items-center justify-center"
                                    >
                                        <div className="relative flex items-center justify-center w-full">
                                            {/* Centered Talent Portrait */}
                                            <motion.div
                                                initial={{ scale: 1.05, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 1 }}
                                                className="relative z-10 ml-[-15%]"
                                            >
                                                <img
                                                    src={currentTalent.image}
                                                    alt={currentTalent.name}
                                                    className="w-full max-w-[380px] h-auto object-cover"
                                                    style={{
                                                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                                    }}
                                                />
                                            </motion.div>

                                            {/* Bottom Smoke Effect */}
                                            <div className="absolute bottom-0 left-1/2 -translate-x-[60%] w-[120%] h-48 z-20 pointer-events-none">
                                                <motion.div
                                                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5], y: [0, -10, 0] }}
                                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute bottom-[-20%] left-0 w-full h-full bg-white/60 blur-[60px] rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.7, 0.4], x: [-30, 30, -30] }}
                                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute bottom-[-30%] left-[-10%] w-[120%] h-full bg-primary/20 blur-[80px] rounded-full"
                                                />
                                                <div className="absolute -bottom-12 left-0 w-full h-32 bg-gradient-to-t from-[#d2d6e2] via-[#d2d6e2]/95 to-transparent z-30" />
                                            </div>

                                            {/* Reference Style Info Box */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8, duration: 0.6 }}
                                                className="absolute -right-8 top-1/2 -translate-y-1/2 z-40"
                                            >
                                                <div
                                                    className="relative bg-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] w-[242px] min-h-[300px] pb-4 overflow-hidden rounded-[4px]"
                                                    style={{
                                                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 35px 100%, 0 calc(100% - 35px))'
                                                    }}
                                                >
                                                    {/* TalentX Watermark */}
                                                    <div className="absolute top-3 right-4 z-50 pointer-events-none select-none">
                                                        <span className="text-[10px] font-black tracking-widest text-black opacity-[0.8] uppercase">TalentX</span>
                                                    </div>
                                                    {/* World Map Header */}
                                                    <div><img src="/images/map/map.png" alt="world_map" className="w-full h-[120px]" /></div>

                                                    <div className="p-6">
                                                        <h3 className="text-[18px] font-bold text-[#2563eb] mb-1.5 tracking-tight">
                                                            {currentTalent.name}
                                                        </h3>

                                                        <div className="flex items-center gap-1.5 mb-2">
                                                            <img src="/images/badges/verified.png" alt="verified" className="w-3 h-3" />

                                                            <p className="text-[11px] font-bold text-[#0fb36f]">
                                                                Verified Expert <span className="text-gray-400 font-medium whitespace-nowrap">in {currentTalent.expertise}</span>
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-2 mb-8">
                                                            <div className="text-gray-300">
                                                                {currentTalent.type === 'Marketing' || currentTalent.type === 'Branding' ? (
                                                                    <Filter className="w-3.5 h-3.5" />
                                                                ) : currentTalent.type === 'Product' ? (
                                                                    <Box className="w-3.5 h-3.5" />
                                                                ) : currentTalent.type === 'Engineering' ? (
                                                                    <Code className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <Pen className="w-3.5 h-3.5" />
                                                                )}
                                                            </div>
                                                            <p className="text-[12px] font-semibold text-gray-700 tracking-tight leading-tight">{currentTalent.role}</p>
                                                        </div>

                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Previously at</p>
                                                            <div className="flex items-center">
                                                                <span className="text-[24px] font-black text-black/30 tracking-tighter uppercase select-none">
                                                                    {currentTalent.brand}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ) : activeTab === 'team' ? (
                                    <motion.div
                                        key="team-view"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-xl border border-white/50 p-8 w-full max-w-md"
                                    >
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#1a1a2e]">AI-Managed Squad</h4>
                                                <p className="text-xs text-green-500 font-bold uppercase tracking-wider">Active Execution</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { role: "Team Lead", status: "Synchronized", color: "bg-blue-500" },
                                                { role: "Senior Frontend", status: "Developing", color: "bg-green-500" },
                                                { role: "Backend Architect", status: "Testing", color: "bg-purple-500" },
                                                { role: "QA Engineer", status: "Reviewing", color: "bg-yellow-500" }
                                            ].map((member, i) => (
                                                <motion.div
                                                    key={member.role}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/40"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${member.color}`} />
                                                        <span className="text-sm font-semibold text-gray-700">{member.role}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{member.status}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-center">
                                            <div className="flex-1 border-r border-gray-100">
                                                <p className="text-xl font-bold text-[#1a1a2e]">48h</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase">Setup</p>
                                            </div>
                                            <div className="flex-1 border-r border-gray-100">
                                                <p className="text-xl font-bold text-[#1a1a2e]">99.9%</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase">Uptime</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xl font-bold text-[#1a1a2e]">Full</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase">Ownership</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="agency-view"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="bg-[#1a1a2e]/90 backdrop-blur-xl text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden w-full max-w-md"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px]" />
                                        <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Partner Excellence</h4>
                                        <h3 className="text-2xl font-bold mb-4">Elite Agency Network</h3>
                                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                            Access top-tier development shops specializing in complex enterprise digital transformation.
                                        </p>

                                        <div className="grid grid-cols-2 gap-4">
                                            {["FinTech Mastery", "E-commerce Scale", "AI Integration", "Cloud Migration", "Cyber Security", "Mobile First"].map((skill) => (
                                                <div key={skill} className="flex items-center gap-2 group cursor-default">
                                                    <div className="w-1.5 h-1.5 bg-secondary rounded-full group-hover:scale-150 transition-transform" />
                                                    <span className="text-xs font-medium text-gray-300">{skill}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-10 bg-white/5 border border-white/10 rounded-xl p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold uppercase text-gray-500">Global Coverage</span>
                                                <span className="text-xs text-primary font-bold">24/7 Available</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "85%" }}
                                                    transition={{ duration: 1.5 }}
                                                    className="h-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Bottom Talent Selector - Carousel Style */}
                <div className="mt-20 relative max-w-6xl mx-auto px-4 group/carousel">
                    <div className="flex items-center gap-4 relative">
                        {/* Navigation Arrows */}
                        <button
                            onClick={() => {
                                setTalentIndex((prev) => (prev - 1 + TALENTS.length) % TALENTS.length);
                            }}
                            className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all z-50 bg-white/80 backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex-1 overflow-hidden">
                            <div
                                id="talent-carousel-container"
                                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x scroll-smooth"
                            >
                                {TALENTS.map((talent, i) => (
                                    <motion.div
                                        key={talent.name}
                                        id={`talent-card-${i}`}
                                        onClick={() => setTalentIndex(i)}
                                        whileHover={{ y: -4 }}
                                        className={`cursor-pointer group relative bg-white border rounded-sm overflow-hidden transition-all duration-300 flex-shrink-0 w-[240px] snap-center ${talentIndex === i
                                            ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20 bg-blue-50/10'
                                            : 'border-gray-100/80 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex h-[110px]">
                                            {/* Left Side: Portrait */}
                                            <div className="w-[100px] h-full bg-gray-50/50 overflow-hidden flex-shrink-0 relative">
                                                <img
                                                    src={talent.image}
                                                    alt={talent.name}
                                                    className={`w-full h-full object-cover object-top transition-transform duration-500 ${talentIndex === i ? 'scale-110 grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                                                />
                                                {/* Tag decoration like in image */}
                                                {talentIndex === i && (
                                                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-600 z-10 clip-corner"
                                                        style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
                                                )}
                                            </div>

                                            {/* Right Side: Info */}
                                            <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
                                                <div className="space-y-1">
                                                    <p className="text-[12px] font-bold text-gray-800 truncate">{talent.name}</p>
                                                    <div className="flex items-center gap-1.5 opacity-70">
                                                        {talent.type === 'Marketing' || talent.type === 'Branding' ? (
                                                            <Filter className="w-2.5 h-2.5" />
                                                        ) : talent.type === 'Product' ? (
                                                            <Box className="w-2.5 h-2.5" />
                                                        ) : talent.type === 'Engineering' ? (
                                                            <Code className="w-2.5 h-2.5" />
                                                        ) : (
                                                            <Pen className="w-2.5 h-2.5" />
                                                        )}
                                                        <p className="text-[9px] font-semibold text-gray-500 truncate">{talent.role}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <p className="text-[7px] text-gray-400 font-bold uppercase tracking-wider mb-1">Previously at</p>
                                                    <p className="text-[14px] font-bold text-gray-900 leading-none tracking-tighter truncate">{talent.brand}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setTalentIndex((prev) => (prev + 1) % TALENTS.length);
                            }}
                            className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all z-50 bg-white/80 backdrop-blur-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .clip-corner {
                    clip-path: polygon(0 0, 100% 100%, 0 100%);
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}