'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Check, CreditCard, Shield, Lock, ArrowRight, Loader2, Building2, Zap } from 'lucide-react';

function HireContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { register, isLoading: isAuthLoading } = useAuthStore();

    const [step, setStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState('professional');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    useEffect(() => {
        const plan = searchParams.get('plan');
        if (plan) {
            setSelectedPlan(plan);
        }
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.full_name || !formData.email || !formData.password || !formData.companyName) {
            toast.error('Please fill in all mandatory fields');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);

            // Register as Client
            const registrationData = {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                role: 'client' as const,
                // These are extra fields, our API should handle or ignore
                company_name: formData.companyName,
                subscription_plan: selectedPlan
            };

            await register(registrationData);

            toast.success(`Welcome to TalentX! Your ${selectedPlan} plan is active.`);
            router.push(createPageUrl('Dashboard'));
        } catch (error: any) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'Registration failed. Please check your details.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Select Plan' },
        { number: 2, title: 'Account Creation' }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col pt-20">
            <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
                {/* Header/Logo Case */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#204ecf] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-black text-[#1a1a2e] tracking-tighter">Talent<span className="text-[#204ecf]">X</span></span>
                    </Link>
                    <h1 className="text-3xl font-bold text-[#1a1a2e]">Join the Professional Network</h1>
                </motion.div>

                {/* Progress Steps */}
                <div className="w-full max-w-xl mb-12">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#204ecf] -z-10 transition-all duration-500 rounded-full"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        ></div>

                        {steps.map((s) => (
                            <div key={s.number} className="flex flex-col items-center gap-3 bg-[#f8fafc] px-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 border-4 ${step >= s.number ? 'bg-[#204ecf] text-white border-blue-100' : 'bg-white text-gray-400 border-gray-100'
                                    }`}>
                                    {step > s.number ? <Check className="w-6 h-6" /> : s.number}
                                </div>
                                <span className={`text-sm font-bold tracking-tight uppercase ${step >= s.number ? 'text-[#204ecf]' : 'text-gray-400'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                    <div className="p-10">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-[#1a1a2e]">Choose your membership</h2>
                                        <p className="text-gray-500 mt-2">Select the plan that fits your execution needs.</p>
                                    </div>

                                    <div className="grid gap-6">
                                        {[
                                            { id: 'basic', name: 'Apprentice', price: '$29', features: ['3 Talent Matches/mo', 'Email Support', 'Standard Network'], icon: Zap },
                                            { id: 'professional', name: 'Professional', price: '$59', features: ['Unlimited Matches', 'Dedicated Account Lead', 'Top 10% Talent Access', 'Priority Matching'], popular: true, icon: Shield },
                                            { id: 'enterprise', name: 'Enterprise', price: '$199', features: ['Custom Sourcing', 'Full Managed Teams', 'Top 3% Talent Access', 'SLA Guarantees'], icon: Building2 }
                                        ].map((plan) => (
                                            <div
                                                key={plan.id}
                                                onClick={() => setSelectedPlan(plan.id)}
                                                className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${selectedPlan === plan.id ? 'border-[#204ecf] bg-blue-50/10' : 'border-gray-50 hover:border-gray-200 bg-white'
                                                    }`}
                                            >
                                                {plan.popular && (
                                                    <span className="absolute top-4 right-4 bg-[#204ecf] text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest">
                                                        MOST POPULAR
                                                    </span>
                                                )}
                                                <div className="flex items-start gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${selectedPlan === plan.id ? 'bg-[#204ecf] text-white shadow-lg shadow-blue-500/20' : 'bg-gray-50 text-gray-400'}`}>
                                                        <plan.icon className="w-8 h-8" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h3 className="font-bold text-xl text-[#1a1a2e]">{plan.name}</h3>
                                                            <div className="text-right">
                                                                <span className="text-2xl font-black text-[#1a1a2e]">{plan.price}</span>
                                                                <span className="text-gray-400 text-sm font-medium ml-1">/mo</span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                            {plan.features.map((f, i) => (
                                                                <span key={i} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                                    <Check className={`w-4 h-4 ${selectedPlan === plan.id ? 'text-[#00cc83]' : 'text-gray-300'}`} /> {f}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={() => setStep(2)}
                                        className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white font-black py-8 text-xl rounded-2xl shadow-xl shadow-blue-500/20 group uppercase tracking-widest transition-all hover:scale-[1.01]"
                                    >
                                        Configure Account <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-[#1a1a2e]">Create your workspace</h2>
                                        <p className="text-gray-500 mt-2">Initialize your professional client account.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName" className="font-bold text-gray-700">Company Name</Label>
                                                <Input
                                                    className='text-gray-900 bg-gray-50 border-gray-100 h-14 rounded-xl focus:bg-white transition-all'
                                                    id="companyName"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    placeholder="Acme Global Inc."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="full_name" className="font-bold text-gray-700">Full Name</Label>
                                                <Input
                                                    className='text-gray-900 bg-gray-50 border-gray-100 h-14 rounded-xl focus:bg-white transition-all'
                                                    id="full_name"
                                                    name="full_name"
                                                    value={formData.full_name}
                                                    onChange={handleInputChange}
                                                    placeholder="John Wick"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="font-bold text-gray-700">Work Email</Label>
                                            <Input
                                                className='text-gray-900 bg-gray-50 border-gray-100 h-14 rounded-xl focus:bg-white transition-all'
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@wick.com"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="font-bold text-gray-700">Password</Label>
                                                <Input
                                                    className='text-gray-900 bg-gray-50 border-gray-100 h-14 rounded-xl focus:bg-white transition-all'
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword" className="font-bold text-gray-700">Confirm Password</Label>
                                                <Input
                                                    className='text-gray-900 bg-gray-50 border-gray-100 h-14 rounded-xl focus:bg-white transition-all'
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-start gap-4">
                                            <Shield className="w-6 h-6 text-[#204ecf] mt-1 shrink-0" />
                                            <div>
                                                <p className="font-bold text-[#1a1a2e]">Enterprise-Grade Security</p>
                                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">Your data is encrypted using AES-256 standards. We never share your company details with 3rd parties without explicit consent.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="w-1/3 border-gray-200 text-gray-500 font-bold py-7 rounded-2xl hover:bg-gray-50"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            onClick={handleRegister}
                                            className="w-2/3 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-black py-7 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
                                            disabled={isLoading || isAuthLoading}
                                        >
                                            {isLoading || isAuthLoading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>Launch My Account <ArrowRight className="w-6 h-6" /></>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-center text-xs text-gray-400 px-10 leading-relaxed font-medium">
                                        By clicking Launch, you agree to our <Link href="/terms" className="underline hover:text-gray-600">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 text-sm font-medium">
                    <p>© 2024 TalentX Global Network. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default function HirePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#204ecf]" />
            </div>
        }>
            <HireContent />
        </Suspense>
    );
}
