'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: '30,000+', label: 'CLIENTS SERVED' },
    { value: '300+', label: 'INDUSTRIES SERVED' },
    { value: '20,000+', label: 'GLOBAL TALENT' },
    { value: '16+', label: 'YEARS IN BUSINESS' },
    { value: '140+', label: 'COUNTRIES SERVED' }
];

export default function ClientsHero() {
    return (
        <section className="relative pt-32 pb-20 bg-[#001741] overflow-hidden">
            {/* Geometric Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="0,0 40,0 20,40" fill="#0c2461" />
                    <polygon points="60,0 100,0 80,60" fill="#1e3799" />
                    <polygon points="0,60 30,100 0,100" fill="#0c2461" />
                    <polygon points="70,100 100,60 100,100" fill="#1e3799" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <span className="text-[11px] font-black text-white/60 uppercase block mb-3">
                    CLIENT CASE STUDIES
                </span>
                {/* Header Section */}
                <div className="border-t border-white/10 pt-8 mb-12">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7">
                            <h1 className="text-[42px] md:text-[56px] font-bold text-white leading-[1.1] tracking-tight">
                                Trusted by Leading <br /> Companies Around the World
                            </h1>
                        </div>
                        <div className="lg:col-span-5 lg:pt-4">
                            <p className="text-[15px] md:text-[16px] text-white/80 leading-relaxed max-w-md ml-auto">
                                From Fortune 500 enterprises to fast-growing startups, we deliver exceptional results at scale. Explore our case studies to see how.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Integrated Stats Bar */}
                <div className="border-t border-white/10 pt-10">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                                className={`text-center md:text-left relative ${index !== 0 ? 'md:pl-8' : ''}`}
                            >
                                {/* Vertical Divider for Desktop */}
                                {index !== 0 && (
                                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-white/10" />
                                )}

                                <div className="text-[28px] md:text-[34px] font-bold text-white mb-1 tracking-tighter">
                                    {stat.value}
                                </div>
                                <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.15em]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
