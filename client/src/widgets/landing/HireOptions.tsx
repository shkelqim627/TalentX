'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/shared/components/ui/button";
import { User, Users, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

const hiringOptions = [
    {
        title: "Individual Talent",
        description: "Scale your internal capabilities with elite subject matter experts and specialized contractors.",
        icon: User,
        color: "#204ecf",
        lightColor: "rgba(32, 78, 207, 0.05)",
        features: [
            "Top 3% Technical Assessment",
            "Flexible Hourly or Fixed Rates",
            "Rapid Onboarding (48-72h)",
            "Integrated Time Tracking"
        ],
        link: createPageUrl('BrowseTalent'),
        buttonLabel: "Hire Individual"
    },
    {
        title: "Managed Teams",
        description: "Deploy pre-vetted, high-performance teams with established delivery workflows and history.",
        icon: Users,
        color: "#00cc83",
        lightColor: "rgba(0, 204, 131, 0.05)",
        features: [
            "Cohesive Delivery Units",
            "Tech Lead & PM Included",
            "Outcome-Based Billing",
            "Full Lifecycle Ownership"
        ],
        link: createPageUrl('BrowseTeams'),
        buttonLabel: "Deploy Team",
        featured: true
    },
    {
        title: "Certified Agencies",
        description: "Partner with industry-leading agencies for end-to-end strategic projects and institutional support.",
        icon: Building2,
        color: "#7c3aed",
        lightColor: "rgba(124, 58, 237, 0.05)",
        features: [
            "End-to-End Project Execution",
            "Service Level Guarantees",
            "Scalable Resource Pools",
            "Enterprise-Grade Compliance"
        ],
        link: createPageUrl('BrowseAgencies'),
        buttonLabel: "Partner with Agency"
    }
];

export default function HireOptions() {
    return (
        <section className="relative py-24 bg-[#fcfcfd] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-50/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl text-left"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#204ecf] text-xs font-bold tracking-wider uppercase mb-4">
                            Deployment Models
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] mb-6 leading-[1.1]">
                            Flexible Hiring for <span className="text-[#204ecf]">Startups, SMEs & Enterprises</span>
                        </h2>
                        <p className="text-xl text-gray-500 leading-relaxed">
                            Select the engagement model that perfectly aligns with your technical requirements and operational velocity.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/global-map">
                            <Button variant="outline" className="h-14 px-8 border-gray-200 text-[#1a1a2e] bg-white hover:bg-gray-50 rounded-xl transition-all shadow-sm group">
                                Explore Talent Map
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {hiringOptions.map((option, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className={`relative group bg-white p-8 sm:p-10 rounded-lg border transition-all duration-500 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:translate-y-[-4px] text-left ${option.featured
                                ? 'border-[#204ecf]/20 ring-1 ring-[#204ecf]/5'
                                : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {option.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#204ecf] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg shadow-blue-200">
                                    Most Recommended
                                </div>
                            )}

                            <div className="relative mb-8 inline-block h-12 w-12">
                                <motion.div
                                    animate={{
                                        y: [0, -4, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="flex items-center justify-center w-full h-full"
                                >
                                    <option.icon
                                        className="w-8 h-8 transition-all duration-500 group-hover:scale-110"
                                        style={{ color: '#1a1a2e' }}
                                    />
                                </motion.div>
                            </div>

                            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4 group-hover:text-[#204ecf] transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-gray-500 mb-8 leading-relaxed h-[72px]">
                                {option.description}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {option.features.map((feature: string, fIdx: number) => (
                                    <li key={fIdx} className="flex items-center text-sm font-medium text-gray-700">
                                        <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 text-[#00cc83]" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link href={option.link} className="block mt-auto">
                                <Button
                                    className={`w-full h-10 rounded-full text-base font-bold cursor-pointer transition-all duration-300 ${option.featured
                                        ? 'bg-[#1a1a2e] text-white hover:bg-[#00cc83] hover:text-white'
                                        : 'bg-[#1a1a2e] text-white hover:bg-[#00cc83] hover:text-white'
                                        }`}
                                >
                                    {option.buttonLabel}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
