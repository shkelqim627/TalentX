'use client';

import React from 'react';
import { motion } from 'framer-motion';

const brands = [
    { name: "Kraft Heinz", style: "font-bold text-2xl" },
    { name: "Bridgestone", style: "font-bold text-xl tracking-tight" },
    { name: "Duolingo", style: "font-bold text-2xl" },
    { name: "Shopify", style: "font-bold text-2xl" },
    { name: "Calm", style: "font-light text-2xl italic" },
    { name: "USC", style: "font-bold text-2xl" }
];

export default function TrustedBrands() {
    return (
        <section className="bg-white py-16 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10">
                    Trusted by leading brands and startups
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={brand.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <span className={`${brand.style} text-[#1a1a2e] transition-colors`}>
                                {brand.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
