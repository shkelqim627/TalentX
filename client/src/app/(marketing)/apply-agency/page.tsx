'use client';

import React from 'react';
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, ArrowRight, Grid, Zap, Shield, Rocket, Building2 } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

export default function ApplyAgencyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-[#1a1a2e] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/90 to-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Scale Your Agency with <span className="text-[#00cc83]">Top Clients</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            TalentX partners with elite software development and design agencies.
                            Get access to enterprise contracts and scale your team's impact.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/apply">
                                <Button className="bg-[#00cc83] hover:bg-[#03b080] text-white font-bold py-6 px-10 text-lg rounded-[4px] shadow-lg shadow-[#00cc83]/20 transition-all hover:scale-105">
                                    Apply as Partner
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold py-6 px-10 text-lg rounded-[4px] transition-all">
                                Partner Benefits
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">Why Agencies Partner with TalentX</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Focus on delivery while we handle sales, billing, and contracts.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Grid,
                                title: 'Enterprise Projects',
                                description: 'Access high-value contracts with Fortune 500s that are typically hard to reach.'
                            },
                            {
                                icon: Shield,
                                title: 'Guaranteed Payments',
                                description: 'Never worry about chasing invoices. We ensure timely payments for all your work.'
                            },
                            {
                                icon: Rocket,
                                title: 'Rapid Growth',
                                description: 'Fill your bench quickly and scale your operations without increased BD costs.'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl hover:border-transparent transition-all duration-500 text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-gray-100">
                                    <item.icon className="w-8 h-8 text-[#204ecf]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Application Process */}
            <div className="py-24 bg-[#1a1a2e] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-8">Partnership Process</h2>
                            <p className="text-xl text-gray-400 mb-12">
                                We look for agencies with a proven track record of excellence.
                            </p>

                            <div className="space-y-10">
                                {[
                                    {
                                        step: '01',
                                        title: 'Agency Profile',
                                        desc: 'Submit your agency portfolio, case studies, and team composition.'
                                    },
                                    {
                                        step: '02',
                                        title: 'Technical Audit',
                                        desc: 'We review your code quality and delivery processes.'
                                    },
                                    {
                                        step: '03',
                                        title: 'Partner Interview',
                                        desc: 'Meet with our partnerships team to align on goals and expectations.'
                                    },
                                    {
                                        step: '04',
                                        title: 'Onboarding',
                                        desc: 'Get set up on our platform and start receiving project matching.'
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="font-bold text-4xl text-gray-700 group-hover:text-[#00cc83] transition-colors">{step.step}</div>
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                                            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-[#204ecf] rounded-3xl transform -rotate-3 opacity-20 blur-2xl"></div>
                            <div className="bg-white text-[#1a1a2e] rounded-3xl shadow-2xl p-12 relative z-10 border border-white/10">
                                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                                    <Building2 className="w-10 h-10 text-[#204ecf]" />
                                </div>
                                <h3 className="text-3xl font-bold mb-6">Start Scaling Today</h3>
                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex-1">
                                        <CheckCircle className="w-6 h-6 text-[#204ecf] shrink-0" />
                                        <span className="font-bold text-gray-800">Pre-vetted enterprise project leads</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex-1">
                                        <CheckCircle className="w-6 h-6 text-[#204ecf] shrink-0" />
                                        <span className="font-bold text-gray-800">Professional billing & admin support</span>
                                    </div>
                                </div>
                                <Link href="/interview" className="block w-full">
                                    <Button className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white font-black py-7 text-xl rounded-xl shadow-xl shadow-blue-900/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                        Apply for Partnership
                                        <ArrowRight className="w-6 h-6" />
                                    </Button>
                                </Link>
                                <p className="text-center text-sm text-gray-400 mt-6 font-medium uppercase tracking-widest">Limited Slots Available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8 italic text-gray-400">"TalentX has been the single most effective growth channel for our agency in the last 24 months."</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                        <div className="text-left">
                            <p className="font-bold text-[#1a1a2e]">Marcus Thorne</p>
                            <p className="text-sm text-gray-500">CEO, Digital Alpha Systems</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
