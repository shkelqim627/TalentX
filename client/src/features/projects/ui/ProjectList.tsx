'use client';

import { useProjects } from "../model/useProjects";
import { ProjectCard } from "./ProjectCard";
import { Briefcase } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export const ProjectList = () => {
    const { data: projects, isLoading, error } = useProjects();

    if (isLoading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg">
                <p>Failed to load projects. Please try again later.</p>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">Start your first project by hiring talent or a team.</p>
                <Button className="bg-[#204ecf] hover:bg-[#1a3da8] text-white">Create Project</Button>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};
