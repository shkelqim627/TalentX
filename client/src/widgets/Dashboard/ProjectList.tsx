import React from 'react';
import { Project, User } from '@/shared/types';
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Calendar, DollarSign, Users, ChevronRight, MoreVertical, Briefcase, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectListProps {
    projects: Project[];
    onSelectProject: (projectId: string) => void;
    onEdit?: (project: Project) => void;
    onDelete?: (projectId: string) => void;
}

export default function ProjectList({ projects, onSelectProject, onEdit, onDelete }: ProjectListProps) {
    if (projects.length === 0) {
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
            {projects.map((project: Project, index: number) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card
                        className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-gray-200 hover:border-[#204ecf]"
                        onClick={() => onSelectProject(project.id)}
                    >
                        <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between space-y-0">
                            <div>
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {project.status.replace('_', ' ')}
                                </div>
                                <h3 className="font-bold text-lg text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors">
                                    {project.name}
                                </h3>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 -mr-2 -mt-2">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(project); }}>
                                        <Edit className="w-4 h-4 mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDelete?.(project.id); }}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">
                                {project.description || 'No description provided.'}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500 font-medium">Progress</span>
                                        <span className="text-[#1a1a2e] font-bold">{project.progress || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#00c853] rounded-full transition-all duration-500"
                                            style={{ width: `${project.progress || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Deadline</span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {project.next_milestone ? new Date(project.next_milestone).toLocaleDateString() : 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Budget</span>
                                            <span className="text-xs font-medium text-gray-700">
                                                ${project.budget_spent?.toLocaleString() || 0} / ${project.total_budget?.toLocaleString() || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between mt-auto">
                            {project.assigned_to ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <img
                                            src={project.assigned_to.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.assigned_to.name)}&background=random`}
                                            alt={project.assigned_to.name}
                                            className="w-8 h-8 rounded-full border border-gray-100 object-cover"
                                        />
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${project.assigned_to.type === 'agency' ? 'bg-purple-500' :
                                            project.assigned_to.type === 'team' ? 'bg-blue-500' :
                                                'bg-[#00c853]'
                                            }`} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-none mb-0.5">
                                            {project.assigned_to.type}
                                        </span>
                                        <span className="text-xs font-bold text-[#1a1a2e] limit-1-line">
                                            {project.assigned_to.name}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
                                        <Users className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <span className="text-xs font-medium italic">Unassigned</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 text-[#204ecf] font-bold text-xs group-hover:translate-x-1 transition-transform">
                                View Details <ChevronRight className="w-4 h-4" />
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

