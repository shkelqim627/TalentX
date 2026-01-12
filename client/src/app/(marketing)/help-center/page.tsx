'use client';

import React from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { Input } from "@/shared/components/ui/input";

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <HelpCircle className="w-16 h-16 text-[#204ecf] mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Help Center</h1>
                    <p className="text-xl text-gray-600 mb-8">How can we help you today?</p>

                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input placeholder="Search for help..." className="pl-10 h-12" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { title: 'Getting Started', desc: 'Learn the basics of using TalentX' },
                        { title: 'Hiring Process', desc: 'How to find and hire talent' },
                        { title: 'Payments & Billing', desc: 'Subscription and payment information' },
                        { title: 'Account Settings', desc: 'Manage your account and preferences' }
                    ].map((topic) => (
                        <div key={topic.title} className="border border-gray-200 rounded-xl p-6 hover:border-[#204ecf] hover:shadow-lg transition-all cursor-pointer">
                            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">{topic.title}</h3>
                            <p className="text-gray-600">{topic.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
