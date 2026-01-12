import { Project } from '@/entities/project/model/types';
import { Button } from '@/shared/components/ui/button';
import { Calendar, DollarSign, Users, ChevronRight, MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-600 transition-colors shadow-sm hover:shadow-md flex flex-col h-full group">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}>
                            {project.status?.replace('_', ' ')}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    {project.description || 'No description provided.'}
                </p>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500 font-medium">Progress</span>
                            <span className="text-gray-900 font-bold">{project.progress || 0}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                    ${project.budget_spent?.toLocaleString()} / ${project.total_budget?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-50 bg-gray-50 rounded-b-xl flex items-center justify-between">
                {project.assigned_to ? (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {project.assigned_to.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-none mb-0.5">
                                {project.assigned_to.type}
                            </span>
                            <span className="text-xs font-bold text-gray-900 line-clamp-1">
                                {project.assigned_to.name}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-medium italic">Unassigned</span>
                    </div>
                )}

                <Link href={`/projects/${project.id}`} className="flex items-center gap-1 text-blue-600 font-bold text-xs hover:underline">
                    View Details <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};
