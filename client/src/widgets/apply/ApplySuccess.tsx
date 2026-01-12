'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Calendar, Mail } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

export default function ApplySuccess() {
    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-[#00c853] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-900/20"
            >
                <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-4xl font-bold text-[#1a1a2e] mb-6">Application Submitted!</h1>
                <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
                    Thank you for applying to join the TalentX network. Our team will now review your profile.
                </p>

                <div className="grid gap-6 mb-12">
                    {[
                        {
                            icon: Clock,
                            title: "Review Timeline",
                            desc: "Due to high volume, the initial review process can take up to a month."
                        },
                        {
                            icon: Calendar,
                            title: "Next Steps",
                            desc: "If your profile matches our needs, we'll invite you for the first screening round."
                        },
                        {
                            icon: Mail,
                            title: "Stay Updated",
                            desc: "We'll send updates to your email address throughout the process."
                        }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-gray-100 text-left shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <item.icon className="w-6 h-6 text-[#204ecf]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#1a1a2e] mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Link href={createPageUrl('Home')}>
                    <Button className="h-14 px-10 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20">
                        Back to Home
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
