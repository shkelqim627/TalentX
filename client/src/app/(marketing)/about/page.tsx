import React from 'react';
import AboutHero from '@/widgets/about/AboutHero';
import TeamTabsSection from '@/widgets/about/TeamTabsSection';

export default function AboutUs() {
    return (
        <main className="min-h-screen bg-white">
            <AboutHero />
            <TeamTabsSection />
        </main>
    );
}
