'use client';

import { ProfileSettings } from '@/features/settings/ui/ProfileSettings';

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your profile and account preferences.</p>
            </div>

            <ProfileSettings />
        </div>
    );
}
