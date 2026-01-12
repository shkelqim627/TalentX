'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/shared/components/ui/button";
import { Users, Layout, Zap, Star, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import TrustedBrands from '@/widgets/landing/TrustedBrands';

function BrowseTeamsContent() {
    const searchParams = useSearchParams();
    const spec = searchParams.get('spec');

    const teamSpecs = {
        'agile_squads': {
            title: 'Agile Squads',
            description: 'Cross-functional teams designed for rapid product iteration and delivery.',
            icon: Zap
        },
        'product_teams': {
            title: 'Product Teams',
            description: 'End-to-end teams focused on building and scaling complete software products.',
            icon: Layout
        },
        'growth_teams': {
            title: 'Growth Teams',
            description: 'Data-driven teams specialized in user acquisition and retention metrics.',
            icon: Star
        },
        'mvp_dev': {
            title: 'MVP Development Teams',
            description: 'Specialized teams for launching zero-to-one products in record time.',
            icon: Users
        },
        'scale_up': {
            title: 'Scale-up Teams',
            description: 'Engineering excellence teams to help you expand your technical capacity.',
            icon: Shield
        },
        'enterprise': {
            title: 'Enterprise Transformation',
            description: 'Strategic teams for modernizing legacy systems and large-scale deployments.',
            icon: Zap
        }
    };

    const currentSpec = spec && teamSpecs[spec as keyof typeof teamSpecs] ? teamSpecs[spec as keyof typeof teamSpecs] : null;

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 bg-[#1a1a2e] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#204ecf_0%,transparent_70%)]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                            Hire {currentSpec ? currentSpec.title : 'High-Performance Teams'}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            {currentSpec ? currentSpec.description : 'Assemble elite cross-functional teams in days, not months. Pre-vetted experts ready to scale your vision.'}
                        </p>
                        <div className="pt-8">
                            <Link href={createPageUrl('Pricing')}>
                                <Button className="bg-[#00cc83] hover:bg-[#03b080] text-white font-bold px-10 py-7 text-lg rounded-[4px] shadow-xl shadow-[#00cc83]/20 transition-all hover:scale-105">
                                    Discuss Your Team Needs
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <TrustedBrands />

            {/* Team Types Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e]">Specialized Team Solutions</h2>
                        <p className="mt-4 text-gray-600">Select the right team structure for your project goals.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.entries(teamSpecs).map(([key, item]) => (
                            <Link key={key} href={`/browse-teams?spec=${key}`}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className={`p-8 bg-white rounded-2xl border transition-all duration-300 ${spec === key ? 'border-[#204ecf] shadow-xl ring-1 ring-[#204ecf]/20' : 'border-gray-100 shadow-sm hover:shadow-lg'}`}
                                >
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                        <item.icon className="w-6 h-6 text-[#204ecf]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                        {item.description}
                                    </p>
                                    <div className="flex items-center text-[#204ecf] font-bold text-sm">
                                        Learn more <ArrowRight className="w-4 h-4 ml-2" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a2e]">Why Hire a Whole Team?</h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'Immediate Corehesion', desc: 'Skip the "storming" phase. Our teams have established workflows and shared experience.' },
                                    { title: 'Full Stack Coverage', desc: 'Get every role you need, from product strategy to DevOps, in a single integrated unit.' },
                                    { title: 'Managed Performance', desc: 'Teams are overseen by experienced leads to ensure delivery targets are met consistently.' }
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1a1a2e] mb-1">{benefit.title}</h4>
                                            <p className="text-sm text-gray-500">{benefit.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative border-4 border-[#1a1a2e] p-8 rounded-2xl bg-gray-50">
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Active Team</p>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-sm font-bold text-[#1a1a2e]">FinTech Innovation Squad</p>
                                    <p className="text-xs text-gray-500">5 Members • Est. Completion: 12 Weeks</p>
                                </div>
                                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#204ecf] w-2/3"></div>
                                </div>
                                <p className="text-xs text-right font-bold text-[#204ecf]">68% Momentum</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 border-t border-gray-100 bg-gray-50 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">Ready to scale your engineering team?</h2>
                    <p className="text-gray-600 mb-8">Discuss your requirements with our team advisors today.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/pricing">
                            <Button className="w-full sm:w-auto bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold px-10 py-6 rounded-[4px] text-lg">
                                View Pricing
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="outline" className="w-full sm:w-auto border-gray-200 text-[#1a1a2e] font-bold px-10 py-6 rounded-[4px] text-lg">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function BrowseTeamsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white"><Loader2 className="w-8 h-8 animate-spin text-[#204ecf]" /></div>}>
            <BrowseTeamsContent />
        </Suspense>
    );
}
