'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';

interface FAQSectionProps {
    category?: string;
    title?: string;
}

export default function FAQSection({ category, title = "Common Questions" }: FAQSectionProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const { data: faqs, isLoading } = useQuery({
        queryKey: ['cms-faqs', category || 'all'],
        queryFn: async () => {
            const allFaqs = await talentXApi.entities.CMS.FAQ.list();
            if (category) {
                return allFaqs.filter(f => f.category?.toLowerCase() === category.toLowerCase());
            }
            return allFaqs;
        }
    });

    return (
        <section className="py-24 bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-[#1a1a2e] text-center mb-12">{title}</h2>
                <div className="space-y-4">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-sm" />
                        ))
                    ) : (faqs || []).length === 0 ? (
                        <p className="text-center text-gray-400 italic">No FAQs available yet.</p>
                    ) : (
                        (faqs || []).map((faq, idx) => (
                            <div key={faq.id} className="bg-[#f8faff] rounded-sm overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                                >
                                    <span className="font-bold text-[#1a1a2e]">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
