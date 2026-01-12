'use client';

import React from 'react';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-4xl font-bold text-[#1a1a2e] mb-8">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600">Last updated: January 2024</p>

                    <h2 className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">Information We Collect</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We collect information you provide directly to us, such as when you create an account, subscribe to our services, or contact us for support.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">How We Use Your Information</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">Data Security</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
                    </p>
                </div>
            </div>
        </div>
    );
}
