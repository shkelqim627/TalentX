'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';

interface Story {
    id: string;
    company: string;
    logo: string;
    thumbnail: string;
    videoUrl: string;
}


// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
};

export default function ClientStories() {
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    const { data: caseStudies, isLoading } = useQuery({
        queryKey: ['cms-case-studies'],
        queryFn: async () => {
            const items = await talentXApi.entities.CMS.CaseStudy.list();
            return items.map(item => ({
                id: item.id,
                company: item.client_name || item.title,
                logo: item.logo || 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
                thumbnail: item.image,
                videoUrl: item.video_url || ''
            }));
        }
    });

    return (
        <section className="py-24 bg-white text-black overflow-hidden text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#1a1a2e]">Why Organizations Choose TalentX</h2>
                    <p className="text-gray-500 max-w-3xl mx-auto text-lg">
                        Discover the many ways in which our clients have embraced the benefits of working with TalentX.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="w-[380px] h-[400px] bg-gray-100 animate-pulse" />
                        ))
                    ) : (caseStudies || []).length === 0 ? (
                        <p className="text-gray-400 italic">No case studies available yet.</p>
                    ) : (
                        caseStudies?.map((story, index) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative cursor-pointer w-[380px] h-[400px] overflow-hidden bg-gray-900 shadow-xl"
                                onClick={() => setSelectedStory(story)}
                            >
                                <img
                                    src={story.thumbnail}
                                    alt={story.company}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

                                <div className="absolute top-8 left-8 text-left flex flex-col gap-4">
                                    {story.logo && (
                                        <img
                                            src={story.logo}
                                            alt={`${story.company} logo`}
                                            className="h-10 w-auto object-contain filter brightness-0 invert opacity-100"
                                        />
                                    )}
                                    <h3 className="text-white font-bold text-2xl tracking-tight leading-tight">
                                        {story.company}
                                    </h3>
                                </div>

                                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20">
                                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                    </div>
                                    <span className="text-white font-bold text-base tracking-wide">Watch the video</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedStory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                        onClick={() => setSelectedStory(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 text-white hover:bg-white/10 z-20"
                                onClick={() => setSelectedStory(null)}
                            >
                                <X className="w-6 h-6" />
                            </Button>

                            {selectedStory.videoUrl && getYouTubeEmbedUrl(selectedStory.videoUrl) ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`${getYouTubeEmbedUrl(selectedStory.videoUrl)}?autoplay=1`}
                                    title={`${selectedStory.company} case study`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{selectedStory.company}</h3>
                                        <p className="text-gray-400 font-medium">No video preview available</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
