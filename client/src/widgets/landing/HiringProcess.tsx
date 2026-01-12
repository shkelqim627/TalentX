'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    {
        step: "1",
        title: "Talk to One of Our Industry Experts",
        description: "An expert on our team will work with you to understand your goals, technical needs, and team dynamics."
    },
    {
        step: "2",
        title: "Work With Hand-Selected Talent",
        description: "Within days, we'll introduce you to the right talent for your project. Average time to match is under 24 hours."
    },
    {
        step: "3",
        title: "The Right Fit, Guaranteed",
        description: "Work with your new team member on a trial basis (pay only if satisfied), ensuring you hire the right people for the job."
    }
];

export default function HiringProcess() {
    return (
        <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a2e]">
                        Simple Hiring Process
                    </h2>
                    <p className="text-lg text-gray-600 mt-4">Get matched with pre-vetted talent in days, not months. Our streamlined process gets you working faster.

                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative mt-20">
                    <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
                        {steps.map((item, index) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center relative"
                            >
                                <div className="relative flex items-center justify-center w-full mb-8">
                                    {/* Connector Lines & Arrows */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 left-[60%] w-[80%] h-[1px] bg-blue-200 -translate-y-1/2">
                                            <div className="absolute right-0 top-1/2 -translate-y-[4px] w-2 h-2 border-t border-r border-blue-200 rotate-45" />
                                        </div>
                                    )}

                                    {/* Step Number Bubble */}
                                    <div className="w-15 h-15 rounded-full border border-blue-200 bg-white flex items-center justify-center relative z-10">
                                        <span className="text-3xl font-light text-[#4a6cf7]">{item.step}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="max-w-xs mx-auto px-4">
                                    <h3 className="text-lg font-bold text-[#1a1a2e] mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-[13px] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
