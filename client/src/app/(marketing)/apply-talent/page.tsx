'use client';

import React from 'react';
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, ArrowRight, Globe, Zap, Shield, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

export default function ApplyTalentPage() {
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
                            Join the <span className="text-[#00cc83]">Top 3%</span> of Global Talent
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
                            TalentX is an exclusive network of the world's top freelancers.
                            We connect the best software developers, designers, and finance experts
                            with top companies.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/apply">
                                <Button className="bg-[#00cc83] hover:bg-[#03b080] text-white font-bold py-6 px-10 text-lg rounded-[4px] shadow-lg shadow-[#00cc83]/20 transition-all hover:scale-105">
                                    Apply Now
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 font-bold py-6 px-10 text-lg rounded-[4px] transition-all">
                                How it Works
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">Why Top Talent Joins TalentX</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We provide the freedom of freelancing with the stability of full-time employment.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Globe,
                                title: 'Work from Anywhere',
                                description: 'Choose your own schedule and work from anywhere in the world. We are a 100% remote network.'
                            },
                            {
                                icon: DollarSign,
                                title: 'Top Compensation',
                                description: 'Set your own rates. Our experts earn significantly more than the industry average.'
                            },
                            {
                                icon: Zap,
                                title: 'Exciting Projects',
                                description: 'Work on challenging projects with leading Fortune 500 companies and innovative startups.'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group"
                            >
                                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#204ecf] group-hover:rotate-12 transition-all duration-500">
                                    <item.icon className="w-10 h-10 text-[#204ecf] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4 group-hover:text-[#204ecf] transition-colors">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Application Process */}
            <div className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-6">The Screening Process</h2>
                            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                                Our rigorous screening process ensures that we only accept the very best.
                                It's tough, but the rewards are worth it.
                            </p>

                            <div className="space-y-12">
                                {[
                                    {
                                        step: '01',
                                        title: 'Language & Personality',
                                        desc: 'We evaluate communication skills and personality traits to ensure a great cultural fit.'
                                    },
                                    {
                                        step: '02',
                                        title: 'In-Depth Skill Review',
                                        desc: 'We test your technical knowledge and problem-solving abilities through various assessments.'
                                    },
                                    {
                                        step: '03',
                                        title: 'Live Screening',
                                        desc: 'You will be interviewed by screeners who are experts in your functional domain.'
                                    },
                                    {
                                        step: '04',
                                        title: 'Test Projects',
                                        desc: 'We assign a test project to see how you perform in a real-world scenario.'
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="font-black text-5xl text-gray-200 group-hover:text-[#204ecf]/20 transition-colors duration-300 tabular-nums">{step.step}</div>
                                        <div>
                                            <h4 className="text-xl font-bold text-[#1a1a2e] mb-2 group-hover:translate-x-1 transition-transform">{step.title}</h4>
                                            <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-[#204ecf] to-purple-600 rounded-3xl transform rotate-3 opacity-10"
                                animate={{ rotate: [3, 0, 3] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            ></motion.div>
                            <div className="bg-white rounded-3xl shadow-2xl p-10 relative z-10 border border-gray-100">
                                <h3 className="text-3xl font-bold text-[#1a1a2e] mb-10">Ready to join the elite?</h3>
                                <div className="space-y-6">
                                    {[
                                        'Access to Fortune 500 projects',
                                        'Guaranteed automated payments',
                                        'Career growth and mentorship',
                                        'Global network of top experts'
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-4 p-5 bg-green-50/50 rounded-2xl border border-green-100/50 group hover:bg-green-50 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-[#00cc83] flex items-center justify-center shrink-0">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-bold text-gray-800">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/interview" className="block w-full">
                                    <Button className="w-full mt-10 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-black py-7 text-xl rounded-xl shadow-xl shadow-blue-900/20 group transition-all hover:scale-[1.02]">
                                        Start Your Application
                                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <p className="text-center text-sm text-gray-400 mt-6">Takes less than 5 minutes to get started</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <Shield className="w-16 h-16 text-[#204ecf] mx-auto mb-8 opacity-20" />
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">Talent-First Philosophy</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-10">
                        We believe that top talent deserves top-tier treatment. From streamlined billing to high-impact projects, we handle the logistics so you can focus on what you do best.
                    </p>
                    <Link href="/about" className="text-[#204ecf] font-bold hover:underline flex items-center justify-center gap-2">
                        Learn about our mission <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
