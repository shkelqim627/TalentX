'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Loader2, Info, CheckCircle, Mail, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter, usePathname } from 'next/navigation';

interface Notification {
    id: string;
    type: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    data?: string;
}

interface NotificationCenterProps {
    userId?: string;
}

// Simple timeAgo helper to replace date-fns
function timeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const ms = now.getTime() - past.getTime();
    const seconds = Math.round(ms / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return past.toLocaleDateString();
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();

    const handleNotificationClick = async (notif: Notification) => {
        // Mark as read immediately for UX
        if (!notif.isRead) {
            markReadMutation.mutate(notif.id);
        }

        setIsOpen(false);

        // Parse data for navigation
        let projectId: string | null = null;
        let view: string | null = null;

        if (notif.data) {
            try {
                const data = JSON.parse(notif.data);
                projectId = data.projectId;
                // Some notifications might have different naming
                if (!projectId && data.applicationId) projectId = data.applicationId;
            } catch (e) {
                console.error("Failed to parse notification data", e);
            }
        }

        // Determine destination based on type and context
        const isAdmin = pathname.includes('/admin');
        const basePath = isAdmin ? '/admin/dashboard' : '/dashboard';

        if (notif.type === 'support_ticket' || notif.type === 'message') {
            router.push(`${basePath}?view=messages`);
        } else if (projectId) {
            router.push(`${basePath}?project=${projectId}`);
        } else if (notif.type === 'application_accepted' || notif.type === 'application_status_update') {
            router.push(`${basePath}?view=overview`);
        }
    };

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            const url = userId
                ? `http://localhost:5000/api/applications/notifications?userId=${userId}`
                : `http://localhost:5000/api/applications/notifications`;

            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('talentx_token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch notifications');
            return res.json() as Promise<Notification[]>;
        },
        refetchInterval: 30000 // Poll every 30s
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    const markReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:5000/api/applications/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('talentx_token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to mark as read');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        }
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'hired':
            case 'application_accepted':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'support_ticket':
                return <Mail className="w-4 h-4 text-blue-500" />;
            case 'application_received':
                return <Info className="w-4 h-4 text-purple-500" />;
            default:
                return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-[380px] bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[100] animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] py-0 px-1.5">
                                    {unreadCount} New
                                </Badge>
                            )}
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#204ecf]" />
                                <p className="text-xs font-medium">Fetching updates...</p>
                            </div>
                        ) : notifications && notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`group flex items-start gap-4 p-4 transition-colors hover:bg-gray-50/80 cursor-pointer ${!notif.isRead ? 'bg-blue-50/20' : ''}`}
                                        onClick={() => handleNotificationClick(notif)}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            <div className={`p-2 rounded-lg ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                                                {getIcon(notif.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <p className={`text-sm leading-snug break-words ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                {notif.content}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {timeAgo(notif.createdAt)}
                                            </p>
                                        </div>
                                        {!notif.isRead && (
                                            <button
                                                className="h-7 w-7 flex items-center justify-center rounded-full text-gray-300 hover:text-green-600 hover:bg-green-50 transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markReadMutation.mutate(notif.id);
                                                }}
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-6 h-6 opacity-20" />
                                </div>
                                <p className="text-sm font-bold text-gray-900">All caught up!</p>
                                <p className="text-xs font-medium">No new notifications at the moment.</p>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
                        <button className="text-xs font-bold text-[#204ecf] hover:underline transition-all">
                            View All Activity
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
