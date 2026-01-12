'use client';

import React from 'react';
import EnhancedHero from "@/widgets/landing/EnhancedHero";
import HireOptions from "@/widgets/landing/HireOptions";
import TalentNetwork from "@/widgets/landing/TalentNetwork";
import TrustedBrands from "@/widgets/landing/TrustedBrands";
import WorldClassTalent from "@/widgets/landing/WorldClassTalent";
import HiringProcess from "@/widgets/landing/HiringProcess";
import Testimonials from "@/widgets/landing/Testimonials";
import ClientStories from "@/widgets/landing/ClientStories";
import CTASection from "@/widgets/landing/CTASection";

export default function HomePage() {
    return (
        <>
            <EnhancedHero />
            <HireOptions />
            <TalentNetwork />
            <TrustedBrands />
            <WorldClassTalent />
            <HiringProcess />
            <ClientStories />
            <Testimonials />
        </>
    );
}
