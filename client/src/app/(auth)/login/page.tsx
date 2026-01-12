'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/model/auth.store';
import GuestGuard from '@/features/auth/ui/GuestGuard';

export default function Login() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        try {
            await login({ email, password });
            toast.success(`Welcome back!`);
            router.push(createPageUrl('Dashboard'));
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Invalid credentials');
        }
    };



    return (
        <GuestGuard>
            <div className="min-h-screen bg-white flex">
                {/* Left Side - Image/Brand */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a2e] relative overflow-hidden items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
                    <div className="relative z-10 max-w-md px-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">Hire the Top 10% of Freelance Talent</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            TalentX connects you with the world's best software developers, designers, and finance experts.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <Link href={createPageUrl('Home')} className="inline-flex items-center text-gray-500 hover:text-[#204ecf] mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Welcome Back</h1>
                            <p className="text-gray-600">Sign in to access your dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className="h-12 pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <Link href="#" className="text-sm text-[#204ecf] hover:underline font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="h-12 pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white font-bold py-6 text-lg rounded-lg shadow-lg shadow-blue-900/20 disabled:opacity-70"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <Link href={createPageUrl('Register')} className="text-[#204ecf] hover:underline font-bold">
                                    Apply to Join
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestGuard>
    );
}
