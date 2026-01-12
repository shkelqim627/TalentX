import React, { useState, useEffect } from 'react';
import { Project, Task, User } from '@/shared/types';
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, CheckCircle, Clock, AlertCircle, Circle, Plus, FileText, MessageSquare, MoreHorizontal, Upload, Image as ImageIcon, Monitor, Save, LayoutGrid, List, Users, Star, Briefcase, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { toast } from 'sonner';
import TaskModal from './TaskModal';
import TaskListView from './TaskListView';

interface ProjectDetailProps {
    user: User;
    project: Project;
    onBack: () => void;
}

export default function ProjectDetail({ user, project, onBack }: ProjectDetailProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'files' | 'srs' | 'design' | 'whiteboard'>('overview');
    const [srsContent, setSrsContent] = useState(project.srs_content || '');
    const [whiteboardUrl, setWhiteboardUrl] = useState(project.whiteboard_url || '');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
    const queryClient = useQueryClient();

    const isClientOrAdmin = user.role === 'client' || user.role === 'admin';
    const canManageTasks = user.role === 'client' || user.role === 'admin' || user.role === 'agency';

    // Combine team members with the assigned entity if applicable for task assignment
    const assignableMembers = [
        ...(project.team_members || []),
        ...(project.assigned_to ? [{
            id: project.assigned_to.userId || project.assigned_to.id,
            full_name: project.assigned_to.name,
            role: project.assigned_to.type,
            avatar_url: project.assigned_to.image_url
        }] : [])
    ].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i); // specific deduplication

    useEffect(() => {
        setSrsContent(project.srs_content || '');
        setWhiteboardUrl(project.whiteboard_url || '');
    }, [project]);

    // Tasks Query
    const { data: tasks, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks', project.id],
        queryFn: async () => talentXApi.entities.Task.filter({ project_id: project.id })
    });

    // Update Task (Status only - for Kanban drag/drop or quick actions)
    const updateTaskStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
            return await talentXApi.entities.Task.update(id, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            toast.success('Task updated');
        }
    });

    // Detailed Update Task Mutation
    const updateTaskMutation = useMutation({
        mutationFn: async (updatedTask: any) => {
            const { id, ...data } = updatedTask;
            const payload = {
                title: data.title,
                description: data.description,
                priority: data.priority,
                due_date: data.due_date,
                assignee_id: data.assigneeId || null,
            };
            return await talentXApi.entities.Task.update(id, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            setIsTaskModalOpen(false);
            setSelectedTask(null);
            toast.success('Task updated successfully');
        },
        onError: () => {
            toast.error('Failed to update task');
        }
    });

    // Update Project Mutation
    const updateProjectMutation = useMutation({
        mutationFn: async (data: Partial<Project>) => {
            return await talentXApi.entities.Project.update(project.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project updated');
        },
        onError: () => {
            toast.error('Failed to update project');
        }
    });

    // Create Task Mutation
    const createTaskMutation = useMutation({
        mutationFn: async (newTask: any) => {
            return await talentXApi.entities.Task.create({
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                due_date: newTask.due_date,
                assignee_id: newTask.assigneeId || null,
                project_id: project.id
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            setIsTaskModalOpen(false);
            toast.success('Task created successfully');
        },
        onError: () => {
            toast.error('Failed to create task');
        }
    });

    // Delete Task Mutation
    const deleteTaskMutation = useMutation({
        mutationFn: async (id: string) => {
            return await talentXApi.entities.Task.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', project.id] });
            setIsTaskModalOpen(false);
            setSelectedTask(null);
            toast.success('Task deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete task');
        }
    });

    const handleSaveSrs = () => {
        updateProjectMutation.mutate({ srs_content: srsContent });
    };

    const handleSaveWhiteboard = () => {
        updateProjectMutation.mutate({ whiteboard_url: whiteboardUrl });
    };

    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    const handleTaskSave = (data: any) => {
        if (selectedTask) {
            updateTaskMutation.mutate({ ...data, id: selectedTask.id });
        } else {
            createTaskMutation.mutate(data as any);
        }
    };

    const completeProjectMutation = useMutation({
        mutationFn: async ({ rating, review }: { rating: number; review: string }) => {
            return await talentXApi.entities.Project.complete(project.id, { rating, review });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            setIsCompletionModalOpen(false);
            toast.success('Project marked as completed!');
        },
        onError: () => {
            toast.error('Failed to complete project');
        }
    });

    const releasePaymentMutation = useMutation({
        mutationFn: async () => {
            return await talentXApi.entities.Project.releasePayment(project.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Payment released successfully!');
        },
        onError: () => {
            toast.error('Failed to release payment');
        }
    });

    const handleCompleteProject = () => {
        if (!review || review.length < 10) {
            toast.error('Please provide a review (at least 10 characters)');
            return;
        }
        completeProjectMutation.mutate({ rating, review });
    };

    const handleReleasePayment = () => {
        if (confirm('Are you sure you want to release payment for this project?')) {
            releasePaymentMutation.mutate();
        }
    };



    const KanbanBoard = () => {
        const columns = [
            { id: 'todo', title: 'To Do', icon: Circle, color: 'text-gray-500' },
            { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-blue-500' },
            { id: 'review', title: 'Review', icon: AlertCircle, color: 'text-yellow-500' },
            { id: 'done', title: 'Done', icon: CheckCircle, color: 'text-green-500' }
        ];

        return (
            <div className="grid md:grid-cols-4 gap-6 overflow-x-auto pb-4">
                {columns.map((col) => (
                    <div key={col.id} className="min-w-[280px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <col.icon className={`w-5 h-5 ${col.color}`} />
                                <h3 className="font-bold text-gray-700">{col.title}</h3>
                                <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {tasks?.filter(t => t.status === col.id).length || 0}
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }}>
                                <Plus className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {tasks?.filter(t => t.status === col.id).map((task) => (
                                <motion.div
                                    key={task.id}
                                    layoutId={task.id}
                                    onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-[#1a1a2e] mb-2">{task.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.description}</p>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex -space-x-2">
                                            <img
                                                src={task.assignee?.avatar_url || `https://ui-avatars.com/api/?name=${task.assignee?.full_name || 'Unassigned'}&background=random`}
                                                className="w-6 h-6 rounded-full border-2 border-white"
                                                alt={task.assignee?.full_name || 'Unassigned'}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {col.id !== 'todo' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 text-[10px] px-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateTaskStatusMutation.mutate({ id: task.id, status: columns[columns.findIndex(c => c.id === col.id) - 1].id as any });
                                                }}
                                            >
                                                Prev
                                            </Button>
                                        )}
                                        {col.id !== 'done' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-6 text-[10px] px-2 ml-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateTaskStatusMutation.mutate({ id: task.id, status: columns[columns.findIndex(c => c.id === col.id) + 1].id as any });
                                                }}
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const OverviewTab = () => (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Project Progress</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#1a1a2e]">{project.progress || 0}%</span>
                        <span className="text-sm text-gray-400">completed</span>
                    </div>
                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                </div>

                {isClientOrAdmin && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Budget Usage</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#1a1a2e]">${project.budget_spent?.toLocaleString() || 0}</span>
                            <span className="text-sm text-gray-400">of ${project.total_budget?.toLocaleString() || 0}</span>
                        </div>
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((project.budget_spent || 0) / (project.total_budget || 1)) * 100}%` }} />
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Assigned To</span>
                    </div>
                    {project.assigned_to ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={project.assigned_to.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.assigned_to.name)}&background=random`}
                                    alt={project.assigned_to.name}
                                    className="w-10 h-10 rounded-xl border border-gray-100 object-cover"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#1a1a2e]">{project.assigned_to.name}</span>
                                    <span className="text-xs text-[#204ecf] font-bold uppercase">{project.assigned_to.type}</span>
                                </div>
                            </div>

                            {/* Team Members Avatars */}
                            {project.team_members && project.team_members.length > 0 && (
                                <div className="flex -space-x-2 pl-2">
                                    {project.team_members.slice(0, 5).map((member) => (
                                        <img
                                            key={member.id}
                                            src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=random`}
                                            alt={member.full_name}
                                            title={member.full_name}
                                            className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-gray-100"
                                        />
                                    ))}
                                    {project.team_members.length > 5 && (
                                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                            +{project.team_members.length - 5}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-gray-400 italic">No assigned entity</div>
                    )}
                </div>
            </div>

            {/* Client Review Section */}
            {project.status === 'completed' && project.clientReview && (
                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl border border-blue-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#204ecf] rounded-2xl shadow-lg shadow-blue-100">
                                <Star className="w-6 h-6 text-white fill-current" />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900">Client Feedback</h3>
                        </div>
                        <div className="flex gap-1 bg-white/50 p-1.5 rounded-full border border-blue-50">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`w-5 h-5 ${s <= (project.clientRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="text-5xl text-[#204ecf]/10 absolute -left-2 -top-4 font-serif">"</div>
                        <blockquote className="text-lg text-gray-700 leading-relaxed italic px-6 py-2">
                            {project.clientReview}
                        </blockquote>
                        <div className="text-5xl text-[#204ecf]/10 absolute -right-2 -bottom-4 font-serif">"</div>
                    </div>
                </div>
            )}

            {/* Recent Activity (Mock) */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-lg text-[#1a1a2e] mb-6">Recent Activity</h3>
                <div className="space-y-6">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-800">
                                    <span className="font-bold">Michael Torres</span> completed the task <span className="font-medium text-[#204ecf]">Homepage Design</span>
                                </p>
                                <span className="text-xs text-gray-400">2 hours ago</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const TeamTab = () => (
        <div className="space-y-8">
            {/* Primary Assignee */}
            {project.assigned_to && (
                <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-[#1a1a2e] flex items-center gap-2">
                            Primary Engagement: <span className="text-[#204ecf] capitalize">{project.assigned_to.type}</span>
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('overview')}>
                            Engagement Terms
                        </Button>
                    </div>
                    <div className="flex items-center gap-6">
                        <img
                            src={project.assigned_to.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.assigned_to.name)}&background=random`}
                            alt={project.assigned_to.name}
                            className="w-20 h-20 rounded-2xl shadow-md border-4 border-white object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="text-xl font-bold text-[#1a1a2e]">{project.assigned_to.name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 5.0 Rating
                                </span>
                                <span className="flex items-center gap-1 capitalize">
                                    <Briefcase className="w-4 h-4 text-gray-400" /> {project.assigned_to.type} Partner
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-[#204ecf] hover:bg-[#1a3da8] text-white rounded-xl">
                                <MessageSquare className="w-4 h-4 mr-2" /> Message
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {project.team_members?.map((member) => (
                    <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <img
                            src={member.avatar_url || `https://ui-avatars.com/api/?name=${member.full_name}`}
                            alt={member.full_name}
                            className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[#1a1a2e]">{member.full_name}</h3>
                                {member.rateAmount && (
                                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold">
                                        ${member.rateAmount}/{member.rateType === 'hourly' ? 'hr' : 'mo'}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                            {isClientOrAdmin && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden sm:flex gap-1 items-center hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                                    onClick={async () => {
                                        try {
                                            await talentXApi.entities.Project.recordPayment({
                                                projectId: project.id,
                                                talentId: member.id,
                                                amount: member.rateType === 'monthly' ? (member.rateAmount || 0) : (member.rateAmount || 0) * 160
                                            });
                                            toast.success(`Payment notification sent for ${member.full_name}`);
                                        } catch (error) {
                                            toast.error('Failed to send payment notification');
                                        }
                                    }}
                                >
                                    <DollarSign className="w-3 h-3" /> Pay
                                </Button>
                            )}
                            <Button variant="outline" size="icon">
                                <MessageSquare className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const FilesTab = () => (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {[1, 2, 3].map((_, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">Project_Specs_v{i + 1}.pdf</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.4 MB</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Michael Torres</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const SRSTab = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-[#1a1a2e]">Software Requirements Specification (SRS)</h3>
                    {isClientOrAdmin && (
                        <Button
                            onClick={handleSaveSrs}
                            disabled={updateProjectMutation.isPending}
                            className="bg-[#204ecf] hover:bg-[#1a3da8] text-white"
                        >
                            <Save className="w-4 h-4 mr-2" /> Save SRS
                        </Button>
                    )}
                </div>
                <textarea
                    rows={15}
                    value={srsContent}
                    onChange={(e) => setSrsContent(e.target.value)}
                    disabled={!isClientOrAdmin}
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] focus:border-transparent outline-none transition-all resize-none font-mono text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Write your project requirements here..."
                />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg text-[#1a1a2e] mb-4">Upload SRS File</h3>
                {isClientOrAdmin ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-[#204ecf] transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop SRS document (PDF, DOCX)</p>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-2xl border border-gray-100">
                        Read-only access to SRS
                    </div>
                )}
            </div>
        </div>
    );

    const DesignTab = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg text-[#1a1a2e] mb-4">System Design Diagram</h3>
                {project.design_diagram_url ? (
                    <div className="relative group">
                        <img src={project.design_diagram_url} alt="Design Diagram" className="w-full rounded-xl border border-gray-100" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                            <Button variant="secondary">Change Diagram</Button>
                        </div>
                    </div>
                ) : (
                    isClientOrAdmin ? (
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-[#204ecf] transition-colors cursor-pointer">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm text-gray-500 font-medium">Upload System Design Diagram</p>
                            <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, SVG</p>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-400 italic bg-gray-50 rounded-2xl border border-gray-100">
                            No diagram uploaded
                        </div>
                    )
                )}
            </div>
        </div>
    );

    const WhiteboardTab = () => (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-[#1a1a2e]">Interactive Whiteboard</h3>
                    {isClientOrAdmin && (
                        <Button
                            onClick={handleSaveWhiteboard}
                            disabled={updateProjectMutation.isPending}
                            className="bg-[#204ecf] hover:bg-[#1a3da8] text-white"
                        >
                            <Save className="w-4 h-4 mr-2" /> Save Link
                        </Button>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Whiteboard URL (e.g. Miro, Excalidraw)</label>
                    <input
                        type="url"
                        value={whiteboardUrl}
                        onChange={(e) => setWhiteboardUrl(e.target.value)}
                        disabled={!isClientOrAdmin}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="https://miro.com/app/board/..."
                    />
                </div>
                <div className="aspect-video bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-center p-8">
                    <Monitor className="w-16 h-16 text-gray-300 mb-4" />
                    <h4 className="text-xl font-bold text-gray-700 mb-2">Presentation Mode</h4>
                    <p className="text-gray-500 max-w-md mb-6">Use this space to present your ideas to the core team. You can link an external whiteboard or use our built-in tools.</p>
                    {whiteboardUrl ? (
                        <Button className="bg-[#204ecf] hover:bg-[#1a3da8] text-white px-8" onClick={() => window.open(whiteboardUrl, '_blank')}>
                            Launch Whiteboard
                        </Button>
                    ) : (
                        <Button variant="outline" disabled>No Whiteboard Linked</Button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e]">{project.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500' :
                                project.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                                }`} />
                            <span className="capitalize">{project.status.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>Started {new Date(project.start_date).toLocaleDateString()}</span>
                            {project.paymentStatus === 'released' && (
                                <Badge className="bg-green-50 text-green-700 ml-2 border-green-100">PAYMENT RELEASED</Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user.role === 'client' && project.status === 'active' && (
                        <Button
                            onClick={() => setIsCompletionModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> Complete Project
                        </Button>
                    )}
                    {user.role === 'admin' && project.status === 'completed' && project.paymentStatus !== 'released' && (
                        <Button
                            onClick={handleReleasePayment}
                            disabled={releasePaymentMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                            <DollarSign className="w-4 h-4 mr-2" /> Release Payment
                        </Button>
                    )}
                </div>
            </div>



            {/* Tabs */}
            <div className="border-b border-gray-200 flex justify-between items-end">
                <nav className="flex gap-8 overflow-x-auto no-scrollbar">
                    {['overview', 'tasks', 'team', 'files', 'srs', 'design', 'whiteboard'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 text-sm font-medium capitalize transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-[#204ecf]' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'srs' ? 'SRS' : tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#204ecf]"
                                />
                            )}
                        </button>
                    ))}
                </nav>
                {activeTab === 'tasks' && (
                    <div className="mb-2 flex items-center gap-3">
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                            <button
                                onClick={() => setTaskViewMode('board')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${taskViewMode === 'board'
                                    ? 'bg-white text-[#204ecf] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                Board
                            </button>
                            <button
                                onClick={() => setTaskViewMode('list')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${taskViewMode === 'list'
                                    ? 'bg-white text-[#204ecf] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <List className="w-3.5 h-3.5" />
                                List
                            </button>
                        </div>
                        {canManageTasks && (
                            <Button
                                onClick={() => setIsTaskModalOpen(true)}
                                className="bg-[#204ecf] hover:bg-[#1a3da8] text-white size-sm h-8 text-xs"
                            >
                                <Plus className="w-3 h-3 mr-1.5" /> Add Task
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        {taskViewMode === 'board' ? <KanbanBoard /> : <TaskListView tasks={tasks || []} onTaskClick={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }} />}
                    </div>
                )}
                {activeTab === 'team' && <TeamTab />}
                {activeTab === 'files' && <FilesTab />}
                {activeTab === 'srs' && <SRSTab />}
                {activeTab === 'design' && <DesignTab />}
                {activeTab === 'whiteboard' && <WhiteboardTab />}
            </motion.div>

            {/* Task Modal */}
            {
                isTaskModalOpen && (
                    <TaskModal
                        task={selectedTask}
                        user={user}
                        teamMembers={assignableMembers}
                        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
                        onSave={handleTaskSave}
                        onDelete={(id) => deleteTaskMutation.mutate(id)}
                        isSaving={createTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending}
                        readOnly={!!selectedTask && !isClientOrAdmin}
                    />
                )
            }

            {/* Project Completion Modal */}
            {isCompletionModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
                    >
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-50/50 to-white">
                            <div>
                                <h3 className="text-2xl font-bold text-[#1a1a2e]">Complete Project</h3>
                                <p className="text-sm text-gray-500 mt-1">Share your feedback to complete the engagement</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsCompletionModalOpen(false)} className="rounded-full">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                        <div className="p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">Rate the Experience</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setRating(s)}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= s ? 'bg-yellow-400 text-white scale-110 shadow-lg shadow-yellow-100' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">Client Review</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows={4}
                                    placeholder="Tell us about the quality of work, communication, and overall outcome..."
                                    className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-sm placeholder:text-gray-300"
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Minimum 10 characters required</p>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCompletionModalOpen(false)}
                                    className="flex-1 py-6 rounded-2xl font-bold text-gray-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCompleteProject}
                                    disabled={completeProjectMutation.isPending}
                                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl font-bold shadow-lg shadow-green-100 transition-all"
                                >
                                    {completeProjectMutation.isPending ? 'Processing...' : 'Complete & Finalize'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div >
    );
}


