'use client';

import React from 'react';
import BlogHero from '@/components/blog/BlogHero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogPostCard from '@/components/blog/BlogPostCard';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

const blogPosts = [
    {
        title: 'The Evolution of the Global Talent Economy in 2024',
        excerpt: 'How decentralization and remote-first cultures are redefining where and how the world\'s best work is being done.',
        date: '2024-01-20',
        author: 'Sarah Johnson',
        category: 'Future of Work',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
        readTime: '8 min'
    },
    {
        title: 'How to Hire the Best Remote Developers',
        excerpt: 'A comprehensive guide to finding, vetting, and hiring top remote development talent for high-growth startups.',
        date: '2024-01-15',
        author: 'Sarah Johnson',
        category: 'Hiring',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
        readTime: '12 min'
    },
    {
        title: 'The ROI of Scaling with On-Demand Experts',
        excerpt: 'Why agility is the new competitive advantage and how the world\'s fastest-growing companies are leveraging elite on-demand networks.',
        date: '2024-01-12',
        author: 'David Wright',
        category: 'Strategy',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        readTime: '6 min'
    },
    {
        title: 'Building Culture in a Distributed Engineering Team',
        excerpt: 'Lessons learned from managing specialized remote teams across 15+ timezones without sacrificing velocity.',
        date: '2024-01-10',
        author: 'Michael Chen',
        category: 'Engineering',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
        readTime: '9 min'
    },
    {
        title: 'Scaling Engineering Teams: From 10 to 100',
        excerpt: 'The critical infrastructure and process changes required to scale your engineering department while maintaining output quality.',
        date: '2024-01-08',
        author: 'Alex Rivera',
        category: 'Leadership',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
        readTime: '15 min'
    },
    {
        title: 'The Shift to Value-Based Talent Engagement',
        excerpt: 'Why fixed-term employment is giving way to milestone-driven engagements for specialized high-end projects.',
        date: '2024-01-05',
        author: 'Emily Rodriguez',
        category: 'Consulting',
        image: 'https://images.unsplash.com/photo-1454165833767-1229d1ca7fbd?w=800&h=600&fit=crop',
        readTime: '7 min'
    },
    {
        title: 'Global Compliance: Navigating the Remote Maze',
        excerpt: 'Essential strategies for ensuring your distributed workforce adheres to local labor laws and tax regulations globally.',
        date: '2024-01-02',
        author: 'Mark Thompson',
        category: 'Operations',
        image: 'https://images.unsplash.com/photo-1589829545856-11841ad17f39?w=800&h=600&fit=crop',
        readTime: '11 min'
    }
];

export default function Blog() {
    const featuredPost = blogPosts[0];
    const remainingPosts = blogPosts.slice(1);

    return (
        <main className="min-h-screen bg-[#fafbfc] selection:bg-[#204ecf] selection:text-white">
            <BlogHero />

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
                <FeaturedPost post={featuredPost} />

                <div className="mt-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-200 pb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Latest Insights</h2>
                            <p className="text-gray-500">Dive deeper into the topics that matter to your business.</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {['All', 'Hiring', 'Future of Work', 'Strategy', 'Engineering'].map((cat) => (
                                <button
                                    key={cat}
                                    className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all ${cat === 'All'
                                            ? 'bg-[#204ecf] text-white shadow-lg shadow-[#204ecf]/20'
                                            : 'bg-white text-gray-600 border border-gray-100 hover:border-[#204ecf]/30 hover:text-[#204ecf]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {remainingPosts.map((post, index) => (
                            <BlogPostCard key={post.title} post={post} index={index} />
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button className="px-10 py-4 bg-white border border-gray-200 text-[#1a1a2e] rounded-2xl font-bold hover:border-[#204ecf] hover:text-[#204ecf] transition-all shadow-sm">
                            Load More Articles
                        </button>
                    </div>
                </div>
            </div>

            <NewsletterSignup />
        </main>
    );
}
