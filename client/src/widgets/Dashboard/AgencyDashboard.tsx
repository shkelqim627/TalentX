'use client';

import React, { useState } from 'react';
import { User, Agency, Task } from '@/shared/types';
import { Button } from "@/shared/components/ui/button";
import { Plus, Bell, LogOut, Briefcase, MessageSquare, Users, Settings, DollarSign, BarChart, Clock, Edit, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/shared/api/talentXApi';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import ProjectDetail from './ProjectDetail';
import KanbanBoard from './KanbanBoard';
import TaskListView from './TaskListView';
import TaskModal from './TaskModal';
import NotificationCenter from './NotificationCenter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface AgencyDashboardProps {
    user: User;
    onLogout: () => void;
    activeView: string;
    setActiveView: (view: any) => void;
    MessagesView: React.ComponentType<{ user: User }>;
    SettingsView: React.ComponentType;
    AgencyOverview: React.ComponentType;
}

export default function AgencyDashboard({ user, onLogout, activeView, setActiveView, MessagesView, SettingsView, AgencyOverview }: AgencyDashboardProps) {
    const queryClient = useQueryClient();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const { data: unreadCounts } = useQuery({
        queryKey: ['unread-counts'],
        queryFn: async () => talentXApi.entities.Message.getUnreadCount(),
        refetchInterval: 10000
    });

    const searchParams = useSearchParams();

    // Listen for deep links
    React.useEffect(() => {
        const projectParam = searchParams.get('project');
        if (projectParam) {
            setSelectedProjectId(projectParam);
        }
    }, [searchParams]);

    // Get agency profile for the current user
    const { data: agencyProfile } = useQuery({
        queryKey: ['agencyProfile', user.id],
        queryFn: async () => {
            return await talentXApi.entities.Agency.getByUserId(user.id);
        },
        enabled: !!user
    });

    // Tasks query
    const { data: tasks } = useQuery({
        queryKey: ['tasks', agencyProfile?.id],
        queryFn: async () => {
            if (activeView !== 'tasks') return [];
            return await talentXApi.entities.Task.list();
        },
        enabled: !!agencyProfile?.id && activeView === 'tasks'
    });

    const updateTaskMutation = useMutation({
        mutationFn: (variables: { id: string; status: Task['status'] }) =>
            talentXApi.entities.Task.update(variables.id, { status: variables.status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task status updated');
        }
    });

    // Projects query
    const { data: projects } = useQuery({
        queryKey: ['projects', agencyProfile?.id],
        queryFn: async () => {
            if (!agencyProfile?.id) return [];
            const allProjects = await talentXApi.entities.Project.list();
            return allProjects.filter((p: any) => {
                return p.assigned_to?.type === 'agency' && p.assigned_to?.id === agencyProfile.id;
            });
        },
        enabled: !!agencyProfile?.id
    });

    const selectedProject = projects?.find((p: any) => p.id === selectedProjectId);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 lg:w-[600px] mb-8">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-0">
                        <AgencyOverview />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-0">
                        {selectedProjectId && selectedProject ? (
                            <ProjectDetail project={selectedProject} user={user} onBack={() => setSelectedProjectId(null)} />
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900">Assigned Projects</h1>
                                </div>

                                {projects && projects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {projects.map((project: any) => (
                                            <div
                                                key={project.id}
                                                onClick={() => setSelectedProjectId(project.id)}
                                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#204ecf] group-hover:bg-[#204ecf] group-hover:text-white transition-all">
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{project.description}</p>

                                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="text-left">
                                                        <p className="text-xs text-gray-400 uppercase font-bold">Client</p>
                                                        <p className="text-gray-700 font-medium">{project.client_email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
                                                        <p className="text-gray-900 font-bold">${project.total_budget?.toLocaleString() || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                                        <p className="text-gray-500">You haven't been assigned to any projects yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="tasks" className="mt-0">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold text-[#1a1a2e]">My Agency Tasks</h1>
                                <div className="bg-white p-1 rounded-xl flex items-center gap-1 border border-gray-200">
                                    <button
                                        onClick={() => setTaskViewMode('board')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${taskViewMode === 'board'
                                            ? 'bg-blue-50 text-[#204ecf]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                        Board
                                    </button>
                                    <button
                                        onClick={() => setTaskViewMode('list')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${taskViewMode === 'list'
                                            ? 'bg-blue-50 text-[#204ecf]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <List className="w-3.5 h-3.5" />
                                        List
                                    </button>
                                </div>
                            </div>
                            {taskViewMode === 'board' ? (
                                <KanbanBoard
                                    tasks={tasks || []}
                                    onTaskClick={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                                    onUpdateStatus={(id, status) => updateTaskMutation.mutate({ id, status: status as any })}
                                />
                            ) : (
                                <TaskListView
                                    tasks={tasks || []}
                                    onTaskClick={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                                />
                            )}
                            {isTaskModalOpen && selectedTask && (
                                <TaskModal
                                    task={selectedTask}
                                    user={user}
                                    teamMembers={[]}
                                    onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
                                    onSave={() => { }}
                                    isSaving={false}
                                />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="messages" className="mt-0">
                        <MessagesView user={user} />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0">
                        <SettingsView />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
