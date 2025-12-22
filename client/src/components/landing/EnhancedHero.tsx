"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { createPageUrl } from "@/utils";

export default function EnhancedHero() {
  const [activeTab, setActiveTab] = useState("talent");

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f5f7fa] to-[#eef2f7] -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#204ecf]/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Switcher - Toptal Style */}
        <div className="flex justify-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white p-1.5 rounded-full shadow-sm border border-gray-100"
          >
            <span className="pl-4 pr-2 font-medium">I'm looking for</span>
            <div className="inline-flex bg-[#f5f7fa] rounded-full p-1">
              {[
                { id: "talent", label: "Talent", link: "BrowseTalent" },
                { id: "team", label: "Team", link: "BrowseTeams" },
                { id: "agency", label: "Agency", link: "BrowseAgencies" },
              ].map((tab) => (
                <Link key={tab.id} href={createPageUrl(tab.link)}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1a1a2e] leading-[1.1] tracking-tight">
              Hire the{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Top 10%</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/20 -z-0 transform -skew-x-12"></span>
              </span>{" "}
              of Global Talent
            </h1>
            <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-lg">
              TalentX is an exclusive network of the top software developers,
              designers, finance experts, product managers, and project managers
              in the world.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Link href={createPageUrl("BrowseTalent")}>
                <Button className="h-14 px-8 text-lg bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1">
                  Hire Top Talent
                </Button>
              </Link>
              <Link href={createPageUrl("ApplyTalent")}>
                <Button
                  variant="outline"
                  className="h-14 px-6 py-7 text-lg border-2 border-gray-200 hover:border-primary hover:text-primary hover:bg-transparent transition-all duration-300"
                >
                  Apply as a Talent
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Featured Talent Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

            {/* Main Image Container */}
            <div className="relative z-10">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 border border-white/50">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=900&fit=crop"
                  alt="Featured Talent"
                  className="w-full max-w-md mx-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Talent Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      Available Now
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">Sarah Chen</h3>
                  <p className="text-lg text-gray-200 font-medium">
                    Senior Product Designer
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Previously at Apple & Google
                  </p>
                </div>
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -right-12 top-20 bg-white rounded-xl shadow-xl p-6 border border-gray-100 max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">
                      Success Rate
                    </p>
                    <p className="text-xl font-bold text-gray-900">98%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-tight">
                  Projects completed successfully on time
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
