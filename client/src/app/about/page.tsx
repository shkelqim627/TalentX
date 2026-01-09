import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import TeamTabsSection from '@/components/about/TeamTabsSection';

export default function AboutUs() {
    return (
        <main className="min-h-screen bg-white">
            <AboutHero />
            <TeamTabsSection />
        </main>
    );
}
