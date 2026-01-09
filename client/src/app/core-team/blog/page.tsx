'use client';

import React from 'react';
import EdgeHero from '@/components/blog/edge/EdgeHero';
import EdgeNavigation from '@/components/blog/edge/EdgeNavigation';
import EdgePostGrid from '@/components/blog/edge/EdgePostGrid';
import NewsletterSignup from '@/components/blog/NewsletterSignup';

export default function EdgeBlogPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-[#001741] selection:text-white">
            <EdgeHero />
            <EdgeNavigation />
            <EdgePostGrid />
            <NewsletterSignup />
        </main>
    );
}
