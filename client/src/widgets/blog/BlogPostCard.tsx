import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '@/shared/types';

interface BlogPostCardProps {
    post: BlogPost & { date: string }; // Keep date for compatibility if needed, but BlogPost has createdAt
    index: number;
}

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#204ecf]/20 hover:shadow-2xl hover:shadow-[#204ecf]/5 transition-all duration-500 cursor-pointer h-full"
            >
                <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-[#204ecf] text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm border border-white/20">
                            {post.category}
                        </span>
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.createdAt || post.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-4 leading-tight group-hover:text-[#204ecf] transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#204ecf]/5 group-hover:text-[#204ecf] transition-colors">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-gray-600">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#204ecf] font-black text-[11px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            Read Story
                            <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
