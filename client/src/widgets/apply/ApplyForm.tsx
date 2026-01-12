'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ChevronRight, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '@/shared/api/talentXApi';

interface ApplyFormProps {
    onSuccess: () => void;
}

export default function ApplyForm({ onSuccess }: ApplyFormProps) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        linkedin: '',
        portfolio: '',
        experience: '',
        agencyName: '',
        companyWebsite: '',
        linkedinCompany: '',
        teamSize: '',
        foundedYear: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            toast.error("File missing", {
                description: formData.role === 'agency' ? "Please upload your company profile." : "Please upload your resume."
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('full_name', formData.fullName);
            data.append('email', formData.email);

            if (formData.role === 'agency') {
                data.append('role', 'agency');
                data.append('agency_name', formData.agencyName);
                data.append('company_website', formData.companyWebsite);
                data.append('linkedin_company_page', formData.linkedinCompany);
                data.append('team_size', formData.teamSize);
                data.append('founded_year', formData.foundedYear);
            } else {
                const roleLabels: Record<string, string> = {
                    developer: 'Software Developer',
                    designer: 'Designer',
                    finance: 'Finance Expert',
                    product: 'Product Manager',
                    project: 'Project Manager'
                };
                data.append('role', 'talent');
                data.append('title', roleLabels[formData.role] || formData.role);
                data.append('category', formData.role);
                data.append('experience', formData.experience);
                data.append('linkedin', formData.linkedin);
                if (formData.portfolio) data.append('portfolio', formData.portfolio);
            }

            data.append('password', 'ChangesRequired123!');
            data.append('resume', resumeFile);

            const response = await fetch(`${API_URL}/applications/submit`, {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit application");
            }

            toast.success("Details Submitted");
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Submission failed", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalSteps = formData.role === 'agency' ? 2 : 3;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 flex">
                <motion.div
                    className="h-full bg-[#204ecf]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <form onSubmit={handleSubmit} className="p-12">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Basic Information</h2>
                                <p className="text-gray-500">Let's start with the basics.</p>
                            </div>

                            {/* Role Toggle */}
                            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'developer' }))}
                                    className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${!['agency'].includes(formData.role) ? 'bg-white text-[#204ecf] shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Apply as Talent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'agency' }))}
                                    className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${formData.role === 'agency' ? 'bg-white text-[#204ecf] shadow-md scale-[1.02]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Apply as Agency
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-black font-semibold">
                                        {formData.role === 'agency' ? 'Representative Name' : 'Full Name'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder={formData.role === 'agency' ? "Jane Smith" : "John Doe"}
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-black font-semibold">
                                        {formData.role === 'agency' ? 'Work Email' : 'Email Address'} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                    />
                                </div>

                                {formData.role === 'agency' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="agencyName" className="text-black font-semibold">Agency Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="agencyName"
                                                name="agencyName"
                                                placeholder="Creative Solutions Ltd."
                                                value={formData.agencyName}
                                                onChange={handleInputChange}
                                                required
                                                className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="companyWebsite" className="text-black font-semibold">Company Website <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="companyWebsite"
                                                name="companyWebsite"
                                                placeholder="https://agency.com"
                                                value={formData.companyWebsite}
                                                onChange={handleInputChange}
                                                required
                                                className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedinCompany" className="text-black font-semibold">LinkedIn Company Page <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="linkedinCompany"
                                                name="linkedinCompany"
                                                placeholder="https://linkedin.com/company/agency"
                                                value={formData.linkedinCompany}
                                                onChange={handleInputChange}
                                                required
                                                className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="teamSize" className="text-black font-semibold">Team Size <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="teamSize"
                                                    name="teamSize"
                                                    type="number"
                                                    placeholder="e.g. 15"
                                                    value={formData.teamSize}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="foundedYear" className="text-black font-semibold">Year Founded <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id="foundedYear"
                                                    name="foundedYear"
                                                    type="number"
                                                    placeholder="e.g. 2015"
                                                    value={formData.foundedYear}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-black font-semibold">Primary Role <span className="text-red-500">*</span></Label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full h-12 rounded-xl text-black border border-gray-200 px-4 focus:outline-none focus:border-[#204ecf] focus:ring-1 focus:ring-[#204ecf] bg-white text-sm"
                                        >
                                            <option value="">Select a role</option>
                                            <option value="developer">Software Developer</option>
                                            <option value="designer">Designer</option>
                                            <option value="finance">Finance Expert</option>
                                            <option value="product">Product Manager</option>
                                            <option value="project">Project Manager</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <Button
                                type="button"
                                onClick={() => {
                                    // Validation for Step 1
                                    if (!formData.fullName || !formData.email) {
                                        toast.error("Required fields missing", { description: "Please fill in your name and email." });
                                        return;
                                    }

                                    if (formData.role === 'agency') {
                                        if (!formData.agencyName || !formData.companyWebsite || !formData.linkedinCompany || !formData.teamSize || !formData.foundedYear) {
                                            toast.error("Required fields missing", { description: "Please fill in all agency details." });
                                            return;
                                        }
                                        setStep(3);
                                    } else {
                                        if (!formData.role) {
                                            toast.error("Role required", { description: "Please select a primary role." });
                                            return;
                                        }
                                        nextStep();
                                    }
                                }}
                                className="w-full h-14 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl mt-8"
                            >
                                Next Step
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </motion.div>
                    )}

                    {step === 2 && formData.role !== 'agency' && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Professional Details</h2>
                                <p className="text-gray-500">Tell us about your professional background.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin" className="text-black font-semibold">LinkedIn Profile URL <span className="text-red-500">*</span></Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    placeholder="https://linkedin.com/in/username"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    required
                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="portfolio" className="text-black font-semibold">Portfolio URL (Optional)</Label>
                                <Input
                                    id="portfolio"
                                    name="portfolio"
                                    placeholder="https://yourportfolio.com"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-black font-semibold">Years of Experience <span className="text-red-500">*</span></Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    placeholder="5"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    required
                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-[#204ecf] focus:ring-[#204ecf]"
                                />
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="flex-1 h-14 border-2 border-gray-100 font-bold rounded-xl"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (!formData.linkedin || !formData.experience) {
                                            toast.error("Required fields missing", { description: "Please provide your LinkedIn profile and years of experience." });
                                            return;
                                        }
                                        nextStep();
                                    }}
                                    className="flex-[2] h-14 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold rounded-xl"
                                >
                                    Next Step
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                                    {formData.role === 'agency' ? 'Company Profile' : 'Resume & CV'}
                                </h2>
                                <p className="text-gray-500">
                                    {formData.role === 'agency' ? 'Upload your company profile/deck (PDF).' : 'Upload your latest resume to complete.'}
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center hover:border-[#204ecf] transition-colors cursor-pointer group relative">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#204ecf] group-hover:text-white transition-colors">
                                    <Upload className="w-8 h-8 text-[#204ecf] group-hover:text-white" />
                                </div>
                                <p className="font-bold text-[#1a1a2e] mb-1">
                                    {resumeFile ? resumeFile.name : (formData.role === 'agency' ? "Click to upload Company Profile" : "Click to upload Resume")}
                                </p>
                                <p className="text-sm text-gray-500">PDF, DOCX (Max 10MB)</p>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <CheckCircle2 className="w-5 h-5 text-[#204ecf]" />
                                <p className="text-xs text-gray-600">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (formData.role === 'agency') {
                                            setStep(1); // Go back to Basic Info for Agency
                                        } else {
                                            prevStep();
                                        }
                                    }}
                                    className="flex-1 h-14 border-2 border-gray-100 font-bold rounded-xl"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] h-14 bg-[#00c853] hover:bg-[#009624] text-white font-bold rounded-xl shadow-lg shadow-green-900/20"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
}
