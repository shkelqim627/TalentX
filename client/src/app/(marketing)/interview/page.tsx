'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, CheckCircle, ArrowRight, Loader2, Sparkles, Shield, Check, CreditCard, Lock, Building2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPageUrl } from '@/shared/lib/utils';
import { toast } from 'sonner';

interface Message {
    id: string;
    sender: 'ai' | 'user';
    content: string;
}

export default function InterviewPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'ai',
            content: "Hi there! I'm TalentAI, your dedicated screening assistant. I'll be conducting your initial evaluation today. To get started, could you please tell me your full name?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [step, setStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const questions = [
        "Great to meet you! What is your primary area of expertise (e.g., React Developer, UX Designer, Project Manager)?",
        "Impressive. How many years of professional experience do you have in this field?",
        "Could you briefly describe a challenging project you've worked on recently and your specific contribution?",
        "What is your target hourly rate (in USD)? This helps us match you with projects within your range.",
        "Thanks! Finally, please provide a link to your portfolio, GitHub, or LinkedIn profile for our review."
    ];

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking delay with variable timing
        const thinkingTime = Math.random() * 1000 + 1000;

        setTimeout(() => {
            if (step < questions.length) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'ai',
                    content: questions[step]
                };
                setMessages(prev => [...prev, aiMessage]);
                setStep(prev => prev + 1);
            } else {
                const completionMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: 'ai',
                    content: "Processing complete! I've analyzed your responses and they align perfectly with our network standards. Our talent success team will finalize your review within 48 hours. Redirecting you to your new dashboard now..."
                };
                setMessages(prev => [...prev, completionMessage]);

                setTimeout(() => {
                    toast.success("AI Screening Complete! Welcome to the network.");
                    router.push(createPageUrl('Dashboard'));
                }, 4000);
            }
            setIsTyping(false);
        }, thinkingTime);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00cc83] to-[#00b372] rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="font-black text-[#1a1a2e] block text-lg tracking-tight">TalentAI Screening</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Active Session</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <Sparkles className="w-4 h-4 text-[#204ecf]" />
                        <span className="text-sm font-bold text-gray-600">AI Integrity Verified</span>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-10 overflow-y-auto custom-scrollbar">
                <div className="space-y-8 pb-32">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`flex gap-5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${msg.sender === 'ai'
                                    ? 'bg-gradient-to-br from-[#00cc83] to-[#00b372]'
                                    : 'bg-gradient-to-br from-[#204ecf] to-[#1a3da8]'
                                    }`}>
                                    {msg.sender === 'ai' ? <Bot className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
                                </div>
                                <div className={`max-w-[75%] p-6 rounded-3xl shadow-xl shadow-gray-200/50 ${msg.sender === 'ai'
                                    ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100 flex flex-col gap-2'
                                    : 'bg-[#204ecf] text-white rounded-tr-none font-medium'
                                    }`}>
                                    <p className="leading-relaxed text-lg">{msg.content}</p>
                                    {msg.sender === 'ai' && idx === 0 && (
                                        <div className="mt-2 pt-4 border-t border-gray-50 text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle className="w-3 h-3 text-green-500" /> Secure Encryption Active
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex gap-5"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00cc83] to-[#00b372] flex items-center justify-center flex-shrink-0 shadow-md">
                                <Bot className="w-7 h-7 text-white" />
                            </div>
                            <div className="bg-white p-6 rounded-3xl rounded-tl-none shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-[#00cc83] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2.5 h-2.5 bg-[#00cc83] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2.5 h-2.5 bg-[#00cc83] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 p-8 fixed bottom-0 left-0 w-full z-10">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="flex gap-6 relative">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your response here..."
                            className="flex-1 h-16 text-xl px-8 rounded-2xl border-2 border-gray-100 focus:border-[#204ecf] transition-all bg-gray-50/50 focus:bg-white pr-20"
                            autoFocus
                            disabled={isTyping}
                        />
                        <Button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className={`absolute right-2 top-2 h-12 w-12 rounded-xl transition-all duration-300 ${!inputValue.trim() || isTyping ? 'bg-gray-100 text-gray-400' : 'bg-[#204ecf] hover:bg-[#1a3da8] text-white shadow-lg'}`}
                        >
                            <Send className="w-6 h-6" />
                        </Button>
                    </form>
                    <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Encrypted</span>
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Proprietary AI</span>
                        <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Real-time Match</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
