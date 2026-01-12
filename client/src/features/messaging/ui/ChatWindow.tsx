'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocketStore } from '../model/socket.store';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Send, User } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const ChatWindow = () => {
    const { messages, sendMessage, isConnected } = useSocketStore();
    const { user } = useAuthStore();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Hardcoded receiver for MVP (Support System)
        // In real app, this would be dynamic based on selected chat
        sendMessage('support-system-user-id-001', inputValue, true);
        setInputValue('');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">TalentX Support</h3>
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                            <span className="text-xs text-gray-500">{isConnected ? 'Online' : 'Disconnected'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-10">
                        No messages yet. Start a conversation!
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={index} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                                isMe
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm"
                            )}>
                                <p>{msg.content}</p>
                                <span className={cn("text-[10px] block mt-1 opacity-70", isMe ? "text-blue-100" : "text-gray-400")}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={!isConnected}
                    />
                    <Button type="submit" size="icon" disabled={!isConnected || !inputValue.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
};
