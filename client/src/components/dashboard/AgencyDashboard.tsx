'use client';

import React, { useState } from 'react';
import { User, Agency } from '@/types';
import { Button } from "@/components/ui/button";
import { Plus, Bell, LogOut, Briefcase, MessageSquare, Users, Settings, DollarSign, BarChart, Clock, Edit, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/api/talentXApi';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import ProjectDetail from './ProjectDetail';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import TaskListView from '@/components/dashboard/TaskListView';
import TaskModal from '@/components/dashboard/TaskModal';
import { Task } from '@/types';
import NotificationCenter from './NotificationCenter';

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
            // For now, fetch all tasks. In real app, filter by agency's projects or assigned tasks.
            // Assuming we want to see tasks for all projects assigned to this agency
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
            // Filter projects assigned to this agency
            // The assigned_to.id is the agency ID, not the user ID
            return allProjects.filter((p: any) => {
                return p.assigned_to?.type === 'agency' && p.assigned_to?.id === agencyProfile.id;
            });
        },
        enabled: !!agencyProfile?.id
    });

    const selectedProject = projects?.find((p: any) => p.id === selectedProjectId);

    const renderView = () => {
        switch (activeView) {
            case 'overview':
                return <AgencyOverview />;
            case 'projects':
                if (selectedProjectId && selectedProject) {
                    return (
                        <ProjectDetail
                            user={user}
                            project={selectedProject}
                            onBack={() => setSelectedProjectId(null)}
                        />
                    );
                }
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-[#1a1a2e]">My Projects</h1>
                        </div>
                        {projects && projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project: any) => (
                                    <div
                                        key={project.id}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => setSelectedProjectId(project.id)}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg">
                                                {project.name.charAt(0)}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-700' :
                                                project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description || 'No description'}</p>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-500 font-medium">Progress</span>
                                                    <span className="text-gray-900 font-bold">{project.progress || 0}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-purple-500 rounded-full transition-all"
                                                        style={{ width: `${project.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Client</p>
                                                    <p className="text-gray-700 font-medium">{project.client_email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
                                                    <p className="text-gray-900 font-bold">${project.total_budget?.toLocaleString() || 0}</p>
                                                </div>
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
                );
            case 'messages':
                return <MessagesView user={user} />;
            case 'settings':
                return <SettingsView />;
            case 'tasks':
                return (
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
                );
            default:
                return <AgencyOverview />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href={createPageUrl('Home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#00c853] rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TX</span>
                            </div>
                            <span className="text-xl font-bold text-[#1a1a2e]">TalentX</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => { setActiveView('overview'); setSelectedProjectId(null); }} className={`font-medium py-5 border-b-2 ${activeView === 'overview' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>Dashboard</button>
                            <button onClick={() => { setActiveView('projects'); setSelectedProjectId(null); }} className={`font-medium py-5 border-b-2 ${activeView === 'projects' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>Projects</button>
                            <button onClick={() => { setActiveView('tasks'); setSelectedProjectId(null); }} className={`font-medium py-5 border-b-2 ${activeView === 'tasks' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>My Tasks</button>
                            <button onClick={() => setActiveView('messages')} className={`font-medium py-5 border-b-2 flex items-center gap-2 ${activeView === 'messages' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>
                                Messages
                                {(unreadCounts?.general || 0) + (unreadCounts?.support || 0) > 0 && (
                                    <span className="bg-[#204ecf] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        {(unreadCounts?.general || 0) + (unreadCounts?.support || 0)}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationCenter userId={user.id} />
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-[#1a1a2e]">{user.full_name}</div>
                                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                            </div>
                            <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                <img src={user.avatar_url} alt="User" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={onLogout}>
                                <LogOut className="w-5 h-5 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {renderView()}
            </div>
        </div>
    );
}
