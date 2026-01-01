'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { talentXApi } from '@/api/talentXApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Check, CreditCard, Shield, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter();

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

    const handleNextStep = () => {
        if (step === 2) {
            if (!formData.full_name || !formData.email || !formData.password || !formData.companyName) {
                toast.error('Please fill in all fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }
        }
        setStep(step + 1);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate payment validation
        if (formData.cardNumber.length < 16) {
            toast.error('Invalid card number');
            return;
        }

        try {
            setIsLoading(true);
            dispatch(loginStart());

            // Register as Client
            const registrationData = {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                role: 'client',
                // Additional simulated data
                company_name: formData.companyName,
                subscription_plan: selectedPlan
            };

            const { user, token } = await talentXApi.auth.register(registrationData);

            dispatch(loginSuccess({ user, token }));
            toast.success(`Welcome to TalentX! Your ${selectedPlan} plan is active.`);

            router.push(createPageUrl('Dashboard'));
        } catch (error: any) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            dispatch(loginFailure(message));
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Select Plan' },
        { number: 2, title: 'Account Details' },
        { number: 3, title: 'Payment' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link href={createPageUrl('Home')} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#00c853] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">TX</span>
                        </div>
                        <span className="text-xl font-bold text-[#1a1a2e]">TalentX</span>
                    </Link>
                    <div className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href={createPageUrl('Login')} className="text-[#204ecf] font-bold hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
                {/* Progress Steps */}
                <div className="w-full max-w-3xl mb-12">
                    <div className="flex justify-between items-center relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#204ecf] -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                        {steps.map((s) => (
                            <div key={s.number} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.number ? 'bg-[#204ecf] text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                                </div>
                                <span className={`text-xs font-medium ${step >= s.number ? 'text-[#204ecf]' : 'text-gray-500'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-center text-[#1a1a2e]">Choose your plan</h2>
                                    <div className="grid gap-4">
                                        {[
                                            { id: 'basic', name: 'Apprentice', price: '$29', features: ['5 Candidates/mo', 'Email Support'] },
                                            { id: 'professional', name: 'Professional', price: '$59', features: ['Unlimited Candidates', 'Priority Support', 'Top 3% Talent'], popular: true },
                                            { id: 'enterprise', name: 'Enterprise', price: '$199', features: ['Dedicated Account Manager', 'Custom Contracts', 'API Access'] }
                                        ].map((plan) => (
                                            <div
                                                key={plan.id}
                                                onClick={() => setSelectedPlan(plan.id)}
                                                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-[#204ecf] bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                                                    }`}
                                            >
                                                {plan.popular && (
                                                    <span className="absolute top-0 right-0 bg-[#204ecf] text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                                                        POPULAR
                                                    </span>
                                                )}
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                                    <span className="text-xl font-bold">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></span>
                                                </div>
                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    {plan.features.map((f, i) => (
                                                        <span key={i} className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> {f}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button onClick={() => setStep(2)} className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold py-6">
                                        Continue to Details <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>

                                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                        <p className="text-sm text-gray-600 mb-2">Are you a freelancer or agency?</p>
                                        <div className="flex justify-center gap-4 text-sm font-medium">
                                            <Link href={createPageUrl('ApplyTalent')} className="text-[#204ecf] hover:underline">Apply as Talent</Link>
                                            <span className="text-gray-300">|</span>
                                            <Link href={createPageUrl('ApplyAgency')} className="text-[#204ecf] hover:underline">Register Agency</Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-center text-[#1a1a2e]">Create your account</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Acme Inc." />
                                        </div>
                                        <div>
                                            <Label htmlFor="full_name">Full Name</Label>
                                            <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Work Email</Label>
                                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@acme.com" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="password">Password</Label>
                                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} />
                                            </div>
                                            <div>
                                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">Back</Button>
                                        <Button onClick={handleNextStep} className="w-2/3 bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold py-6">
                                            Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
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
                                    <h2 className="text-2xl font-bold text-center text-[#1a1a2e]">Secure Payment</h2>

                                    <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-[#204ecf] mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <p className="font-bold">14-Day Money-Back Guarantee</p>
                                            <p>If you're not satisfied, we'll refund your payment in full.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="cardNumber">Card Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="cardNumber"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="0000 0000 0000 0000"
                                                    className="pl-10"
                                                    maxLength={19}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                                <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" maxLength={5} />
                                            </div>
                                            <div>
                                                <Label htmlFor="cvc">CVC</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <Input id="cvc" name="cvc" placeholder="123" maxLength={3} className="pl-9" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => setStep(2)} className="w-1/3">Back</Button>
                                        <Button
                                            onClick={handleRegister}
                                            className="w-2/3 bg-[#00c853] hover:bg-[#00a844] text-white font-bold py-6 shadow-lg shadow-green-200"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                'Pay & Create Account'
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-center text-gray-400">
                                        By clicking Pay, you agree to our Terms of Service.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>© 2024 TalentX Inc. Secure 256-bit SSL Encrypted.</p>
                </div>
            </div>
        </div>
    );
}
