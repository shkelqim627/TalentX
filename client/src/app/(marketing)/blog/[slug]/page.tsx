'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { talentXApi } from '@/shared/api/talentXApi';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostDetail() {
    const { slug } = useParams();

    const { data: post, isLoading } = useQuery({
        queryKey: ['blog-post', slug],
        queryFn: () => talentXApi.entities.CMS.BlogPost.getBySlug(slug as string)
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
                    <div className="h-10 w-3/4 bg-gray-200 rounded-lg mb-6" />
                    <div className="flex gap-4 mb-12">
                        <div className="h-6 w-32 bg-gray-200 rounded-full" />
                        <div className="h-6 w-32 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-[400px] w-full bg-gray-200 rounded-[40px] mb-12" />
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
                <Link href="/blog">
                    <Button variant="outline">Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white selection:bg-[#204ecf] selection:text-white pb-32">
            {/* Header / Meta */}
            <div className="max-w-4xl mx-auto px-4 pt-16 lg:pt-24 pb-12">
                <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#204ecf] font-bold text-sm mb-12 transition-colors group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Insights
                </Link>

                <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-[#f0f4ff] text-[#204ecf] text-[12px] font-black uppercase tracking-wider rounded-full border border-[#204ecf]/10">
                        {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        {post.readTime || '5 min'} read
                    </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-black text-[#1a1a2e] leading-[1.1] tracking-tight mb-8">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-8 py-8 border-y border-gray-100 italic text-gray-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#204ecf]">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 not-italic">Written By</p>
                            <p className="text-sm font-bold text-gray-900 not-italic">{post.author}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 not-italic">Published On</p>
                            <p className="text-sm font-bold text-gray-900 not-italic">
                                {new Date(post.createdAt || (post as any).date || '').toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-6xl mx-auto px-4 mb-20">
                <div className="aspect-[21/9] rounded-[40px] overflow-hidden shadow-2xl relative">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-4 relative">
                {/* Social Share Sidebar (Desktop Only) */}
                <div className="hidden lg:block absolute -left-20 top-0 h-full">
                    <div className="sticky top-32 flex flex-col gap-4">
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#204ecf] hover:border-[#204ecf] transition-all shadow-sm">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-10 bg-gray-100 mx-auto" />
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1877f2] hover:border-[#1877f2] transition-all">
                            <Facebook className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1da1f2] hover:border-[#1da1f2] transition-all">
                            <Twitter className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0a66c2] hover:border-[#0a66c2] transition-all">
                            <Linkedin className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Article Text */}
                <article className="prose prose-lg lg:prose-xl max-w-none text-gray-600 leading-relaxed font-medium blog-content">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h2 className="text-3xl font-black text-[#1a1a2e] mt-12 mb-6 tracking-tight">{children}</h2>,
                            h2: ({ children }) => <h2 className="text-2xl font-black text-[#1a1a2e] mt-10 mb-5 tracking-tight">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-black text-[#1a1a2e] mt-8 mb-4 tracking-tight">{children}</h3>,
                            p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-6 mb-8 space-y-4">{children}</ol>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-[#204ecf] pl-6 py-2 my-10 bg-[#f0f4ff]/50 rounded-r-2xl italic text-gray-900 font-bold text-xl">
                                    {children}
                                </blockquote>
                            ),
                            a: ({ href, children }) => (
                                <a href={href} className="text-[#204ecf] font-bold border-b-2 border-transparent hover:border-[#204ecf] transition-all">
                                    {children}
                                </a>
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </article>

                {/* Footer Meta */}
                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#204ecf] flex items-center justify-center text-white scale-110">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">{post.author}</p>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Thought Leader at TalentX</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2">Share this story</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-[#204ecf]">
                                <Facebook className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-[#204ecf]">
                                <Twitter className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-[#204ecf]">
                                <Linkedin className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .blog-content p {
                    line-height: 1.8;
                }
                .blog-content li {
                    line-height: 1.6;
                }
            `}</style>
        </main>
    );
}
