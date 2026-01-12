'use client';

import { ProjectList } from '@/features/projects/ui/ProjectList';
import { Button } from '@/shared/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                    <p className="text-gray-500 mt-1">Manage your active contracts and deliverables.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                </Button>
            </div>

            <ProjectList />
        </div>
    );
}
