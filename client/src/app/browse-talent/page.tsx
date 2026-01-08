"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Search,
  Filter,
  Star,
  Briefcase,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { talentXApi } from "@/api/talentXApi";
import { Talent } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import AIMatchingModal from "@/components/AIMatchingModal";

import { Pagination } from "@/components/ui/Pagination";
import { Suspense } from "react";

function BrowseTalentContent() {
  const searchParams = useSearchParams();
  const [talents, setTalents] = useState<(Talent & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchTermFromUrl = searchParams.get("searchTerm");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("all");
    }

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    } else {
      setSearchTerm("");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchTalents = async () => {
      setLoading(true);
      try {
        const result = await talentXApi.entities.Talent.list();
        let filtered = result as (Talent & { id: string })[];

        if (selectedCategory !== "all") {
          filtered = filtered.filter((t) => t.category === selectedCategory);
        }

        if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.full_name.toLowerCase().includes(lowerTerm) ||
              t.title.toLowerCase().includes(lowerTerm) ||
              t.skills?.some((s) => s.toLowerCase().includes(lowerTerm))
          );
        }

        setTalents(filtered);
        setCurrentPage(1); // Reset to first page on filter change
      } catch (error) {
        console.error("Failed to fetch talents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [selectedCategory, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(talents.length / itemsPerPage);
  const paginatedTalents = talents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [
    { id: "all", label: "All Talent" },
    { id: "developer", label: "Developers" },
    { id: "designer", label: "Designers" },
    { id: "marketing", label: "Marketing" },
    { id: "finance", label: "Finance" },
    { id: "product_manager", label: "Product Managers" },
    { id: "project_manager", label: "Project Managers" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/40 to-gray-100/60 pt-20 pb-16">
      <AIMatchingModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a2e] tracking-tight">
              Browse Top Talent
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Connect with the top 3% of freelance talent. Pre-vetted, expert
              professionals ready to join your team.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setIsAIModalOpen(true)}
              className="bg-[#204ecf] hover:bg-[#1a3da8] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-[#204ecf]/20 hover:shadow-[#204ecf]/30 flex items-center gap-2.5 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              AI Matcher
            </Button>
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full lg:w-80 shrink-0 space-y-6"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name or skill..."
                className="pl-12 pr-4 bg-white/90 backdrop-blur-sm border-gray-200/80 focus:border-[#204ecf] focus:ring-[#204ecf]/20 h-12 text-base shadow-sm hover:shadow-md transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/80 p-6">
              <h3 className="font-bold text-lg text-[#1a1a2e] mb-5 flex items-center gap-2.5">
                <Filter className="w-5 h-5 text-[#204ecf]" />
                Categories
              </h3>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    whileHover={{ x: 2 }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${selectedCategory === cat.id
                      ? "bg-[#204ecf] text-white shadow-lg shadow-[#204ecf]/25"
                      : "text-gray-700 hover:bg-gray-50/80 hover:text-[#204ecf]"
                      }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl h-[400px] animate-pulse border border-gray-200/80"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                  {paginatedTalents.map((talent, index) => {
                    const roundedRating = talent.rating
                      ? parseFloat(talent.rating.toString()).toFixed(1)
                      : null;

                    return (
                      <motion.div
                        key={talent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <Link
                          href={createPageUrl(`talent-profile?id=${talent.id}`)}
                        >
                          <Card className="h-full bg-white/95 backdrop-blur-sm hover:shadow-2xl hover:shadow-[#204ecf]/5 transition-all duration-500 border border-gray-200/80 group cursor-pointer overflow-hidden flex flex-col hover:border-[#204ecf]/30">
                            <CardContent className="pt-4 pb-4 px-6 flex-1">
                              {/* Top Row: Image, Name, Rating */}
                              <div className="flex items-start gap-3 mb-2">
                                {/* Small Profile Picture on Left */}
                                <div className="relative shrink-0">
                                  <Image
                                    src={
                                      talent.image_url ||
                                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        talent.full_name
                                      )}&background=random`
                                    }
                                    alt={talent.full_name}
                                    width={60}
                                    height={60}
                                    unoptimized
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                  />
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00c853] border-2 border-white rounded-full"></div>
                                </div>

                                {/* Name and Location */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors">
                                    {talent.full_name}
                                  </h3>
                                  <p className="text-sm text-gray-500 font-medium mt-0.5">
                                    {talent.location || "Remote"}
                                  </p>
                                </div>

                                {/* Rating */}
                                {roundedRating && (
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100 shrink-0">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-yellow-700">
                                      {roundedRating}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Job Title - Left aligned */}
                              <div className="mb-3">
                                <p className="text-sm font-bold text-[#1a1a2e]">
                                  {talent.title}
                                </p>
                              </div>

                              {/* Skills */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {talent.skills?.slice(0, 3).map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium border border-gray-100"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {talent.skills && talent.skills.length > 3 && (
                                  <span className="px-2.5 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium border border-gray-100">
                                    +{talent.skills.length - 3}
                                  </span>
                                )}
                              </div>

                              {/* Additional Info */}
                              <div className="space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-3">
                                <div className="flex items-center gap-3">
                                  <Briefcase className="w-4 h-4 text-gray-400" />
                                  <span>
                                    {talent.experience_years || 0}+ years exp.
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <span className="font-semibold text-[#1a1a2e]">
                                    ${talent.hourly_rate || 0}/hr
                                  </span>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center mt-auto">
                              <span className="text-xs font-medium text-green-600 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Available Now
                              </span>
                              <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                View Profile{" "}
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </CardFooter>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}

            {!loading && talents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-sm"
              >
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No talent found
                </h3>
                <p className="text-base text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function BrowseTalent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/40 to-gray-100/60 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#204ecf]" />
        </div>
      }
    >
      <BrowseTalentContent />
    </Suspense>
  );
}
