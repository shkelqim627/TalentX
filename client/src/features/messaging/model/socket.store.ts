import { create } from 'zustand';
import { SocketState, Message } from './types';
import { toast } from 'sonner';

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    messages: [],

    connect: (url: string, token: string) => {
        const { socket } = get();
        // Prevent multiple connections
        if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) {
            return;
        }

        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WS Connected');
            // Authenticate immediately
            ws.send(JSON.stringify({ type: 'auth', token }));
            set({ isConnected: true });
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'authenticated') {
                    console.log('WS Authenticated');
                } else if (data.type === 'new_message') {
                    get().addMessage(data.message);
                    toast.info(`New message from ${data.message.senderRole}`);
                } else if (data.type === 'error') {
                    console.error('WS Error:', data.message);
                    toast.error(data.message);
                }
            } catch (err) {
                console.error('WS Parse Error', err);
            }
        };

        ws.onclose = () => {
            console.log('WS Disconnected');
            set({ isConnected: false, socket: null });
            // Reconnect logic could go here, but kept simple for now
        };

        ws.onerror = (err) => {
            console.error('WS Error', err);
        };

        set({ socket: ws });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
        }
        set({ socket: null, isConnected: false, messages: [] });
    },

    sendMessage: (receiverId: string, content: string, isSupport = false) => {
        const { socket } = get();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                receiver_id: receiverId,
                content,
                isSupport
            }));
        } else {
            toast.error('Connection lost. Please refresh.');
        }
    },

    addMessage: (message: Message) => {
        set((state) => ({ messages: [...state.messages, message] }));
    }
}));
