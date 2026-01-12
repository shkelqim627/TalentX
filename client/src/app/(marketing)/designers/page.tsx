'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Globe, Search, ShieldCheck, Zap, Palette, Shield, Users, Clock, ChevronDown } from 'lucide-react';
import TrustedBrands from '@/widgets/landing/TrustedBrands';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import HiringProcess from '@/widgets/landing/HiringProcess';
import Testimonials from '@/widgets/landing/Testimonials';

const designers = [
    {
        name: "Sarah Jenkins",
        role: "UI/UX Designer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
        verified: true,
        company: "Google",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    },
    {
        name: "David Chen",
        role: "Product Designer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
        verified: true,
        company: "Figma",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg"
    },
    {
        name: "Elena Rodriguez",
        role: "Brand Designer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
        verified: true,
        company: "Adobe",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Adobe_Corporate_logo.svg"
    },
    {
        name: "Michael Chen",
        role: "Visual Designer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
        verified: true,
        company: "Google",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
    },
    {
        name: "Sophie Thompson",
        role: "Motion Designer",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
        verified: true,
        company: "Apple",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
    },
    {
        name: "Thomas Anderson",
        role: "UX Researcher",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
        verified: true,
        company: "Microsoft",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
    },
    {
        name: "Emma Wilson",
        role: "Product Designer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
        verified: true,
        company: "Netflix",
        companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
    }
];

const skills = [
    { name: "Figma", category: "Design Tool" },
    { name: "Adobe XD", category: "Prototyping" },
    { name: "Sketch", category: "UI Design" },
    { name: "InVision", category: "Collaboration" },
    { name: "After Effects", category: "Motion" },
    { name: "Principle", category: "Animation" },
    { name: "Webflow", category: "Development" },
    { name: "ProtoPie", category: "Interaction" }
];

import FAQSection from '@/widgets/landing/FAQSection';

export default function DesignersPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-10 pb-32 overflow-hidden">
                <div className="absolute top-10 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
                    <Globe className="w-full h-full text-[#1a1a2e]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl lg:text-6xl font-bold text-[#1a1a2e] leading-[1.1]">
                                Hire the <span className="relative inline-block"><span className="relative z-10">Top 10%</span><span className="absolute bottom-1 left-0 w-full h-[2px] bg-black/80"></span></span> of Designers
                            </h1>
                            <p className="mt-8 text-lg text-gray-600 leading-relaxed">
                                TalentX connects you with world-class UI/UX, product, and brand designers. Our experts have built products for the world's leading brands and startups.
                            </p>

                            <div className="mt-12 space-y-6">
                                <Link href={createPageUrl('Pricing')}>
                                    <Button className="bg-[#00c853] hover:bg-[#00b34a] text-white font-bold px-8 py-6 text-lg rounded-[4px] shadow-lg shadow-[#00c853]/20 transition-all hover:scale-105 active:scale-95">
                                        Hire a Top Designer
                                    </Button>
                                </Link>
                                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 px-1">
                                    No-Risk Trial, Pay Only If Satisfied.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {designers.slice(0, 6).map((dev, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
                                >
                                    <div className="relative z-10">
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img
                                                src={dev.image}
                                                alt={dev.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-3 left-3 bg-white p-1.5 shadow-sm rounded-sm">
                                                <div className="w-2 h-2 bg-[#204ecf] rotate-45" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/40 backdrop-blur-[1px]">
                                            <h3 className="text-sm font-bold text-[#204ecf] truncate">{dev.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <CheckCircle2 className="w-3 h-3 text-[#00c853] fill-current" />
                                                <span className="text-[10px] font-bold text-gray-900">Verified Expert</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-1 font-medium">{dev.role}</p>

                                            <div className="mt-4 pt-4 border-t border-gray-50">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Previously at</p>
                                                <div className="mt-2 h-6 flex items-center">
                                                    <img
                                                        src={dev.companyLogo}
                                                        alt={dev.company}
                                                        className="h-full w-auto opacity-70 grayscale hover:grayscale-0 transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <TrustedBrands />

            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">Design Experts for Every Need</h2>
                        <p className="mt-4 text-gray-600">Hire specialists across UX, UI, Product, and Visual Design.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {skills.map((skill, idx) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-sm hover:shadow-lg transition-all text-center group cursor-pointer">
                                <Palette className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-[#1a1a2e] block">{skill.name}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">{skill.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <HiringProcess />

            <section className="py-24 bg-[#f8faff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">Why Top Companies Choose TalentX Designers</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: ShieldCheck, title: "Curated Talent", desc: "We hand-select designers with proven track records from world-class design agencies and tech companies." },
                            { icon: Zap, title: "Fast Matching", desc: "Get introduced to the right designer for your specific aesthetic and technical needs within 48 hours." },
                            { icon: Shield, title: "Design Quality", desc: "Ensure your product looks and feels premium with experts who understand modern design systems and user psychology." }
                        ].map((benefit, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <benefit.icon className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-4">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Testimonials />

            <FAQSection category="Designer" />

            <section className="py-16 border-t border-gray-100 bg-white">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 px-4">
                    <span className="text-lg text-gray-900 font-medium">Top Designers are in high demand.</span>
                    <Link href={createPageUrl('Pricing')}>
                        <Button className="bg-[#00d084] hover:bg-[#00ba76] text-white font-bold px-10 py-6 rounded-[4px] text-lg transition-all hover:scale-105">
                            Start Hiring
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
