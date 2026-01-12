'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="pt-5 pb-2 w-full pb-26">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                            We Ready 24 Hours
                        </span>
                    </div>

                    {/* Title: Refined size */}
                    <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-5">
                        Ready to Hire Top Talent?
                    </h2>

                    {/* Benefits integrated into Paragraph */}
                    <p className="text-base md:text-lg text-gray-400 leading-relaxed px-4">
                        Join thousands of companies who trust TalentX.
                        Enjoy <span className="text-white font-medium">no hiring fees</span> and a
                        <span className="text-white font-medium"> risk-free trial period</span> for every hire.
                    </p>

                    {/* Buttons Layout */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-10">
                        <Link href="/browse-talent">
                            {/* Primary Button: Pill with white circle */}
                            <div className="group relative flex items-center bg-[#3b66f5] hover:bg-[#3258d4] pl-7 pr-1.5 py-1.5 rounded-full transition-all cursor-pointer shadow-lg shadow-blue-500/10">
                                <span className="text-white font-bold text-base mr-5">
                                    Hire Top Talent
                                </span>
                                <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-[#3b66f5] transition-transform group-hover:translate-x-1">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>

                        <Link href="/pricing">
                            <div className="px-8 py-3 rounded-full border border-white/20 bg-white/3 backdrop-blur-md text-white font-semibold text-base transition-all hover:bg-white/10 hover:border-white/40 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,0,0,0.1)]">
                                View Pricing
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
