'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const caseStudies = [
    {
        title: "Corpay",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        logo: "CORPAY",
        color: "from-blue-900/40"
    },
    {
        title: "Bridgestone",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop",
        logo: "BRIDGESTONE",
        color: "from-red-900/40"
    },
    {
        title: "Big Sur AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        logo: "BIG SUR AI",
        color: "from-green-900/40"
    },
    {
        title: "Kamylon",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
        logo: "KAMYLON",
        color: "from-purple-900/40"
    },
    {
        title: "Precision Drilling",
        image: "https://images.unsplash.com/photo-1516937622178-745583720b28?q=80&w=2070&auto=format&fit=crop",
        logo: "PRECISION DRILLING",
        color: "from-yellow-900/40"
    },
    {
        title: "Zoetis",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop",
        logo: "ZOETIS",
        color: "from-teal-900/40"
    },
    {
        title: "Kraft Heinz",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
        logo: "KRAFT HEINZ",
        color: "from-red-800/40"
    },
    {
        title: "Duolingo",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
        logo: "DUOLINGO",
        color: "from-green-600/40"
    },
    {
        title: "Shopify",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        logo: "SHOPIFY",
        color: "from-green-800/40"
    },
    {
        title: "Calm",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
        logo: "CALM",
        color: "from-blue-400/40"
    },
    {
        title: "USC",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
        logo: "USC",
        color: "from-yellow-700/40"
    },
    {
        title: "Toyota",
        image: "https://images.unsplash.com/photo-1590362891175-379e4f210086?q=80&w=2070&auto=format&fit=crop",
        logo: "TOYOTA",
        color: "from-red-600/40"
    }
];

export default function CaseStudiesGrid() {
    const row1 = [...caseStudies.slice(0, 6), ...caseStudies.slice(0, 6)];
    const row2 = [...caseStudies.slice(6, 12), ...caseStudies.slice(6, 12)];

    const cardWidth = 320; // px
    const gap = 10; // px (gap-8)
    const totalWidth = (cardWidth + gap) * 6;

    return (
        <section className="relative bg-[#001741] overflow-hidden">
            {/* Geometric Background Patterns */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="0,0 40,0 20,40" fill="#0c2461" />
                    <polygon points="60,0 100,0 80,60" fill="#1e3799" />
                    <polygon points="0,60 30,100 0,100" fill="#0c2461" />
                    <polygon points="70,100 100,60 100,100" fill="#1e3799" />
                </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-8">
                {/* Top Row: Sliding Left */}
                <div className="flex overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, -totalWidth],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            },
                        }}
                        className="flex gap-8 px-4"
                    >
                        {row1.map((study, index) => (
                            <div key={`row1-${index}`} className="w-[260px] shrink-0">
                                <CaseStudyCard study={study} index={index} />
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom Row: Sliding Right */}
                <div className="flex overflow-hidden">
                    <motion.div
                        animate={{
                            x: [-totalWidth, 0],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 45,
                                ease: "linear",
                            },
                        }}
                        className="flex gap-8 px-4"
                    >
                        {row2.map((study, index) => (
                            <div key={`row2-${index}`} className="w-[260px] shrink-0">
                                <CaseStudyCard study={study} index={index} />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function CaseStudyCard({ study, index }: { study: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (index % 6) * 0.1 }}
            className="group relative aspect-[4/5] overflow-hidden bg-gray-900 cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-500 rounded-sm"
        >
            {/* Background Image */}
            <img
                src={study.image}
                alt={study.title}
                className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-in-out"
            />

            {/* Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-b ${study.color} to-transparent opacity-40 group-hover:opacity-0 transition-opacity duration-700`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />

            {/* Logo Area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 transition-all duration-500 group-hover:-translate-y-4">
                <h3 className="text-white font-black text-[18px] md:text-[22px] tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] leading-tight transition-transform duration-500 group-hover:scale-105">
                    {study.logo}
                </h3>
            </div>

            {/* Hover Details */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 z-20">
                <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.4em] bg-white/10 px-6 py-3 border border-white/20 whitespace-nowrap">
                        VIEW STUDY <ExternalLink className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
