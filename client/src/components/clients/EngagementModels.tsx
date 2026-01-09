'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Lightbulb } from 'lucide-react';

const models = [
    {
        title: "Strategic Squads",
        icon: Users,
        description: "Full-stack development teams managed by TalentX to deliver end-to-end product requirements.",
        points: ["Dedicated Lead", "Agile Management", "Rapid Delivery"]
    },
    {
        title: "Expert Staffing",
        icon: UserPlus,
        description: "Individual niche experts integrated into your existing team to boost velocity and depth.",
        points: ["Seamless Integration", "Top 3% Talent", "Flexible Scaling"]
    },
    {
        title: "Solution Partnerships",
        icon: Lightbulb,
        description: "Outcome-based consulting sessions to solve specific technical or architectural bottlenecks.",
        points: ["Architecture Audit", "Security Review", "Tech Roadmapping"]
    }
];

export default function EngagementModels() {
    return (
        <section className="py-32 bg-[#001741] relative overflow-hidden">
            {/* Geometric Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="100,0 100,100 0,100" fill="#204ecf" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-[12px] font-black text-[#204ecf] uppercase tracking-[0.4em] mb-4 block">
                        How We Partner
                    </span>
                    <h2 className="text-[42px] md:text-[56px] font-bold text-white tracking-tighter leading-tight">
                        Flexible Models for <br /> Global Engineering Teams.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {models.map((model, index) => (
                        <motion.div
                            key={model.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 group hover:bg-white/10 transition-all duration-500"
                        >
                            <div className="w-16 h-16 bg-[#204ecf] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                                <model.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-[28px] font-bold text-white mb-6 tracking-tight">
                                {model.title}
                            </h3>
                            <p className="text-white/60 text-[16px] leading-relaxed mb-10">
                                {model.description}
                            </p>
                            <ul className="space-y-4">
                                {model.points.map((point) => (
                                    <li key={point} className="flex items-center gap-3 text-white/80 text-[14px] font-bold uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-[#204ecf]" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
