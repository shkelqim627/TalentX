'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogHero() {
    return (
        <section className="relative pt-32 pb-40 overflow-hidden bg-[#001741]">
            {/* Network Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="network" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                            <circle cx="0" cy="0" r="1" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#network)" />
                    {/* Add some diagonal lines for the network look */}
                    <line x1="0" y1="0" x2="1000" y2="1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <line x1="1000" y1="0" x2="0" y2="1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <line x1="0" y1="500" x2="1000" y2="500" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                    <line x1="500" y1="0" x2="500" y2="1000" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-[52px] md:text-[64px] font-light text-white mb-8 leading-tight">
                            TalentX Blog
                        </h1>
                        <p className="max-w-xl text-[16px] text-white/80 mb-10 leading-relaxed">
                            The TalentX Blog is the top hub for developers, designers, management consultants, executives, and entrepreneurs, featuring key technology updates, tutorials, freelancer resources, and management insights.
                        </p>

                        {/* Stats & Link Row */}
                        <div className="flex flex-wrap items-center gap-6 mb-12">
                            <div className="flex items-center gap-3 px-4 py-2 border border-white/20 rounded-lg text-white/70">
                                <Share2 className="w-4 h-4" />
                                <span className="text-[12px] font-bold tracking-widest uppercase">12k shares</span>
                            </div>
                            <div className="text-white/60 text-[14px]">
                                TalentX core team members share their experience, expertise, and perspectives on the <Link href="/core-team/blog" className="border border-white/40 px-3 py-1 ml-2 inline-block hover:border-white hover:text-white transition-colors">TalentX Edge Blog</Link>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-2xl relative group">
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                className="w-full h-16 bg-transparent border border-white/20 rounded-sm px-14 text-white placeholder-white/40 focus:outline-none focus:border-white transition-all"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
                        </div>
                    </motion.div>

                    {/* Right Column: Featured Logos */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:flex flex-col items-center lg:items-end justify-center h-full pt-10"
                    >
                        <div className="text-right w-full lg:max-w-[400px]">
                            <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase mb-8 w-full text-center">
                                Featured in
                            </span>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-[4/3] bg-[#0c2e7a] border border-white/5 flex items-center justify-center p-6 shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-bold text-xl tracking-tighter shrink-0 flex items-center">
                                            <span className="text-white">S</span>
                                            <div className="flex flex-col -gap-1 ml-1">
                                                <span className="text-[8px] leading-none text-white/50 uppercase">Smashing</span>
                                                <span className="text-[8px] leading-none text-white/50 uppercase">Magazine</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="aspect-[4/3] bg-[#0c2e7a] border border-white/5 flex items-center justify-center p-6 shadow-2xl">
                                    <span className="text-white text-3xl font-serif font-black tracking-tighter italic">Forbes</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
