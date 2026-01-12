'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import StatsGrid from './StatsGrid';
import ImpactSection from './ImpactSection';

const tabs = [
    { id: 'executive-team', label: 'Executive Team' },
    { id: 'business-leaders', label: 'Executive Business Leaders' },
    { id: 'stats', label: 'Stats and Figures' },
    { id: 'impact', label: 'Impact Initiatives' },
];

const teamMembers = [
    {
        name: "Taso Du Val",
        role: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
    },
    {
        name: "Bill Tsingos",
        role: "General Counsel",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop"
    },
    {
        name: "Michelle Labbe",
        role: "Chief People Officer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop"
    },
    {
        name: "Ismael Peinado",
        role: "Chief Technology Officer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop"
    },
    {
        name: "Carlos Aguirre",
        role: "Chief Financial Officer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop"
    },
    {
        name: "Megan Amdahl",
        role: "Chief Customer Officer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop"
    },
    {
        name: "Jeff Benesch",
        role: "Chief Operating Officer",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop"
    }
];

const businessLeaders = [
    {
        name: "Marc Andreessen",
        role: "Lead Investor, Andreessen Horowitz",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=500&fit=crop"
    },
    {
        name: "Reid Hoffman",
        role: "Partner, Greylock",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop"
    }
];

export default function TeamTabsSection() {
    const [activeTab, setActiveTab] = useState('executive-team');
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 600) { // Adjust threshold as needed
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        tabs.forEach((tab) => {
            const element = document.getElementById(tab.id);
            if (element) observer.observe(element);
        });

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Height of the sticky tab bar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveTab(id);
        }
    };

    return (
        <section className="bg-white relative">
            {/* Sticky Header with Tabs */}
            <div className={`z-50 w-full transition-all duration-300 ${isSticky ? 'sticky top-0 bg-white shadow-lg' : 'relative translate-y-[-50%]'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`bg-white transition-shadow duration-300 ${!isSticky ? 'shadow-[0_20px_50px_rgba(0,0,0,0.1)]' : ''}`}>
                        <div className="flex items-center justify-around">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => scrollToSection(tab.id)}
                                    className={`relative flex-1 py-10 md:py-12 text-[14px] md:text-[18px] transition-colors whitespace-nowrap text-center ${activeTab === tab.id ? 'text-[#204ecf] font-semibold' : 'text-[#365ecc] hover:text-[#204ecf]'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-6 right-6 h-[3px] bg-[#365ecc]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Executive Team Section */}
                <div id="executive-team" className="py-24 md:py-32 scroll-mt-20 text-left">
                    <h2 className="text-[36px] md:text-[44px] font-light text-center text-[#1a1a2e] mb-20 md:mb-28">Executive Team</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] justify-items-center max-w-[836px] mx-auto">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="flex flex-col bg-white border border-gray-100 shadow-sm w-[272px] h-[408px] flex-none">
                                <div className="h-[272px] overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-1 line-clamp-1">{member.name}</h3>
                                        <p className="text-gray-500 text-[12px] font-medium leading-tight">{member.role}</p>
                                    </div>
                                    <button className="text-[#365ecc] text-[12px] font-bold flex items-center group w-fit">
                                        View bio
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Careers Card */}
                        <div className="flex flex-col items-center justify-center p-10 bg-[#f5f7fe] text-center border border-gray-100 w-full lg:w-[554px] h-[408px] lg:col-span-2 flex-none">
                            <div className="w-14 h-14 rounded-full border border-[#204ecf]/10 flex items-center justify-center mb-8">
                                <Users className="w-6 h-6 text-[#365ecc]" />
                            </div>
                            <h2 className="text-[28px] md:text-[32px] font-light text-[#1a1a2e] mb-5">Careers at TalentX</h2>
                            <p className="text-gray-500 text-[14px] md:text-[15px] mb-8 md:mb-10 leading-relaxed max-w-[380px]">
                                Join the best and brightest who are working to build the greatest talent company in the world.
                            </p>
                            <a href="#" className="inline-flex items-center text-[#365ecc] text-[14px] md:text-[15px] font-bold group">
                                Explore your future at TalentX
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Business Leaders Section */}
                <div id="business-leaders" className="py-24 md:py-32 scroll-mt-20 border-t border-gray-100 text-left">
                    <h2 className="text-[36px] md:text-[44px] font-light text-center text-[#1a1a2e] mb-20 md:mb-28">Executive Business Leaders</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] justify-items-center max-w-[836px] mx-auto">
                        {businessLeaders.map((leader) => (
                            <div key={leader.name} className="flex flex-col bg-white border border-gray-100 shadow-sm w-[272px] h-[408px] flex-none">
                                <div className="h-[272px] overflow-hidden">
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="w-full h-full object-cover grayscale"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-1 line-clamp-1">{leader.name}</h3>
                                        <p className="text-gray-500 text-[12px] font-medium leading-tight">{leader.role}</p>
                                    </div>
                                    <button className="text-[#365ecc] text-[12px] font-bold flex items-center group w-fit">
                                        View bio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div id="stats" className="py-24 md:py-32 scroll-mt-20 border-t border-gray-100">
                    <h2 className="text-[36px] md:text-[44px] font-light text-center text-[#1a1a2e] mb-20">Stats and Figures</h2>
                    <StatsGrid />
                </div>

                {/* Impact Section */}
                <div id="impact" className="py-24 md:py-32 scroll-mt-20 border-t border-gray-100 pb-40">
                    <h2 className="text-[36px] md:text-[44px] font-light text-center text-[#1a1a2e] mb-20">Impact Initiatives</h2>
                    <ImpactSection />
                </div>
            </div>
        </section>
    );
}
