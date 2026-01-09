'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogPostCardProps {
    post: {
        title: string;
        excerpt: string;
        date: string;
        author: string;
        category: string;
        image: string;
        readTime: string;
    };
    index: number;
}

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col bg-white border border-gray-100 overflow-hidden shadow-2xl hover:shadow-gray-200 transition-all duration-500"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#204ecf] text-[13px] font-bold rounded-full shadow-sm">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center gap-4 text-[13px] text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                    </div>
                </div>

                <h3 className="text-[22px] font-bold text-[#1a1a2e] mb-4 group-hover:text-[#204ecf] transition-colors leading-tight">
                    {post.title}
                </h3>

                <p className="text-gray-500 text-[15px] mb-8 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#204ecf] font-bold text-[14px]">
                            {post.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[14px] font-medium text-gray-700">{post.author}</span>
                    </div>

                    <button className="flex items-center gap-2 text-[#204ecf] text-[14px] font-bold group/btn">
                        Read More
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}
