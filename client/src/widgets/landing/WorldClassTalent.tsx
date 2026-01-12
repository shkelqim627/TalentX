'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Monitor,
    PenTool,
    Filter,
    Search,
    ClipboardCheck,
    UserCheck,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

const services = [
    {
        icon: Monitor,
        title: "Developers",
        description: "Seasoned software engineers, coders, and architects with expertise across hundreds of technologies.",
        highlight: false
    },
    {
        icon: PenTool,
        title: "Designers",
        description: "Expert UI, UX, Visual, and Interaction designers as well as a wide range of illustrators, animators, and more.",
        highlight: false
    },
    {
        icon: Search,
        title: "Researchers",
        description: "Finance experts, business strategists, M&A consultants, financial modelers, and more, with expertise ranging from market research to FP&A.",
        highlight: false
    },
    {
        icon: Filter,
        title: "Marketing Experts",
        description: "Experts in digital marketing, growth marketing, content creation, market research, brand strategy execution, social media marketing, and more.",
        highlight: false
    },
    {
        icon: ClipboardCheck,
        title: "Project Managers",
        description: "Digital and technical project managers, scrum masters, and more with expertise in numerous PM tools, frameworks, and styles.",
        highlight: false
    },
    {
        icon: UserCheck,
        title: "Product Managers",
        description: "Digital product managers, scrum product owners with expertise in numerous industries like banking, healthcare, ecommerce, and more.",
        highlight: false
    },
    {
        icon: TrendingUp,
        title: "Sales Experts",
        description: "Lead generation experts, SDRs, sales reps, BDRs, customer success managers, sales consultants, account managers, and more.",
        highlight: false
    }
];

export default function WorldClassTalent() {
    return (
        <section className="bg-white py-24 text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] tracking-tight">
                        Leverage World-class Talent
                    </h2>
                    <p className="mt-6 text-lg text-gray-500 font-medium opacity-90">
                        We are the largest, globally distributed network of top business, design,
                        and technology talent, ready to tackle your most important initiatives.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="border border-gray-100 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] rounded-sm overflow-hidden bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-left">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0.5 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className={`p-10 border-b border-gray-100 group transition-all duration-300 relative cursor-pointer text-left
                                    ${service.highlight ? 'bg-[#204ecf] text-white' : 'bg-white hover:bg-[#204ecf] hover:text-white'}
                                    ${(index + 1) % 3 !== 0 ? 'lg:border-r border-gray-100' : ''}
                                    ${(index + 1) % 2 !== 0 ? 'md:border-r border-gray-100 lg:border-r-inherit' : ''}
                                    ${service.highlight ? 'border-transparent' : ''}
                                `}
                            >
                                <div className="flex flex-col sm:flex-row items-start gap-6">
                                    <div className={`p-2.5 rounded-lg shrink-0 transition-colors duration-300 ${service.highlight ? 'bg-white/10' : 'bg-transparent border border-blue-50 group-hover:bg-white/10 group-hover:border-transparent'}`}>
                                        <service.icon className={`w-10 h-10 transition-colors duration-300 ${service.highlight ? 'text-white' : 'text-[#204ecf] group-hover:text-white'}`} strokeWidth={1} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className={`text-xl font-bold tracking-tight transition-colors duration-300 ${service.highlight ? 'text-white' : 'text-[#1a1a2e] group-hover:text-white'}`}>
                                                {service.title}
                                            </h3>
                                            <ArrowRight className={`w-5 h-5 transition-all duration-300 ${service.highlight ? 'text-white opacity-100' : 'text-white opacity-0 group-hover:opacity-100'}`} />
                                        </div>
                                        <p className={`text-[15px] leading-relaxed font-medium transition-colors duration-300 ${service.highlight ? 'text-blue-50/90' : 'text-gray-500 group-hover:text-blue-50/90'}`}>
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-10 lg:col-span-2 md:col-span-1 bg-gray-50/30 flex items-center text-left">
                            <div>
                                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2 tracking-tight">
                                    Plus Thousands More Skills
                                </h3>
                                <p className="text-[15px] text-gray-500 font-medium">
                                    Whatever skill or specialization your business requires, we have the top talent to meet your needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
