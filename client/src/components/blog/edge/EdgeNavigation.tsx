'use client';

import React, { useState } from 'react';

const categories = [
    "All Edge Topics",
    "Top Ideas",
    "Life at TalentX"
];

export default function EdgeNavigation() {
    const [active, setActive] = useState("All Edge Topics");

    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center h-20 gap-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat)}
                            className={`relative text-[14px] font-bold tracking-wide transition-colors ${active === cat ? 'text-[#1a1a2e]' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {cat}
                            {active === cat && (
                                <div className="absolute -bottom-[29px] left-0 right-0 h-[3px] bg-[#1a1a2e]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
