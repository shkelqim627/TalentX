'use client';

import React from 'react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { Share2 } from 'lucide-react';

const edgePosts = [
    {
        title: 'Building the World\'s Greatest Talent Hub: Our Journey',
        excerpt: 'How we transitioned from a small agency to a global network of elite specialists and dedicated engineering teams.',
        date: '2024-01-22',
        author: 'Sebastian Gherman',
        category: 'Life at TalentX',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop',
        readTime: '10 min'
    },
    {
        title: 'The "Edge" Philosophy: Why Quality Beats Quantity every time',
        excerpt: 'Exploring our rigorous vetting process and why we reject 97% of applicants to maintain our elite status.',
        date: '2024-01-18',
        author: 'Lubos Volkov',
        category: 'Top Ideas',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&fit=crop',
        readTime: '6 min'
    },
    {
        title: 'Navigating Global Compliance for Core Teams',
        excerpt: 'Deep dive into the operational challenges of maintaining a 100% remote core team across dozens of jurisdictions.',
        date: '2024-01-15',
        author: 'Mark Thompson',
        category: 'Operations',
        image: 'https://images.unsplash.com/photo-1589829545856-11841ad17f39?w=800&fit=crop',
        readTime: '15 min'
    }
];

export default function EdgePostGrid() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-8">
                    <div>
                        <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-[#1a1a2e]/40 uppercase mb-2">
                            TalentX Edge
                        </span>
                        <h2 className="text-[44px] font-light text-[#1a1a2e]">Most Recent Articles</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[12px] font-bold tracking-widest text-[#1a1a2e]/40 uppercase">Share</span>
                        <button className="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-lg text-gray-400 hover:text-[#1a1a2e] hover:border-[#1a1a2e] transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {edgePosts.map((post, index) => (
                        <BlogPostCard key={post.title} post={post} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
