'use client';

import { Facebook, Linkedin, X, Youtube, Instagram } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/shared/lib/utils";
import CTASection from "../landing/CTASection";

// Types
type FooterLink = {
    label: string;
    url?: string;
    category?: string;
    searchTerm?: string;
};

// Data Structures
const hireTalentLinks: FooterLink[] = [
    { label: "Hire AI & ML Engineers", category: "ai_ml" },
    { label: "Hire Developers", category: "developer" },
    { label: "Hire Designers", category: "designer" },
    { label: "Hire Product Managers", category: "product_manager" },
    { label: "Hire Project Managers", category: "project_manager" },
    { label: "Hire Marketers", category: "marketing" },
    { label: "Hire Finance Experts", category: "finance" },
];

const hireTeamLinks: FooterLink[] = [
    { label: "How it works", url: "Process" },
    { label: "Our experts", url: "Experts" },
    { label: "Talent vetting", url: "Vetting" },
    { label: "Join as talent", url: "Join" },
];

const hireAgencyLinks: FooterLink[] = [
    { label: "For agencies", url: "Agencies" },
    { label: "Partner with us", url: "Partners" },
    { label: "Enterprise solutions", url: "Enterprise" },
    { label: "Case studies", url: "CaseStudies" },
];

const featuredSkills: FooterLink[] = [
    { label: "AI/ML Engineers", searchTerm: "ai" },
    { label: "Data Scientists", searchTerm: "data science" },
    { label: "Python Experts", searchTerm: "python" },
    { label: "Full-Stack Developers", searchTerm: "full stack" },
    { label: "DevOps Engineers", searchTerm: "devops" },
    { label: "Cybersecurity Consultants", searchTerm: "cybersecurity" },
    { label: "UI/UX Designers", searchTerm: "ux designer" },
    { label: "Product Managers", searchTerm: "product manager" },
    { label: "Growth Marketers", searchTerm: "growth marketing" },
    { label: "Fractional CFOs", searchTerm: "fractional cfo" },
    { label: "Blockchain Developers", searchTerm: "blockchain" },
    { label: "React Native Developers", searchTerm: "react native" },
];

const aboutLinks: FooterLink[] = [
    { label: "Why TalentX", url: "WhyTalentX" },
    { label: "Contact Us", url: "Contact" },
    { label: "Press Center", url: "Press" },
    { label: "Careers", url: "Careers" },
    { label: "About Us", url: "AboutUs" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const renderLink = (link: FooterLink) => {
        let href = "#";
        if (link.url) href = createPageUrl(link.url);
        else if (link.category)
            href = createPageUrl(`BrowseTalent?category=${link.category}`);
        else if (link.searchTerm)
            href = createPageUrl(`BrowseTalent?searchTerm=${link.searchTerm}`);

        return (
            <Link
                href={href}
                className="text-gray-300 hover:text-white hover:underline transition-colors text-sm block py-1"
            >
                {link.label}
            </Link>
        );
    };

    return (
        <footer
            className="relative text-white  py-10 overflow-hidden bg-[radial-gradient(circle_at_50%_100%,#12287a_0%,#010414_90%)] "
        >
            <CTASection />
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Top Section: Links Grid - Balanced 12-column layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
                    {/* Hire Talent (3 cols) */}
                    <div className="lg:col-span-3">
                        <h3 className="font-bold text-base mb-6 text-white border-b border-white/20 pb-2 inline-block w-full">
                            Hire Talent
                        </h3>
                        <ul className="space-y-2">
                            {hireTalentLinks.map((link) => (
                                <li key={link.label}>{renderLink(link)}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Hire Team & Agency (Stacked - 2 cols) */}
                    <div className="lg:col-span-2 flex flex-col gap-10">
                        <div>
                            <h3 className="font-bold text-base mb-6 text-white border-b border-white/20 pb-2 inline-block w-full">
                                Hire Team
                            </h3>
                            <ul className="space-y-2">
                                {hireTeamLinks.map((link) => (
                                    <li key={link.label}>{renderLink(link)}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-base mb-6 text-white border-b border-white/20 pb-2 inline-block w-full">
                                Hire Agency
                            </h3>
                            <ul className="space-y-2">
                                {hireAgencyLinks.map((link) => (
                                    <li key={link.label}>{renderLink(link)}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Featured Skills (4 cols) */}
                    <div className="lg:col-span-4">
                        <h3 className="font-bold text-base mb-6 text-white border-b border-white/20 pb-2 w-full">
                            Featured Skills
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-3">
                            {featuredSkills.map((link) => (
                                <div key={link.label}>{renderLink(link)}</div>
                            ))}
                        </div>
                    </div>

                    {/* About (3 cols) */}
                    <div className="lg:col-span-3">
                        <h3 className="font-bold text-base mb-6 text-white border-b border-white/20 pb-2 inline-block w-full">
                            About
                        </h3>
                        <ul className="space-y-2">
                            {aboutLinks.map((link) => (
                                <li key={link.label}>{renderLink(link)}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 w-full mb-8"></div>

                {/* Bottom Section: Logo, Tagline, Socials */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2"
                        >
                            <span className="text-xl font-bold tracking-tight text-white">
                                TalentX
                            </span>
                        </Link>

                        {/* Vertical Divider */}
                        <div className="hidden md:block w-px h-6 bg-white/20"></div>

                        {/* Tagline */}
                        <span className="text-sm font-medium tracking-wide text-gray-200">
                            The World&apos;s Top Talent Network
                        </span>
                    </div>

                    {/* Social Icons & App Downloads */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex items-center gap-3">
                            {/* App Store Button */}
                            <a
                                href="#"
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all group"
                            >
                                <div className="text-white w-5 h-5 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-full h-full fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2.01.77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.89 1.22-2.11 1.09-3.32-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 2.01-1.1 3.2 1.15.09 2.33-.55 3.06-1.44z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-[10px] text-gray-400">
                                        Download on the
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                        App Store
                                    </span>
                                </div>
                            </a>

                            {/* Google Play Button */}
                            <a
                                href="#"
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all group"
                            >
                                <div className="text-white w-5 h-5 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-full h-full fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a2.21 2.21 0 01-.61-1.556V3.37c0-.584.223-1.139.609-1.556zm11.332 11.231l2.903 1.638L4.621 22.951c-.134.075-.285.114-.438.114a1.002 1.002 0 01-.61-.21l11.368-10.81zm5.176-2.327l2.843 1.604a1.114 1.114 0 010 1.956l-2.843 1.604l-3.235-1.825l3.235-1.739zm-4.318-2.453L4.433 1.127a1.007 1.007 0 01-.25-.114a1.002 1.002 0 01-.61.21L14.936 12l.865-8.735z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-[10px] text-gray-400">GET IT ON</span>
                                    <span className="text-xs font-bold text-white">
                                        Google Play
                                    </span>
                                </div>
                            </a>
                        </div>

                        <div className="hidden md:block w-px h-6 bg-white/20"></div>

                        <div className="flex items-center gap-4">
                            {[Facebook, Linkedin, X, Youtube, Instagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-8 h-8 flex items-center justify-center rounded-full border-[1.5px] border-gray-400 text-gray-300 hover:text-white hover:border-white transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 w-full mb-8"></div>

                {/* Very Bottom: Copyright & Legal */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-xs text-gray-400">
                    <span suppressHydrationWarning>
                        Copyright {currentYear} TalentX, LLC
                    </span>
                    <span className="hidden md:inline">|</span>
                    <Link
                        href={createPageUrl("Privacy")}
                        className="hover:text-white transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href={createPageUrl("Terms")}
                        className="hover:text-white transition-colors"
                    >
                        Terms of Service
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                        Accessibility
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors">
                        Sitemap
                    </Link>
                </div>
            </div>
        </footer>
    );
}
