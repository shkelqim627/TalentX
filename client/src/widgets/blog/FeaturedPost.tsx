import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { BlogPost } from '@/shared/types';

interface FeaturedPostProps {
    post: BlogPost & { date: string };
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative group cursor-pointer"
        >
            <div className="relative h-[500px] md:h-[600px] rounded-[40px] overflow-hidden">
                <Link href={`/blog/${post.slug}`}> {/* Wrapped image container with Link */}
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </Link>

                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1 mb-6 text-[13px] font-bold tracking-widest text-[#204ecf] uppercase bg-white rounded-full">
                            Featured Article
                        </span>

                        <Link href={`/blog/${post.slug}`}> {/* Wrapped title with Link */}
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] hover:text-[#204ecf] transition-colors"> {/* Added hover style from snippet */}
                                {post.title}
                            </h2>
                        </Link>

                        <p className="text-[16px] md:text-[20px] text-white/80 mb-8 max-w-2xl leading-relaxed">
                            {post.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <Link href={`/blog/${post.slug}`}> {/* Wrapped button with Link */}
                                <Button className="px-8 py-4 bg-[#204ecf] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-[#1a3fb3] transition-colors group/btn">
                                    Read Featured Story {/* Changed button text as per instruction */}
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </Link>

                            <div className="flex items-center gap-4 text-white/60 text-[15px]">
                                <span className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Clock className="w-4 h-4" />
                                    {new Date(post.createdAt || post.date).toLocaleDateString()}
                                </span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span>{post.author}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
