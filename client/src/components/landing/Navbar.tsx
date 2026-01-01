'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, Code, Palette, TrendingUp, BarChart3, Briefcase, Users as UsersIcon, Zap, Shield, Globe, Rocket, Target, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { talentXApi } from '@/api/talentXApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const megaMenuData = {
    talent: {
        title: 'Hire Talent',
        sections: [
            {
                title: 'Popular Roles',
                items: [
                    { name: 'Developers', icon: Code, category: 'developer', description: 'Frontend, Backend, Fullstack' },
                    { name: 'Designers', icon: Palette, category: 'designer', description: 'UI/UX, Product, Graphic' },
                    { name: 'Marketing', icon: TrendingUp, category: 'marketing', description: 'SEO, Content, Growth' },
                    { name: 'Finance', icon: BarChart3, category: 'finance', description: 'Analysts, Accountants' },
                    { name: 'Product Managers', icon: Briefcase, category: 'product_manager', description: 'Strategy, Execution' },
                    { name: 'Project Managers', icon: UsersIcon, category: 'project_manager', description: 'Agile, Scrum' }
                ]
            },
            {
                title: 'Specialized Skills',
                items: [
                    { name: 'AI & Machine Learning', icon: Zap, category: 'ai_ml', description: 'LLMs, Computer Vision' },
                    { name: 'Blockchain', icon: Shield, category: 'blockchain', description: 'Smart Contracts, Web3' },
                    { name: 'Cloud Architects', icon: Globe, category: 'cloud', description: 'AWS, Azure, GCP' }
                ]
            },
            {
                title: 'Why TalentX',
                isPromo: true,
                items: [
                    { name: 'Vetted Experts', icon: Target, description: 'Top 3% of global talent' },
                    { name: '48-hour Matching', icon: Rocket, description: 'Fast-track your hiring' },
                    { name: 'No-risk Trial', icon: Heart, description: 'Pay only if you are satisfied' }
                ]
            }
        ]
    },
    team: {
        title: 'Hire Team',
        sections: [
            {
                title: 'Team Types',
                items: [
                    { name: 'Agile Squads', spec: 'agile_squads', description: 'Complete cross-functional teams' },
                    { name: 'Product Teams', spec: 'product_teams', description: 'End-to-end product delivery' },
                    { name: 'Growth Teams', spec: 'growth_teams', description: 'Focused on scaling metrics' }
                ]
            },
            {
                title: 'Solutions',
                items: [
                    { name: 'MVP Development', spec: 'mvp_dev', description: 'Launch your product fast' },
                    { name: 'Scale-up', spec: 'scale_up', description: 'Expand your engineering capacity' },
                    { name: 'Enterprise Transformation', spec: 'enterprise', description: 'Modernize legacy systems' }
                ]
            },
            {
                title: 'Success Stories',
                isPromo: true,
                items: [
                    { name: 'Case Studies', description: 'See how we helped others scale' },
                    { name: 'Client Testimonials', description: 'What our partners say about us' }
                ]
            }
        ]
    },
    agency: {
        title: 'Hire Agency',
        sections: [
            {
                title: 'Agency Types',
                items: [
                    { name: 'Creative Agencies', filter: 'creative', description: 'Branding, Design, Content' },
                    { name: 'Dev Agencies', filter: 'dev', description: 'Custom Software, Apps' },
                    { name: 'Marketing Agencies', filter: 'marketing', description: 'Performance, Social Media' }
                ]
            },
            {
                title: 'Industries',
                items: [
                    { name: 'FinTech', filter: 'fintech', description: 'Banking, Payments, Crypto' },
                    { name: 'HealthTech', filter: 'healthtech', description: 'Telemedicine, Data' },
                    { name: 'E-commerce', filter: 'ecommerce', description: 'Shopify, Custom Stores' }
                ]
            },
            {
                title: 'Partner Program',
                isPromo: true,
                items: [
                    { name: 'Become a Partner', description: 'List your agency on TalentX' },
                    { name: 'Agency Benefits', description: 'Why partner with us' }
                ]
            }
        ]
    }
};

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await talentXApi.auth.logout();
        dispatch(logout());
        toast.success('Logged out successfully');
        router.push(createPageUrl('Home'));
    };

    return (
        <nav className="glass-nav sticky top-0 z-50 transition-all duration-300 bg-white/80 border-b border-gray-100">
            {/* Announcement Bar */}
            {/* <div className="bg-[#edf1fd] text-black text-center py-2.5 px-4 text-sm">
                <span>TalentX launches </span>
                <a href="#" className="text-[#00c853] hover:underline font-medium">GlobalHire</a>
                <span> 🚀 The most competitively priced global workforce payroll platform.</span>
            </div> */}


            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-10">
                        <Link href={createPageUrl('Home')} className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#1a1a2e] tracking-tight">TalentX</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-0" onMouseLeave={() => setHoveredTab(null)}>
                            {Object.entries(megaMenuData).map(([key, menu]) => (
                                <div
                                    key={key}
                                    className="relative"
                                    onMouseEnter={() => {
                                        setOpenDropdown(key);
                                        setHoveredTab(key);
                                    }}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <button className="relative flex items-center gap-1 px-4 py-2 text-[#1a1a2e] hover:text-[#204ecf] rounded-md text-sm font-semibold transition-all duration-200">
                                        {menu.title}
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === key ? 'rotate-180' : ''}`} />
                                        {hoveredTab === key && (
                                            <motion.div
                                                layoutId="navUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf]"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {openDropdown === key && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-2xl z-50 fixed-mega-menu"
                                                style={{ position: 'fixed', left: 0, right: 0, top: 'auto' }}
                                            >
                                                <div className="max-w-7xl mx-auto px-8 py-10">
                                                    <div className="grid grid-cols-3 gap-12">
                                                        {menu.sections.map((section, idx) => (
                                                            <div key={idx} className={`${section.isPromo ? 'bg-gray-50 p-6 rounded-2xl border border-gray-100' : ''}`}>
                                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                                                    {section.title}
                                                                </h3>
                                                                <div className="space-y-6">
                                                                    {section.items.map((item: any, itemIdx) => (
                                                                        <Link
                                                                            key={itemIdx}
                                                                            href={createPageUrl(
                                                                                key === 'talent' ? `BrowseTalent?category=${item.category}` :
                                                                                    key === 'team' ? `BrowseTeams?spec=${item.spec}` :
                                                                                        `BrowseAgencies?filter=${item.filter}`
                                                                            )}
                                                                            className="group flex items-start gap-4 transition-all duration-200"
                                                                        >
                                                                            {item.icon && (
                                                                                <div className="mt-1 p-2 bg-blue-50 text-[#204ecf] rounded-lg group-hover:bg-[#204ecf] group-hover:text-white transition-colors duration-200">
                                                                                    <item.icon className="w-5 h-5" />
                                                                                </div>
                                                                            )}
                                                                            <div>
                                                                                <div className="text-sm font-bold text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors">
                                                                                    {item.name}
                                                                                </div>
                                                                                {item.description && (
                                                                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                                                        {item.description}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            <Link
                                href={createPageUrl('Clients')}
                                onMouseEnter={() => setHoveredTab('clients')}
                                className="relative px-4 py-2 text-[#1a1a2e] hover:text-[#204ecf] text-sm font-semibold transition-colors"
                            >
                                Clients
                                {hoveredTab === 'clients' && (
                                    <motion.div
                                        layoutId="navUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                            <Link
                                href={createPageUrl('Blog')}
                                onMouseEnter={() => setHoveredTab('blog')}
                                className="relative px-4 py-2 text-[#1a1a2e] hover:text-[#204ecf] text-sm font-semibold transition-colors"
                            >
                                Blog
                                {hoveredTab === 'blog' && (
                                    <motion.div
                                        layoutId="navUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                            <Link
                                href={createPageUrl('AboutUs')}
                                onMouseEnter={() => setHoveredTab('about')}
                                className="relative px-4 py-2 text-[#1a1a2e] hover:text-[#204ecf] text-sm font-semibold transition-colors"
                            >
                                About Us
                                {hoveredTab === 'about' && (
                                    <motion.div
                                        layoutId="navUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden lg:flex items-center gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link href={createPageUrl('ApplyTalent')} className="text-sm font-semibold text-[#1a1a2e] hover:text-[#204ecf] transition-colors">
                                    Apply as a Talent
                                </Link>
                                <Link href={createPageUrl('Pricing')}>
                                    <Button className="bg-[#00cc83] hover:bg-[#03b080] text-white font-bold px-6 py-4 rounded-[4px]">
                                        Hire Top Talent
                                    </Button>
                                </Link>
                                <Link href={createPageUrl('Login')} className="text-sm font-semibold text-[#1a1a2e] hover:text-[#204ecf] transition-colors">
                                    Log In
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={createPageUrl('Dashboard')}>
                                    <Button variant="ghost" className="text-sm font-semibold text-[#1a1a2e] hover:text-[#204ecf] transition-colors gap-2">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm font-medium text-gray-600 hidden xl:block">
                                        Hi, {user?.full_name?.split(' ')[0]}
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="border-gray-200 hover:bg-gray-50 text-gray-700 gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-[#1a1a2e]"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {Object.entries(megaMenuData).map(([key, menu]) => (
                                <div key={key} className="space-y-2">
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {menu.title}
                                    </div>
                                    {menu.sections.map((section, sIdx) => (
                                        <div key={sIdx} className="pl-4 space-y-1">
                                            {section.items.map((item: any, iIdx) => (
                                                <Link
                                                    key={iIdx}
                                                    href={createPageUrl(
                                                        key === 'talent' ? `BrowseTalent?category=${item.category}` :
                                                            key === 'team' ? `BrowseTeams?spec=${item.spec}` :
                                                                `BrowseAgencies?filter=${item.filter}`
                                                    )}
                                                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className="pt-6 border-t border-gray-100 space-y-4">
                                {!isAuthenticated ? (
                                    <>
                                        <Link href={createPageUrl('ApplyTalent')} className="block px-4 py-2 text-sm font-semibold text-[#1a1a2e]">Apply as a Talent</Link>
                                        <Link href={createPageUrl('Pricing')}>
                                            <Button className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold py-6 rounded-xl">
                                                Hire Top Talent
                                            </Button>
                                        </Link>
                                        <Link href={createPageUrl('Login')} className="block px-4 py-2 text-sm font-semibold text-[#1a1a2e]">Log In</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={createPageUrl('Dashboard')} className="block px-4 py-2 text-sm font-semibold text-[#1a1a2e] flex items-center gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}