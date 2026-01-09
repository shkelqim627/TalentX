'use client';

import React from 'react';
import { motion } from 'framer-motion';

const authors = [
    {
        name: "Lubos Volkov",
        role: "Product Design Lead",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    },
    {
        name: "Sebastian Gherman",
        role: "Director of Product",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400&h=400&fit=crop"
    }
];

export default function EdgeHero() {
    return (
        <section className="relative pt-32 pb-40 overflow-hidden bg-[#001741]">
            {/* Geometric Faceted Background */}
            <div className="absolute inset-0 z-0">
                <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="facet1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0a2e7a" />
                            <stop offset="100%" stopColor="#001741" />
                        </linearGradient>
                    </defs>
                    <polygon points="0,0 400,0 200,300" fill="#0c2e7a" opacity="0.3" />
                    <polygon points="400,0 1000,0 700,400" fill="#082563" opacity="0.4" />
                    <polygon points="0,300 200,300 100,600" fill="#0c2e7a" opacity="0.2" />
                    <polygon points="200,300 700,400 400,700" fill="#0a2e7a" opacity="0.3" />
                    <polygon points="700,400 1000,0 1000,600" fill="#082563" opacity="0.4" />
                    <polygon points="400,700 700,400 1000,600 800,900" fill="#0c2e7a" opacity="0.2" />
                    <polygon points="100,600 400,700 200,900" fill="#082563" opacity="0.3" />
                    <polygon points="0,300 0,1000 200,900" fill="#0c2e7a" opacity="0.2" />
                    <polygon points="200,900 800,900 600,1000" fill="#082563" opacity="0.3" />
                    <polygon points="800,900 1000,600 1000,1000" fill="#0c2e7a" opacity="0.4" />
                </svg>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase mb-4">
                            TalentX Core Team Blog
                        </span>
                        <h1 className="text-[52px] md:text-[72px] font-light text-white mb-8 leading-tight">
                            TalentX Edge
                        </h1>
                        <p className="max-w-md text-[16px] text-white/80 leading-relaxed">
                            TalentX Edge showcases the experience, expertise, and perspectives of TalentX's core team members, the people building the greatest talent company in the world.
                        </p>
                    </motion.div>

                    {/* Right: Featured Authors */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col lg:items-end"
                    >
                        <div className="w-full lg:max-w-md">
                            <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase mb-8 w-full lg:text-center">
                                Featured TalentX Authors
                            </span>
                            <div className="grid grid-cols-2 gap-6">
                                {authors.map((author) => (
                                    <div key={author.name} className="flex flex-col">
                                        <div className="aspect-square bg-white/5 overflow-hidden mb-4 group ring-1 ring-white/10 hover:ring-white/30 transition-all shadow-2xl shadow-black/40">
                                            <img
                                                src={author.image}
                                                alt={author.name}
                                                className="w-full h-full object-cover grayscale brightness-90 contrast-110 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500"
                                            />
                                        </div>
                                        <h3 className="text-[15px] font-bold text-white mb-1">{author.name}</h3>
                                        <p className="text-[13px] text-white/50">{author.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
