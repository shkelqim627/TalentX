'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, Calendar } from 'lucide-react';

const stats = [
    { icon: Calendar, value: '2026', label: 'Founded' },
    { icon: Users, value: '50,000+', label: 'Elite Professionals' },
    { icon: Globe, value: '150+', label: 'Countries' },
    { icon: Award, value: 'Top 3%', label: 'Acceptance Rate' }
];

const applicationData = [450, 600, 850, 720, 980, 1200, 1100, 1450, 1800, 1650, 2100, 2400];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StatsGrid() {
    const maxVal = Math.max(...applicationData);

    return (
        <section className="py-24 bg-white overflow-hidden relative border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center text-left">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#204ecf]/10 mb-4">
                                    <stat.icon className="w-6 h-6 text-[#204ecf]" />
                                </div>
                                <div className="text-3xl font-bold text-[#1a1a2e] mb-1">{stat.value}</div>
                                <div className="text-gray-500 font-medium uppercase tracking-wider text-[10px]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Application Graph */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h4 className="text-xl font-bold text-[#1a1a2e]">Talent Applications</h4>
                                <p className="text-sm text-gray-500">Monthly growth in network applications</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-[#204ecf]">2,400+</span>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Peak/Mo</p>
                            </div>
                        </div>

                        <div className="flex items-end justify-between h-48 gap-2">
                            {applicationData.map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${(val / maxVal) * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                        className="w-full bg-[#204ecf]/20 group-hover:bg-[#204ecf] rounded-t-sm transition-colors relative"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a2e] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {val} apps
                                        </div>
                                    </motion.div>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">{months[i]}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
