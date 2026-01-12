'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/shared/lib/hooks/useWebSocket';
import { talentXApi, API_URL } from '@/shared/api/talentXApi';
import { Button } from "@/shared/components/ui/button";
import { MessageSquare, Users, Clock } from 'lucide-react';
import { User } from '@/shared/types';
import { toast } from 'sonner';

interface MessagesViewProps {
    user: User;
    initialShowSupport?: boolean;
}

export const MessagesView = ({ user, initialShowSupport = false }: MessagesViewProps) => {
    const queryClient = useQueryClient();
    const [showSupport, setShowSupport] = useState(initialShowSupport);
    const [selectedThreadUser, setSelectedThreadUser] = useState<string | null>(null);

    // WebSocket Integration
    const wsUrl = talentXApi.entities.Message ?
        API_URL.replace('http', 'ws').replace('/api', '') :
        'ws://localhost:8000';

    const { isConnected, lastMessage, sendMessage: sendWSMessage } = useWebSocket(wsUrl);

    const { data: currentMessages, isLoading: messagesLoading } = useQuery({
        queryKey: ['messages', showSupport, selectedThreadUser],
        queryFn: async () => talentXApi.entities.Message.list({
            isSupport: showSupport,
            userId: (showSupport && user?.role === 'admin') ? selectedThreadUser : undefined
        })
    });

    // Handle incoming messages via WebSocket
    useEffect(() => {
        if (lastMessage?.type === 'new_message') {
            const newMsg = lastMessage.message;
            const isRelevant = showSupport
                ? (newMsg.isSupport && (user.role === 'admin' ? newMsg.senderId === selectedThreadUser || newMsg.receiverId === selectedThreadUser : true))
                : (!newMsg.isSupport);

            if (isRelevant) {
                // Instantly update the list in cache
                queryClient.setQueryData(['messages', showSupport, selectedThreadUser], (old: any) => {
                    if (!old) return [newMsg];
                    // Avoid duplicates
                    if (old.find((m: any) => m.id === newMsg.id)) return old;
                    return [...old, newMsg];
                });
            }
            // Always invalidate unread-counts
            queryClient.invalidateQueries({ queryKey: ['unread-counts'] });

            // If admin, update threads list
            if (user.role === 'admin' && showSupport) {
                queryClient.invalidateQueries({ queryKey: ['support-threads'] });
            }
        }
    }, [lastMessage, showSupport, selectedThreadUser, queryClient, user.role]);

    const { data: unreadCounts } = useQuery({
        queryKey: ['unread-counts'],
        queryFn: async () => talentXApi.entities.Message.getUnreadCount(),
        // refetchInterval removed as we use WS now
    });

    const markReadMutation = useMutation({
        mutationFn: async (params: { isSupport: boolean; threadUserId?: string }) =>
            talentXApi.entities.Message.markRead(params),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['unread-counts'] })
    });

    // Mark as read when viewing messages
    React.useEffect(() => {
        if (!messagesLoading && currentMessages && currentMessages.length > 0) {
            markReadMutation.mutate({
                isSupport: showSupport,
                threadUserId: (showSupport && user?.role === 'admin') ? selectedThreadUser || undefined : undefined
            });
        }
    }, [showSupport, selectedThreadUser, currentMessages?.length, messagesLoading]);

    const { data: supportThreads } = useQuery({
        queryKey: ['support-threads'],
        queryFn: async () => talentXApi.entities.Message.list({ isSupport: true, type: 'threads' }),
        enabled: showSupport && user?.role === 'admin'
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (data: any) => {
            // Priority: WebSocket
            if (isConnected) {
                const sent = sendWSMessage({
                    type: 'message',
                    ...data
                });
                if (sent) return { status: 'ws_sent' };
            }
            // Fallback: REST
            return talentXApi.entities.Message.create(data);
        },
        onSuccess: (res: any) => {
            if (res?.status !== 'ws_sent') {
                // If it was REST, we need to invalidate
                queryClient.invalidateQueries({ queryKey: ['messages'] });
                queryClient.invalidateQueries({ queryKey: ['support-threads'] });
            }
        },
        onError: () => toast.error('Failed to send message')
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[600px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <MessageSquare className="w-5 h-5 text-[#204ecf]" />
                        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-[#1a1a2e]">Messages</h2>
                        <span className="text-[10px] text-gray-400 block -mt-1">{isConnected ? 'Real-time active' : 'Connecting...'}</span>
                    </div>
                </div>
                <div className="bg-gray-200/50 p-1 rounded-xl flex items-center gap-1">
                    <button
                        onClick={() => setShowSupport(false)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${!showSupport
                            ? 'bg-white text-[#204ecf] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        General
                        {unreadCounts?.general ? (
                            <span className="bg-[#204ecf] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCounts.general}</span>
                        ) : null}
                    </button>
                    <button
                        onClick={() => { setShowSupport(true); setSelectedThreadUser(null); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${showSupport
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Support
                        {unreadCounts?.support ? (
                            <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCounts.support}</span>
                        ) : null}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Admin Sidebar for Support Threads */}
                {showSupport && user?.role === 'admin' && (
                    <div className="w-64 border-r border-gray-100 overflow-y-auto bg-gray-50/30">
                        <div className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Requests</div>
                        <div className="space-y-1 p-2">
                            {supportThreads?.map((thread: any) => (
                                <button
                                    key={thread.userId}
                                    onClick={() => setSelectedThreadUser(thread.userId)}
                                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${selectedThreadUser === thread.userId
                                        ? 'bg-white border border-gray-200 shadow-sm text-[#204ecf]'
                                        : 'hover:bg-white/50 text-gray-600'
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={thread.userAvatar || `https://ui-avatars.com/api/?name=${thread.userName}`}
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                            alt=""
                                        />
                                        {/* Thread-specific unread indicator could go here if implemented on backend */}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-xs font-bold truncate">{thread.userName}</div>
                                        <div className="text-[10px] text-gray-400 truncate">{thread.lastMessage}</div>
                                    </div>
                                </button>
                            ))}
                            {(!supportThreads || supportThreads.length === 0) && (
                                <div className="text-center py-8 px-4">
                                    <p className="text-[10px] text-gray-400 italic">No active support requests</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {showSupport && user?.role === 'admin' && !selectedThreadUser ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <Users className="w-12 h-12 text-gray-200 mb-4" />
                                <h3 className="font-bold text-gray-700">Select a support ticket</h3>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto mt-2">Pick a client from the list to start assisting them.</p>
                            </div>
                        ) : messagesLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading interaction...</div>
                        ) : currentMessages?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50">
                                <MessageSquare className="w-12 h-12 text-gray-200" />
                                <p className="text-sm text-gray-400">
                                    {showSupport ? 'No support history found.' : 'Safe and private communication.'}
                                </p>
                            </div>
                        ) : (
                            currentMessages?.map((msg: any) => (
                                <div key={msg.id} className={`flex gap-4 ${msg.senderId === user?.id ? 'flex-row-reverse' : ''}`}>
                                    <div className="flex-shrink-0">
                                        <img
                                            src={msg.sender_avatar || `https://ui-avatars.com/api/?name=${msg.sender_name}`}
                                            className="w-10 h-10 rounded-full border border-gray-100 shadow-sm"
                                            alt={msg.sender_name}
                                        />
                                    </div>
                                    <div className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                        <div className="flex items-center gap-2 mb-1 px-1">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{msg.sender_name}</span>
                                            <span className="text-[10px] text-gray-300">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.senderId === user?.id
                                            ? 'bg-[#204ecf] text-white rounded-tr-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    {(showSupport && user?.role === 'admin' && !selectedThreadUser) ? null : (
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const input = (e.target as any).message;
                                    if (input.value.trim()) {
                                        sendMessageMutation.mutate({
                                            content: input.value,
                                            isSupport: showSupport,
                                            receiver_id: showSupport
                                                ? (user?.role === 'admin' ? selectedThreadUser! : 'support-system-user-id-001')
                                                : (user?.role === 'admin' ? 'all' : 'admin')
                                        });
                                        input.value = '';
                                    }
                                }}
                                className="flex gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#204ecf]/20 transition-all"
                            >
                                <input
                                    name="message"
                                    type="text"
                                    placeholder={showSupport ? "Type support response..." : "Write your message..."}
                                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                                />
                                <Button type="submit" className="bg-[#204ecf] hover:bg-[#1a3da8] text-white px-6 rounded-xl font-bold text-xs uppercase tracking-widest">
                                    Send
                                </Button>
                            </form>
                            {showSupport && (
                                <p className="text-[10px] text-gray-400 mt-2 text-center flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Support tickets are handled by our concierge team. Messages vanish safely after 48 hours.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
