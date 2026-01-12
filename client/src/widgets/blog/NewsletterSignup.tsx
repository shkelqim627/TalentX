'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function NewsletterSignup() {
    return (
        <section className="py-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
                <div className="relative rounded-[40px] bg-[#0a0a1a] p-8 md:p-20 overflow-hidden text-center">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#204ecf]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#365ecc]/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 mb-8 text-[13px] font-bold tracking-widest text-[#204ecf] uppercase bg-[#204ecf]/10 rounded-full">
                            Stay Updated
                        </span>

                        <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
                            Get the latest <span className="text-[#204ecf] italic">talent insights</span> delivered to your inbox
                        </h2>

                        <p className="text-lg text-gray-400 mb-12">
                            Join 50,000+ industry leaders receiving our weekly analysis on the future of work and global talent trends.
                        </p>

                        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your business email"
                                className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#204ecf]/50 transition-all shadow-inner"
                                required
                            />
                            <button
                                type="submit"
                                className="h-14 px-8 bg-[#204ecf] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a3fb3] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#204ecf]/20"
                            >
                                Subscribe Now
                                <Send className="w-4 h-4" />
                            </button>
                        </form>

                        <p className="mt-6 text-[13px] text-gray-500">
                            No spam, only insights. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
