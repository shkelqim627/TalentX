'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, Sparkles, Phone, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { talentXApi } from '@/shared/api/talentXApi';
import { Talent, Team, Agency } from '@/shared/types';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';

type Entity = Talent | Team | Agency;

interface Message {
    id: string;
    sender: 'ai' | 'user';
    content: string;
    matches?: Entity[];
}

interface AIMatchingModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'talent' | 'team' | 'agency';
}

export default function AIMatchingModal({ isOpen, onClose, mode = 'talent' }: AIMatchingModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
    const [callStatus, setCallStatus] = useState<'initiating' | 'connected' | 'ended'>('initiating');
    const [callDuration, setCallDuration] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            setMessages([
                {
                    id: '1',
                    sender: 'ai',
                    content: `Hello! I'm your AI Concierge. Tell me what kind of ${mode} you're looking for, and I'll find the perfect match.`
                }
            ]);
            scrollToBottom();
        }
    }, [isOpen, mode]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (callType && callStatus === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);

                // Simulate live suggestions in chat during call
                if (callDuration === 5) {
                    getMatches("developer").then(matches => {
                        const aiMessage: Message = {
                            id: Date.now().toString(),
                            sender: 'ai',
                            content: "I've found a great developer for you based on our conversation so far.",
                            matches: matches.slice(0, 1)
                        };
                        setMessages(prev => [...prev, aiMessage]);
                    });
                }
                if (callDuration === 12) {
                    getMatches("designer").then(matches => {
                        const aiMessage: Message = {
                            id: Date.now().toString(),
                            sender: 'ai',
                            content: "I also found a designer who might be a good fit for the UI/UX part.",
                            matches: matches.slice(0, 1)
                        };
                        setMessages(prev => [...prev, aiMessage]);
                    });
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callType, callStatus, callDuration]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startCall = (type: 'audio' | 'video') => {
        setCallType(type);
        setCallStatus('initiating');
        setTimeout(() => {
            setCallStatus('connected');
        }, 2000);
    };

    const getMatches = async (query: string): Promise<Entity[]> => {
        let entities: any[] = [];
        if (mode === 'talent') {
            entities = await talentXApi.entities.Talent.list();
        } else if (mode === 'team') {
            entities = await talentXApi.entities.Team.list();
        } else if (mode === 'agency') {
            entities = await talentXApi.entities.Agency.list();
        }

        return entities.filter((e: any) => {
            const name = e.full_name || e.team_name || e.agency_name || '';
            const title = e.title || e.specialization || '';
            const skills = e.skills || e.services || [];

            return name.toLowerCase().includes(query.toLowerCase()) ||
                title.toLowerCase().includes(query.toLowerCase()) ||
                (Array.isArray(skills) && skills.some((s: string) => query.toLowerCase().includes(s.toLowerCase())));
        });
    };

    const endCall = () => {
        setCallType(null);
        setCallStatus('ended');
        setCallDuration(0);

        // Add system message about call
        const callMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content: `[Completed ${callType === 'audio' ? 'Audio' : 'Video'} Call]`
        };
        setMessages(prev => [...prev, callMessage]);
        setIsTyping(true);

        // Simulate AI processing after call
        setTimeout(async () => {
            const matches = await getMatches("developer"); // Mock context from call
            const displayMatches = matches.slice(0, 2);

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                content: "Thanks for explaining your requirements over the call. Based on our conversation, I've found these candidates that seem like a great fit:",
                matches: displayMatches
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 2000);
    };

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

        // Simulate AI processing
        setTimeout(async () => {
            const matches = await getMatches(userMessage.content);

            let aiResponseContent = "";
            if (matches.length > 0) {
                aiResponseContent = `I found ${matches.length} ${mode}(s) that match your requirements. Here are the top matches:`;
            } else {
                aiResponseContent = "I couldn't find an exact match right now, but I can help you broaden your search. Could you specify more details?";
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                content: aiResponseContent,
                matches: matches.length > 0 ? matches.slice(0, 2) : undefined
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const getEntityName = (entity: any) => entity.full_name || entity.team_name || entity.agency_name;
    const getEntityTitle = (entity: any) => entity.title || entity.specialization || (entity.services ? entity.services[0] : '');
    const getEntityImage = (entity: any) => entity.image_url;
    const getEntityRate = (entity: any) => entity.hourly_rate || entity.hourly_rate_range;
    const getEntityProfileLink = (entity: any) => {
        if (mode === 'talent') return createPageUrl(`TalentProfile?id=${entity.id}`);
        if (mode === 'team') return createPageUrl(`TeamProfile?id=${entity.id}`);
        if (mode === 'agency') return createPageUrl(`AgencyProfile?id=${entity.id}`);
        return '#';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-[#1a1a2e] p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#00c853]" />
                        <span className="font-bold">AI Matching Concierge ({mode})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                            onClick={() => startCall('audio')}
                            title="Start Audio Call"
                            disabled={!!callType}
                        >
                            <Phone className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                            onClick={() => startCall('video')}
                            title="Start Video Call"
                            disabled={!!callType}
                        >
                            <Video className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Call Section (Visible only during call) */}
                    <AnimatePresence>
                        {callType && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: '50%', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="bg-[#1a1a2e] flex flex-col items-center justify-center text-white border-r border-white/10 overflow-hidden"
                            >
                                <div className="flex flex-col items-center gap-6 p-8 w-full">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-[#204ecf] flex items-center justify-center animate-pulse">
                                            <Bot className="w-12 h-12 text-white" />
                                        </div>
                                        {callStatus === 'connected' && (
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#00c853] px-3 py-1 rounded-full text-[10px] font-bold">
                                                {formatDuration(callDuration)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-1">TalentX AI Concierge</h3>
                                        <p className="text-xs text-gray-400">
                                            {callStatus === 'initiating' ? 'Connecting...' : 'Listening to your requirements...'}
                                        </p>
                                    </div>

                                    {callStatus === 'connected' && (
                                        <div className="flex items-center gap-1.5 h-8">
                                            {[...Array(5)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-1 bg-[#00c853] rounded-full"
                                                    animate={{ height: [8, 24, 8] }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 1,
                                                        delay: i * 0.1
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 mt-4">
                                        <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-gray-600 hover:bg-gray-800 text-white">
                                            <Mic className="w-4 h-4" />
                                        </Button>
                                        {callType === 'video' && (
                                            <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-gray-600 hover:bg-gray-800 text-white">
                                                <VideoOff className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={endCall}
                                            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/20"
                                        >
                                            <Phone className="w-6 h-6 rotate-[135deg]" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Right: Chat Section (Always visible) */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'ai' ? 'bg-[#00c853]' : 'bg-[#204ecf]'
                                                }`}>
                                                {msg.sender === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                            </div>
                                            <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'ai'
                                                ? 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm'
                                                : 'bg-[#204ecf] text-white rounded-tr-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>

                                        {/* Render Matches if any */}
                                        {msg.matches && (
                                            <div className="ml-11 grid gap-3 w-full max-w-[85%]">
                                                {msg.matches.map((entity: any) => (
                                                    <div key={entity.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex gap-3 items-center hover:border-[#204ecf] transition-colors cursor-pointer group">
                                                        <img src={getEntityImage(entity)} className="w-12 h-12 rounded-full object-cover" alt={getEntityName(entity)} />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-[#1a1a2e] text-sm truncate">{getEntityName(entity)}</h4>
                                                            <p className="text-xs text-gray-500 truncate">{getEntityTitle(entity)}</p>
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <span className="text-xs font-bold text-[#00c853]">${getEntityRate(entity)}/hr</span>
                                                            </div>
                                                        </div>
                                                        <Link href={getEntityProfileLink(entity)}>
                                                            <Button size="sm" variant="outline" className="text-xs h-8 group-hover:bg-[#204ecf] group-hover:text-white transition-colors">View</Button>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#00c853] flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex gap-3">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={`Describe your ideal ${mode}...`}
                                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    autoFocus
                                />
                                <Button type="submit" disabled={!inputValue.trim() || isTyping} className="bg-[#204ecf] hover:bg-[#1a3da8] shadow-lg shadow-blue-200">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
