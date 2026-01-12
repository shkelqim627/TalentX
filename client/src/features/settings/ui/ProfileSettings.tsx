'use client';

import { useEffect, useState } from 'react';
import { useProfile, useUpdateProfile } from '../model/useProfile';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { User, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/auth.store';

export const ProfileSettings = () => {
    const { user } = useAuthStore();
    const { data: profile, isLoading } = useProfile();
    const updateProfile = useUpdateProfile();

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        hourly_rate: '',
        bio: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                title: profile.title || '',
                location: profile.location || '',
                hourly_rate: profile.hourly_rate?.toString() || '',
                bio: profile.bio || ''
            });
        }
    }, [profile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.id) return;

        updateProfile.mutate({
            id: profile.id,
            data: {
                title: formData.title,
                location: formData.location,
                hourly_rate: parseFloat(formData.hourly_rate),
                bio: formData.bio
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

    // If role is client or admin, or no profile found (yet)
    if (!profile && user?.role !== 'talent' && user?.role !== 'agency') {
        return (
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h2>
                <p className="text-gray-500">Profile editing is currently only available for Talents and Agencies.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {user?.full_name?.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Senior React Developer"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. New York, USA"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="number"
                                value={formData.hourly_rate}
                                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                                placeholder="0.00"
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                        className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell us about your experience..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
