'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Zap, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { talentXApi } from '@/api/talentXApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Pricing() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-[#1a1a2e] text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-bold mb-6"
                    >
                        Hire the Top 3% of Freelance Talent
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                    >
                        Simple, transparent pricing. No hidden fees. Cancel anytime.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    <div className="bg-[#204ecf] p-2 text-center">
                        <span className="text-white text-sm font-bold uppercase tracking-wider">Most Popular Choice</span>
                    </div>
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Professional Access</h2>
                            <div className="flex items-center justify-center gap-1 mb-4">
                                <span className="text-5xl font-bold text-[#1a1a2e]">$59.99</span>
                                <span className="text-gray-500 text-lg">/mo</span>
                            </div>
                            <p className="text-gray-600">Everything you need to build your dream team.</p>
                        </div>

                        <div className="space-y-4 mb-10">
                            {[
                                'Unlimited hiring requests',
                                'Access to top 3% talent network',
                                'Dedicated account manager',
                                'Risk-free trial period (2 weeks)',
                                'Intellectual property protection',
                                '24/7 Priority support'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-[#00c853]" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/hire?plan=professional" className="block w-full">
                            <Button
                                className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
                            >
                                Start Hiring Now
                            </Button>
                        </Link>
                        <p className="text-xs text-center text-gray-400 mt-4">
                            No long-term contracts. Cancel anytime.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Trust Section */}
            <div className="py-24 bg-gray-50 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Companies Choose TalentX</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <Shield className="w-10 h-10 text-[#204ecf] mb-6" />
                            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Risk-Free Trial</h3>
                            <p className="text-gray-600">
                                If you're not satisfied with the work within the first two weeks, you pay nothing. We ensure you find the perfect match.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <Zap className="w-10 h-10 text-[#204ecf] mb-6" />
                            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Fast Hiring</h3>
                            <p className="text-gray-600">
                                Hire top talent in under 48 hours. Our pre-vetted network means you skip the sourcing and screening.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <Users className="w-10 h-10 text-[#204ecf] mb-6" />
                            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Top 3% Talent</h3>
                            <p className="text-gray-600">
                                We receive thousands of applications each month, but fewer than 3% make it into our network.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-[#1a1a2e] text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "How does the trial period work?",
                                a: "Every time you hire a new freelancer, you have a trial period of up to two weeks to ensure they're the right fit. If you're not satisfied, you won't be billed."
                            },
                            {
                                q: "What happens if I want to cancel?",
                                a: "You can cancel your subscription at any time from your dashboard. Your access will continue until the end of your current billing cycle."
                            },
                            {
                                q: "Are the freelancers exclusive to TalentX?",
                                a: "Many of our freelancers work exclusively through TalentX, while others may have their own clients. However, all are vetted to our high standards."
                            }
                        ].map((item, i) => (
                            <div key={i} className="border-b border-gray-100 pb-6">
                                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{item.q}</h3>
                                <p className="text-gray-600">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
