'use client';

import React, { useState } from 'react';
import ApplyForm from '@/widgets/apply/ApplyForm';
import ApplySuccess from '@/widgets/apply/ApplySuccess';
import { motion } from 'framer-motion';

export default function ApplyPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <main className="min-h-screen bg-[#f8fafc] py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!isSubmitted ? (
                    <>
                        <div className="text-center mb-12">
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold text-[#1a1a2e] mb-4"
                            >
                                Apply to Join TalentX
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-gray-500"
                            >
                                Join the world's most exclusive network of top freelancers.
                            </motion.p>
                        </div>
                        <ApplyForm onSuccess={() => setIsSubmitted(true)} />
                    </>
                ) : (
                    <ApplySuccess />
                )}
            </div>
        </main>
    );
}
