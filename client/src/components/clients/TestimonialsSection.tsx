'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "TalentX has been an invaluable partner in our growth. Their ability to provide top-tier talent on demand has allowed us to scale our engineering team at a pace we never thought possible.",
        author: "John Doe",
        role: "CTO at TechCorp",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
        quote: "The quality of talent we've found through TalentX is unmatched. They truly understand our needs and provide experts who hit the ground running from day one.",
        author: "Jane Smith",
        role: "VP of Engineering at InnovateSoft",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
];

export default function TestimonialsSection() {
    return (
        <section className="py-32 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-24">
                    <span className="text-[12px] font-black text-[#204ecf] uppercase tracking-[0.4em] mb-4 block underline underline-offset-8 decoration-2">
                        EXECUTIVE FEEDBACK
                    </span>
                    <h2 className="text-[48px] font-bold text-[#1a1a2e] tracking-tight">What Our Partners Say</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.author}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-12 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#204ecf]/30 transition-all duration-500 group"
                        >
                            <Quote className="w-12 h-12 text-[#204ecf] mb-10 opacity-20 group-hover:opacity-40 transition-opacity" />
                            <p className="text-[22px] text-[#1a1a2e] font-medium leading-relaxed mb-12 italic">
                                "{t.quote}"
                            </p>

                            <div className="flex items-center gap-6 pt-8 border-t border-gray-50">
                                <img
                                    src={t.image}
                                    alt={t.author}
                                    className="w-16 h-16 grayscale group-hover:grayscale-0 transition-all duration-500 rounded-none object-cover"
                                />
                                <div>
                                    <div className="text-[18px] font-bold text-[#1a1a2e] tracking-tight">{t.author}</div>
                                    <div className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
