'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Activity, Cpu, ShoppingBag, Truck, Box } from 'lucide-react';

const verticals = [
    {
        title: "Fintech & Banking",
        icon: CreditCard,
        description: "Secure, scalable payment systems and high-frequency trading platforms."
    },
    {
        title: "Healthtech",
        icon: Activity,
        description: "HIPAA-compliant platforms, telemedicine, and AI-driven diagnostics."
    },
    {
        title: "AI & Machine Learning",
        icon: Cpu,
        description: "Neural network architecture and big data processing pipelines."
    },
    {
        title: "E-commerce",
        icon: ShoppingBag,
        description: "Headless commerce solutions and global marketplace scaling."
    },
    {
        title: "Logistics & Supply",
        icon: Truck,
        description: "Real-time tracking and automated warehouse management systems."
    },
    {
        title: "Enterprise SaaS",
        icon: Box,
        description: "Multi-tenant cloud architectures and complex integration layers."
    }
];

export default function IndustryVerticals() {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-24 px-4 border-l-4 border-[#204ecf] pl-10">
                    <span className="text-[12px] font-black text-[#204ecf] uppercase tracking-[0.4em] mb-4 block">
                        Domain Expertise
                    </span>
                    <h2 className="text-[42px] md:text-[56px] font-bold text-[#1a1a2e] leading-[1.1] tracking-tighter">
                        Elite Solutions Across <br /> Every Industry Vertical.
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {verticals.map((vertical, index) => (
                        <motion.div
                            key={vertical.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="mb-8">
                                <vertical.icon className="w-12 h-12 text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors stroke-[1.5]" />
                            </div>
                            <h3 className="text-[24px] font-bold text-[#1a1a2e] mb-4 tracking-tight">
                                {vertical.title}
                            </h3>
                            <p className="text-gray-500 text-[16px] leading-relaxed max-w-sm">
                                {vertical.description}
                            </p>
                            <div className="mt-8 h-[2px] w-12 bg-gray-100 group-hover:w-full group-hover:bg-[#204ecf] transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
