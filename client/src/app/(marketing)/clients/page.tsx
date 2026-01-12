'use client';

import React from 'react';
import ClientsHero from '@/widgets/clients/ClientsHero';
import CaseStudiesGrid from '@/widgets/clients/CaseStudiesGrid';
import IndustryVerticals from '@/widgets/clients/IndustryVerticals';
import EngagementModels from '@/widgets/clients/EngagementModels';
import Testimonials from '@/widgets/landing/Testimonials';

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
