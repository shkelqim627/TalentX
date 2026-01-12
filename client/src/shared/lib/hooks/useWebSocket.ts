import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

export const useWebSocket = (url: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        // Don't connect if already connecting or open
        if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        console.log('Connecting to WebSocket:', url);
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);

            const token = localStorage.getItem('talentx_token');
            if (token) {
                socket.send(JSON.stringify({ type: 'auth', token }));
            }
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLastMessage(data);
            } catch (err) {
                console.error('Failed to parse WS message:', err);
            }
        };

        socket.onclose = (event) => {
            console.log('WebSocket Disconnected:', event.code, event.reason);
            setIsConnected(false);
            ws.current = null;

            // Reconnect logic: avoid immediate loop
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = setTimeout(() => {
                console.log('Attempting WS reconnect...');
                connect();
            }, 5000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            // socket.close() will be called automatically or manually
        };

        ws.current = socket;
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
            if (ws.current) {
                const socket = ws.current;
                ws.current = null; // Prevent onclose reconnect
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            }
        };
    }, [connect]);

    const sendMessage = useCallback((data: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
            return true;
        }
        return false;
    }, []);

    return { isConnected, lastMessage, sendMessage };
};
