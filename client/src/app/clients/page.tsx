import React from 'react';
import ClientsHero from '@/components/clients/ClientsHero';
import CaseStudiesGrid from '@/components/clients/CaseStudiesGrid';
import IndustryVerticals from '@/components/clients/IndustryVerticals';
import EngagementModels from '@/components/clients/EngagementModels';
import Testimonials from '@/components/landing/Testimonials';

export default function ClientsPage() {
    return (
        <main className="min-h-screen bg-white">
            <ClientsHero />
            <CaseStudiesGrid />
            <IndustryVerticals />
            <EngagementModels />
            <Testimonials />
        </main>
    );
}
