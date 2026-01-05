import React from "react";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Globe,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";

// Helper function to build BrowseTalent URL with query params
const buildBrowseTalentUrl = (params: {
  category?: string;
  searchTerm?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.set("category", params.category);
  if (params.searchTerm) queryParams.set("searchTerm", params.searchTerm);
  return `BrowseTalent${
    queryParams.toString() ? "?" + queryParams.toString() : ""
  }`;
};

// TypeScript types for footer links
type FooterLink =
  | { label: string; category: string; url?: never; searchTerm?: never }
  | { label: string; url: string; category?: never; searchTerm?: never }
  | { label: string; searchTerm: string; category?: never; url?: never };

type SkillsetLink =
  | { label: string; category: string; searchTerm?: never }
  | { label: string; searchTerm: string; category?: never };

// Category data with proper category/searchTerm fields
const footerData: Record<string, FooterLink[]> = {
  "Hire Talent": [
    { label: "Developers", category: "developer" },
    { label: "Designers", category: "designer" },
    { label: "Marketing", category: "marketing" },
    { label: "Finance", category: "finance" },
    { label: "Product Managers", category: "product_manager" },
    { label: "Project Managers", category: "project_manager" },
  ],
  Team: [
    { label: "How it works", url: "Process" },
    { label: "Our experts", url: "Experts" },
    { label: "Talent vetting", url: "Vetting" },
    { label: "Join as talent", url: "Join" },
  ],
  Agency: [
    { label: "For agencies", url: "Agencies" },
    { label: "Partner with us", url: "Partners" },
    { label: "Enterprise solutions", url: "Enterprise" },
    { label: "Case studies", url: "CaseStudies" },
  ],
  About: [
    { label: "Company", url: "AboutUs" },
    { label: "Careers", url: "AboutUs" },
    { label: "Blog", url: "Blog" },
    { label: "Contact", url: "HelpCenter" },
    { label: "Help Center", url: "HelpCenter" },
  ],
};

const skillsets: {
  category: string;
  categoryFilter?: string;
  links: SkillsetLink[];
}[] = [
  {
    category: "Engineering",
    categoryFilter: "developer",
    links: [
      { label: "React Specialists", searchTerm: "react" },
      { label: "Python Architects", searchTerm: "python" },
      { label: "AWS Experts", searchTerm: "aws" },
      { label: "Node.js Devs", searchTerm: "node" },
    ],
  },
  {
    category: "Design",
    categoryFilter: "designer",
    links: [
      { label: "UI/UX Design", category: "designer" },
      { label: "Brand Strategy", searchTerm: "brand" },
      { label: "Motion Graphics", searchTerm: "motion" },
      { label: "Visual Design", searchTerm: "visual" },
    ],
  },
  {
    category: "Management",
    categoryFilter: "project_manager",
    links: [
      { label: "Agile Coaches", searchTerm: "agile" },
      { label: "Scrum Masters", searchTerm: "scrum" },
      { label: "Product Owners", category: "product_manager" },
      { label: "Project Leads", category: "project_manager" },
    ],
  },
  {
    category: "Specialized",
    links: [
      { label: "Data Science", searchTerm: "data" },
      { label: "AI & ML", searchTerm: "ai" },
      { label: "FinTech Experts", category: "finance" },
      { label: "Growth Hackers", category: "marketing" },
    ],
  },
];

export default function FooterLayout() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col">
      {/* MAIN FOOTER */}
      <footer className="bg-[#0f256e] text-white font-sans border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
              <Link
                href={createPageUrl("Home")}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#00c853] flex items-center justify-center rounded-lg shadow-lg">
                  <span className="text-white font-extrabold text-xl">X</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  TalentX
                </span>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Empowering global innovation by connecting world-class
                enterprises with elite specialized talent. Your vision, scaled
                by the top 3%.
              </p>
              <div className="flex gap-4">
                {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-gray-400 hover:text-white"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerData).map(([title, links]) => (
                <div key={title} className="flex flex-col">
                  <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-6 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#00c853] rounded-full"></span>
                    {title}
                  </h4>
                  <ul className="space-y-4">
                    {links.map((link) => {
                      // Build the proper URL based on category, searchTerm, or url
                      let href: string;
                      if (link.category) {
                        href = createPageUrl(
                          buildBrowseTalentUrl({ category: link.category })
                        );
                      } else if (link.searchTerm) {
                        href = createPageUrl(
                          buildBrowseTalentUrl({ searchTerm: link.searchTerm })
                        );
                      } else if (link.url) {
                        href = createPageUrl(link.url);
                      } else {
                        href = createPageUrl("Home"); // Default fallback
                      }

                      return (
                        <li key={link.label}>
                          <Link
                            href={href}
                            className="text-gray-400 hover:text-white text-sm transition-colors flex items-center group relative overflow-visible"
                          >
                            <ChevronRight className="w-3.5 h-3.5 mr-1.5 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all duration-300 text-[#00c853]" />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="bg-[#0a1a4f] py-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">
              © {currentYear} TalentX Professional Network. All Rights Reserved.
            </p>
            <div className="flex items-center gap-8 text-xs text-gray-500">
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
              <div className="flex items-center gap-2 border-l border-white/10 pl-8">
                <Globe className="w-4 h-4" />
                <span>Global (EN)</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* EXPERT SKILLSETS DISCOVERY SECTION */}
      <section className="bg-[#f8faff] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <span className="text-[#00c853] font-bold text-xs tracking-widest uppercase">
                Specialized Domains
              </span>
              <h2 className="text-[#0f256e] text-3xl md:text-4xl font-extrabold mt-3 leading-tight">
                Find specialized expertise for your next breakthrough.
              </h2>
            </div>
            <Link
              href={createPageUrl("BrowseTalent")}
              className="flex items-center gap-2 text-[#0f256e] font-bold hover:translate-x-1 transition-transform border-b-2 border-[#00c853] pb-1"
            >
              Explore all skillsets <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillsets.map((item) => (
              <div
                key={item.category}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
              >
                <h5 className="text-[#0f256e] font-bold text-lg mb-6 flex justify-between items-center">
                  {item.category}
                  {/* Arrow links to category if available, otherwise just BrowseTalent */}
                  <Link
                    href={createPageUrl(
                      item.categoryFilter
                        ? buildBrowseTalentUrl({
                            category: item.categoryFilter,
                          })
                        : "BrowseTalent"
                    )}
                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#0f256e] group-hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </h5>
                <ul className="space-y-3">
                  {item.links.map((link) => {
                    // Build the proper URL based on category or searchTerm
                    const href = link.category
                      ? createPageUrl(
                          buildBrowseTalentUrl({ category: link.category })
                        )
                      : createPageUrl(
                          buildBrowseTalentUrl({ searchTerm: link.searchTerm })
                        );

                    return (
                      <li key={link.label}>
                        <Link
                          href={href}
                          className="text-slate-500 hover:text-[#00c853] text-sm font-medium transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
