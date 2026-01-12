'use client';

import { ChatWindow } from '@/features/messaging/ui/ChatWindow';

export default function MessagesPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500 mt-1">Chat with your team or TalentX support.</p>
            </div>

            <ChatWindow />
        </div>
    );
}
