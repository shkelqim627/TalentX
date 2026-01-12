'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';

export default function Testimonials() {
    const { data: testimonials, isLoading } = useQuery({
        queryKey: ['cms-testimonials'],
        queryFn: () => talentXApi.entities.CMS.Testimonial.list()
    });

    return (
        <section className="bg-[#f9f9f9] py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] text-center mb-8">
                    Trusted by Industry Leaders
                </h2>
                {/* Header Rating */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-16 text-center"
                >
                    <span className="text-gray-600 font-medium">Clients rate TalentX</span>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-gray-900 font-bold">4.9 out of 5</span>
                    <span className="text-gray-600">on average based on 39,833 reviews.</span>
                </motion.div>

                {/* Grid */}
                <div className="flex flex-wrap justify-center gap-8">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-6 rounded-sm shadow-md w-[384px] h-[408px] animate-pulse" />
                        ))
                    ) : (testimonials || []).length === 0 ? (
                        <p className="text-gray-400 italic">No testimonials available yet.</p>
                    ) : (
                        testimonials?.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-sm shadow-md transition-shadow flex flex-col items-start text-left w-[384px] h-[408px]"
                            >
                                {/* Blue Quote Icon */}
                                <Quote className="w-6 h-6 text-[#204ecf] fill-[#204ecf] mb-4" />

                                {/* Headline */}
                                <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">
                                    {testimonial.headline}
                                </h3>

                                {/* Quote Body */}
                                <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                    {testimonial.quote}
                                </p>

                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Author Info */}
                                <div className="space-y-1">
                                    <p className="font-bold text-[#1a1a2e] text-sm">{testimonial.author}</p>
                                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    <div className="pt-4">
                                        {testimonial.logo ? (
                                            <img
                                                src={testimonial.logo}
                                                alt={testimonial.company}
                                                className="h-6 w-auto opacity-90"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{testimonial.company}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
