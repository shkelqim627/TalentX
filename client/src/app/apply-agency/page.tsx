'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Grid, Zap, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function ApplyAgency() {
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
                            Scale Your Agency with <span className="text-[#00c853]">Top Clients</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            TalentX partners with elite software development and design agencies.
                            Get access to enterprise contracts and scale your team's impact.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={createPageUrl('Apply')}>
                                <Button className="bg-[#00c853] hover:bg-[#009624] text-white font-bold py-6 px-8 text-lg rounded-lg shadow-lg shadow-green-900/20">
                                    Apply as Partner
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold py-6 px-8 text-lg rounded-lg">
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
                        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Agencies Partner with TalentX</h2>
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
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="w-8 h-8 text-[#204ecf]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Application Process */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">Partnership Process</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                We look for agencies with a proven track record of excellence.
                            </p>

                            <div className="space-y-8">
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
                                    <div key={i} className="flex gap-6">
                                        <div className="font-bold text-3xl text-gray-200">{step.step}</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#1a1a2e] mb-2">{step.title}</h4>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl transform -rotate-3 opacity-10"></div>
                            <div className="bg-white rounded-2xl shadow-xl p-8 relative z-10 border border-gray-100">
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-6">Start Scaling Today</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <CheckCircle className="w-5 h-5 text-purple-600" />
                                        <span className="font-medium text-gray-800">Pre-vetted project leads</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <CheckCircle className="w-5 h-5 text-purple-600" />
                                        <span className="font-medium text-gray-800">Admin & Billing support</span>
                                    </div>
                                </div>
                                <Link href={createPageUrl('Interview')} className="w-full">
                                    <Button className="w-full mt-8 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold py-6 text-lg rounded-lg shadow-lg shadow-blue-900/20">
                                        Apply for Partnership
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
