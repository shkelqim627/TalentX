'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import BlogHero from '@/widgets/blog/BlogHero';
import FeaturedPost from '@/widgets/blog/FeaturedPost';
import BlogPostCard from '@/widgets/blog/BlogPostCard';
import NewsletterSignup from '@/widgets/blog/NewsletterSignup';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function Blog() {
    const { data: blogPosts, isLoading } = useQuery({
        queryKey: ['blog-posts'],
        queryFn: async () => {
            const posts = await talentXApi.entities.CMS.BlogPost.list();
            // Map API structure to component expectation
            return posts
                .filter(p => p.published)
                .map(p => ({
                    ...p,
                    date: p.createdAt || new Date().toISOString(),
                    readTime: p.readTime || '5 min'
                }));
        }
    });

    const featuredPost = blogPosts?.find(p => p.featured) || blogPosts?.[0];
    const remainingPosts = blogPosts?.filter(p => p.id !== featuredPost?.id) || [];

    return (
        <main className="min-h-screen bg-[#fafbfc] selection:bg-[#204ecf] selection:text-white">
            <BlogHero />

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 pb-20">
                {isLoading ? (
                    <div className="h-[500px] md:h-[600px] rounded-[40px] bg-white animate-pulse" />
                ) : featuredPost ? (
                    <FeaturedPost post={featuredPost} />
                ) : (
                    <div className="h-[500px] md:h-[600px] rounded-[40px] bg-white flex items-center justify-center text-gray-400 font-medium border border-gray-100 italic">
                        No featured posts available.
                    </div>
                )}

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

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[400px] rounded-2xl bg-white animate-pulse" />
                            ))}
                        </div>
                    ) : remainingPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {remainingPosts.map((post, index) => (
                                <BlogPostCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                    ) : !featuredPost ? (
                        <div className="py-20 text-center">
                            <p className="text-xl text-gray-400 font-medium italic">No blog posts found. Check back later!</p>
                        </div>
                    ) : null}

                    {remainingPosts.length > 6 && (
                        <div className="mt-20 text-center">
                            <button className="px-10 py-4 bg-white border border-gray-200 text-[#1a1a2e] rounded-2xl font-bold hover:border-[#204ecf] hover:text-[#204ecf] transition-all shadow-sm">
                                Load More Articles
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <NewsletterSignup />
        </main>
    );
}
