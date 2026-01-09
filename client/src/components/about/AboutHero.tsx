'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutHero() {
    return (
        <section className="relative h-[70vh] min-h-[600px] flex items-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop"
                    alt="TalentX Team"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <span className="inline-block mb-10 text-[13px] font-bold tracking-tight text-white/90">
                        About TalentX
                    </span>
                    <h1 className="text-[52px] md:text-[56px] lg:text-[62px] font-light text-white mb-6 leading-[1.15] tracking-tight">
                        We connect the world's top talent with the Startups, and Enterprises.
                    </h1>
                </motion.div>
            </div>
        </section>
    );
}
