'use client';

import React from 'react';

export default function Terms() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-4xl font-bold text-[#1a1a2e] mb-8">Terms of Service</h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600">Last updated: January 2024</p>

                    <h2 className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                        By accessing and using TalentX, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">2. Use License</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Permission is granted to temporarily access the services on TalentX for personal, non-commercial transitory viewing only.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">3. Service Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                        TalentX provides a platform to connect clients with freelance professionals. We do not guarantee employment or project success.
                    </p>
                </div>
            </div>
        </div>
    );
}
