'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { useSocketStore } from '@/features/messaging/model/socket.store';
import { API_URL } from '@/shared/api/client';

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, token } = useAuthStore();
    const { connect, disconnect } = useSocketStore();

    useEffect(() => {
        if (isAuthenticated && token) {
            // Convert HTTP URL to WS URL
            // e.g., http://localhost:8000/api -> ws://localhost:8000
            const wsUrl = API_URL.replace('http', 'ws').replace('/api', '');
            connect(wsUrl, token);
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [isAuthenticated, token, connect, disconnect]);

    return <>{children}</>;
}
