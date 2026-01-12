'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, Menu, X, Code, Palette, TrendingUp, BarChart3, Briefcase, Users as UsersIcon, Zap, Shield, Globe, Rocket, Target, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { talentXApi } from '@/shared/api/talentXApi';
import NotificationCenter from '@/widgets/Dashboard/NotificationCenter';

const megaMenuData = {
    talent: {
        title: 'Hire Talent',
        viewType: 'sidebar',
        categories: [
            {
                id: 'developers',
                name: 'Developers',
                roles: [
                    'Full-stack Developers', 'Front-end Developers', 'Software Developers', 'Web Developers',
                    'Mobile App Developers', 'AI Engineers', 'Android Developers', 'AngularJS Developers',
                    'Django Developers', 'Drupal Developers', 'Game Developers', 'Hadoop Developers',
                    'iOS Developers', 'Java Developers', 'JavaScript Developers', 'Kubernetes Developers',
                    'Magento Developers', 'Node.js Developers', 'PHP Developers', 'PostgreSQL Developers',
                    'Python Developers', 'React.js Developers', 'Ruby on Rails Developers', 'Salesforce Developers',
                    'Scala Developers', 'Unity Developers', 'WordPress Developers'
                ]
            },
            { id: 'designers', name: 'Designers', path: 'Designers', roles: ['UI/UX Designers', 'Product Designers', 'Graphic Designers', 'Brand Designers', 'Web Designers', 'Mobile App Designers'] },
            { id: 'marketing', name: 'Marketing Experts', path: 'MarketingExperts', roles: ['SEO Specialists', 'Content Strategists', 'Growth Hackers', 'Social Media Managers', 'PPC Experts'] },
            { id: 'management', name: 'Management Consultants', path: 'ManagementConsultants', roles: ['Business Analysts', 'Financial Consultants', 'Strategic Advisors'] },
            { id: 'researchers', name: 'Researchers', path: 'Researchers', roles: ['Data Scientists', 'Research Scientists', 'UX Researchers', 'Market Researchers', 'AI Researchers', 'Clinical Researchers'] },
            { id: 'project_managers', name: 'Project Managers', path: 'ProjectManagers', roles: ['Agile Project Managers', 'Scrum Masters', 'Technical Project Managers'] },
            { id: 'product_managers', name: 'Product Managers', path: 'ProductManagers', roles: ['Technical Product Managers', 'Growth Product Managers', 'Product Strategists'] },
            { id: 'sales', name: 'Sales Experts', path: 'SalesExperts', roles: ['Sales Representatives', 'Account Executives', 'Business Development Managers'] }
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
    const [activeTalentCategory, setActiveTalentCategory] = useState('developers');
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Map of pathnames to category names for the brand label
    const categoryLabelMap: Record<string, string> = {
        '/developers': 'Developers',
        '/designers': 'Designers',
        '/marketing-experts': 'Marketing Experts',
        '/management-consultants': 'Management Consultants',
        '/researchers': 'Researchers',
        '/project-managers': 'Project Managers',
        '/product-managers': 'Product Managers',
        '/sales-experts': 'Sales Experts',
    };

    let currentCategoryLabel = categoryLabelMap[pathname || ''];

    // Handle Dashboard roles branding
    if (isAuthenticated && user && (pathname === '/dashboard' || !currentCategoryLabel)) {
        const roleLabels: Record<string, string> = {
            'talent': 'Talent Dashboard',
            'client': 'Client Dashboard',
            'agency': 'Agency Dashboard',
            'admin': 'Admin Dashboard'
        };
        currentCategoryLabel = roleLabels[user.role] || currentCategoryLabel;
    }

    const isCategoryPage = !!currentCategoryLabel;

    const handleLogout = async () => {
        await talentXApi.auth.logout();
        logout();
        toast.success('Logged out successfully');
        router.push(createPageUrl('Login'));
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
                        <Link href={isAuthenticated ? createPageUrl('Dashboard') : createPageUrl('Home')} className="flex items-center gap-2 group">
                            <span className="text-2xl font-bold text-[#1a1a2e] tracking-tight">TalentX</span>
                            {isCategoryPage && (
                                <span className="text-2xl text-[#1a1a2e] tracking-tight flex items-center">
                                    <span className="mx-2 text-gray-300 font-light">/</span>
                                    <span>{currentCategoryLabel}</span>
                                </span>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-5" onMouseLeave={() => {
                            setHoveredTab(null);
                            setOpenDropdown(null);
                        }}>
                            {!isAuthenticated ? (
                                <>
                                    {Object.entries(megaMenuData).map(([key, menu]) => (
                                        <div
                                            key={key}
                                            className="relative"
                                            onMouseEnter={() => {
                                                setOpenDropdown(key);
                                                setHoveredTab(key);
                                            }}
                                        >
                                            <button className="relative flex items-center px-0 py-6 text-[#1a1a2e] hover:text-[#204ecf] rounded-md text-[14px] font-semibold transition-all duration-200">
                                                {menu.title}
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === key ? 'rotate-180' : ''}`} />
                                                {hoveredTab === key && (
                                                    <motion.div
                                                        layoutId="navUnderline"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf] z-[60]"
                                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                            </button>

                                            {/* Invisible bridge to prevent gap */}
                                            {openDropdown === key && (
                                                <div className="absolute left-0 right-0 h-2 top-full" />
                                            )}
                                        </div>
                                    ))}

                                    <Link
                                        href={createPageUrl('Clients')}
                                        onMouseEnter={() => {
                                            setHoveredTab('clients');
                                            setOpenDropdown(null);
                                        }}
                                        className="relative px-0 py-6 text-[#1a1a2e] hover:text-[#204ecf] text-[14px] font-semibold transition-colors"
                                    >
                                        Clients
                                        {hoveredTab === 'clients' && (
                                            <motion.div
                                                layoutId="navUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf] z-[60]"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                    <Link
                                        href={createPageUrl('Blog')}
                                        onMouseEnter={() => {
                                            setHoveredTab('blog');
                                            setOpenDropdown(null);
                                        }}
                                        className="relative px-0 py-6 text-[#1a1a2e] hover:text-[#204ecf] text-[14px] font-semibold transition-colors"
                                    >
                                        Blog
                                        {hoveredTab === 'blog' && (
                                            <motion.div
                                                layoutId="navUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf] z-[60]"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                    <Link
                                        href={createPageUrl('AboutUs')}
                                        onMouseEnter={() => {
                                            setHoveredTab('about');
                                            setOpenDropdown(null);
                                        }}
                                        className="relative px-0 py-6 text-[#1a1a2e] hover:text-[#204ecf] text-sm font-semibold transition-colors"
                                    >
                                        About Us
                                        {hoveredTab === 'about' && (
                                            <motion.div
                                                layoutId="navUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf] z-[60]"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </>
                            ) : null}

                            {/* Shared Mega Menu */}
                            <AnimatePresence>
                                {openDropdown && megaMenuData[openDropdown as keyof typeof megaMenuData] && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="fixed left-1/2 -translate-x-1/2 top-[calc(4rem)] bg-white border-t border-gray-100 shadow-2xl z-50 w-[calc(100vw-2rem)] max-w-7xl overflow-hidden"
                                    >
                                        <div className="px-8 py-10">
                                            {(() => {
                                                const menu = megaMenuData[openDropdown as keyof typeof megaMenuData];
                                                if ((menu as any).viewType === 'sidebar') {
                                                    return (
                                                        <div className="flex gap-12 min-h-[400px]">
                                                            {/* Sidebar */}
                                                            <div className="w-1/4 border-r border-gray-100 pr-8 flex flex-col justify-between">
                                                                <div className="space-y-1">
                                                                    {(menu as any).categories.map((cat: any) => (
                                                                        <button
                                                                            key={cat.id}
                                                                            onMouseEnter={() => setActiveTalentCategory(cat.id)}
                                                                            className={`w-full text-left px-4 py-3 text-sm font-bold transition-all duration-200 ${activeTalentCategory === cat.id ? 'bg-blue-50 text-[#204ecf]' : 'text-[#1a1a2e] hover:bg-gray-50'}`}
                                                                        >
                                                                            {cat.name}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                <div className="pt-8 mt-8 border-t border-gray-100">
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Want to hire a team?</p>
                                                                    <Link href={createPageUrl('BrowseTeams')} className="flex items-center gap-2 text-sm font-bold text-[#204ecf] group">
                                                                        <span className="group-hover:underline">Hire a Team</span>
                                                                        <span className="text-lg">→</span>
                                                                    </Link>
                                                                </div>
                                                            </div>

                                                            {/* Content */}
                                                            <div className="w-3/4 pl-8">
                                                                {(() => {
                                                                    const currentCat = (menu as any).categories.find((c: any) => c.id === activeTalentCategory);
                                                                    if (!currentCat) return null;
                                                                    return (
                                                                        <>
                                                                            <Link href={createPageUrl(currentCat.id === 'developers' ? 'Developers' : currentCat.path || `BrowseTalent?category=${currentCat.id}`)} className="inline-flex items-center gap-2 text-lg font-bold text-[#204ecf] hover:underline mb-8">
                                                                                {currentCat.name} <span className="text-xl">→</span>
                                                                            </Link>
                                                                            <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                                                                                {currentCat.roles.map((role: string, roleIdx: number) => (
                                                                                    <Link
                                                                                        key={roleIdx}
                                                                                        href={createPageUrl(`BrowseTalent?query=${encodeURIComponent(role)}`)}
                                                                                        className="text-sm text-gray-600 hover:text-[#204ecf] transition-colors"
                                                                                    >
                                                                                        {role}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                            <div className="mt-12">
                                                                                <Link href={createPageUrl('BrowseTalent')} className="text-sm font-bold text-[#204ecf] hover:underline">
                                                                                    See more skills →
                                                                                </Link>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="grid grid-cols-3 gap-12">
                                                            {(menu as any).sections.map((section: any, idx: number) => (
                                                                <div key={idx} className={`${section.isPromo ? 'bg-gray-50 p-6 rounded-2xl border border-gray-100' : ''}`}>
                                                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                                                        {section.title}
                                                                    </h3>
                                                                    <div className="space-y-6">
                                                                        {section.items.map((item: any, itemIdx: number) => (
                                                                            <Link
                                                                                key={itemIdx}
                                                                                href={createPageUrl(
                                                                                    openDropdown === 'talent' ? `BrowseTalent?category=${item.category}` :
                                                                                        openDropdown === 'team' ? `BrowseTeams?spec=${item.spec}` :
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
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                                <div className="flex items-center gap-4">
                                    {user && <NotificationCenter userId={user.id} />}
                                    <div className="text-sm font-medium text-gray-600 hidden xl:block border-l border-gray-200 pl-4">
                                        Hi, {user?.full_name?.split(' ')[0]}
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 gap-2 shadow-sm ml-2"
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
                            {!isAuthenticated ? (
                                Object.entries(megaMenuData).map(([key, menu]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {menu.title}
                                        </div>
                                        {(menu as any).viewType === 'sidebar' ? (
                                            <div className="pl-4 space-y-4">
                                                {(menu as any).categories.map((cat: any) => (
                                                    <div key={cat.id} className="space-y-2">
                                                        <div className="text-sm font-bold text-gray-900 px-4">{cat.name}</div>
                                                        <div className="pl-4 border-l-2 border-gray-100 space-y-1">
                                                            {cat.roles.slice(0, 5).map((role: string, rIdx: number) => (
                                                                <Link
                                                                    key={rIdx}
                                                                    href={createPageUrl(`BrowseTalent?query=${encodeURIComponent(role)}`)}
                                                                    className="block px-4 py-1.5 text-xs text-gray-600 hover:text-[#204ecf]"
                                                                >
                                                                    {role}
                                                                </Link>
                                                            ))}
                                                            <Link href={createPageUrl(cat.id === 'developers' ? 'Developers' : cat.path || `BrowseTalent?category=${cat.id}`)} className="block px-4 py-1.5 text-xs font-bold text-[#204ecf]">
                                                                View all {cat.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            (menu as any).sections.map((section: any, sIdx: number) => (
                                                <div key={sIdx} className="pl-4 space-y-1">
                                                    {section.items.map((item: any, iIdx: number) => (
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
                                            ))
                                        )}
                                    </div>
                                ))
                            ) : null}
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
        </nav >
    );
}
