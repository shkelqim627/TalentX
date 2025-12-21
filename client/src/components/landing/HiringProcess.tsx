'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, UserCheck, Rocket } from 'lucide-react';

const steps = [
    {
        icon: MessageSquare,
        step: "01",
        title: "Talk to One of Our Experts",
        description: "An expert on our team will work with you to understand your goals, technical needs, and team dynamics."
    },
    {
        icon: Search,
        step: "02",
        title: "Review Candidates",
        description: "Within days, we'll introduce you to the right talent for your project. Average time to match is under 24 hours."
    },
    {
        icon: UserCheck,
        step: "03",
        title: "Select Your Talent",
        description: "Interview candidates and decide who's the best fit. No obligations if you're not satisfied."
    },
    {
        icon: Rocket,
        step: "04",
        title: "Start Building",
        description: "Hit the ground running with your new team member. We handle all the administrative work."
    }
];

export default function HiringProcess() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e]">
                        Simple Hiring Process
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                        Get matched with pre-vetted talent in days, not months.
                        Our streamlined process gets you working faster.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((item, index) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative"
                        >
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gray-200 -translate-x-1/2" />
                            )}

                            <div className="bg-white rounded-xl p-6 h-full hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[#00c853]/10 rounded-xl flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-[#00c853]" />
                                    </div>
                                    <span className="text-4xl font-bold text-gray-400 opacity-50">{item.step}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}