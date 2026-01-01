import React, { useState } from 'react';
import { User, Project } from '@/types';
import { Button } from "@/components/ui/button";
import { Plus, Bell, LogOut, Briefcase, MessageSquare, Users, Settings, Search, X, BarChart } from 'lucide-react';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/api/talentXApi';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import NotificationCenter from './NotificationCenter';

interface ClientDashboardProps {
    user: User;
    onLogout: () => void;
    activeView: string;
    setActiveView: (view: any) => void;
    MessagesView: React.ComponentType<{ user: User }>;
    HireView: React.ComponentType;
    SettingsView: React.ComponentType;
    ClientOverview: React.ComponentType;
}

export default function ClientDashboard({ user, onLogout, activeView, setActiveView, MessagesView, HireView, SettingsView, ClientOverview }: ClientDashboardProps) {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();

    // Listen for deep links
    React.useEffect(() => {
        const projectParam = searchParams.get('project');
        if (projectParam) {
            setSelectedProjectId(projectParam);
        }
    }, [searchParams]);

    // Projects Query
    const { data: projects = [], isLoading } = useQuery({
        queryKey: ['projects', user.id],
        queryFn: async () => {
            const allProjects = await talentXApi.entities.Project.filter({ client_email: user.email });
            return allProjects.map(p => ({
                ...p,
                progress: p.progress || 0,
                budget_spent: p.budget_spent || 0,
                total_budget: p.total_budget || 0,
                next_milestone: p.next_milestone || '',
                team_members: p.team_members || []
            }));
        }
    });

    // Create Project Mutation
    const createProjectMutation = useMutation({
        mutationFn: async (newProject: Partial<Project>) => {
            return await talentXApi.entities.Project.create({
                name: newProject.name,
                description: newProject.description,
                client_email: user.email,
                clientId: user.id
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
            setIsNewProjectModalOpen(false);
            setNewProjectName('');
            setNewProjectDescription('');
            toast.success('Project created successfully!');
        },
        onError: (error: any) => {
            console.error('Project creation failed:', error);
            const message = error.response?.data?.message || error.response?.data?.error || 'Failed to create project';
            toast.error(message);
        }
    });



    // Update Project Mutation
    const updateProjectMutation = useMutation({
        mutationFn: async (data: Partial<Project>) => {
            if (!editingProjectId) return;
            return await talentXApi.entities.Project.update(editingProjectId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
            setIsNewProjectModalOpen(false);
            setNewProjectName('');
            setNewProjectDescription('');
            setIsEditMode(false);
            setEditingProjectId(null);
            toast.success('Project updated successfully!');
        },
        onError: (error: any) => {
            console.error('Project update failed:', error);
            const message = error.response?.data?.message || 'Failed to update project';
            toast.error(message);
        }
    });

    // Delete Project Mutation
    const deleteProjectMutation = useMutation({
        mutationFn: async (projectId: string) => {
            return await talentXApi.entities.Project.delete(projectId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', user.id] });
            toast.success('Project deleted successfully!');
        },
        onError: (error: any) => {
            console.error('Project deletion failed:', error);
            const message = error.response?.data?.message || 'Failed to delete project';
            toast.error(message);
        }
    });

    const handleCreateOrUpdateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        if (isEditMode && editingProjectId) {
            updateProjectMutation.mutate({
                name: newProjectName,
                description: newProjectDescription
            });
        } else {
            createProjectMutation.mutate({
                name: newProjectName,
                description: newProjectDescription
            });
        }
    };

    const openEditModal = (project: Project) => {
        setIsEditMode(true);
        setEditingProjectId(project.id);
        setNewProjectName(project.name);
        setNewProjectDescription(project.description || '');
        setIsNewProjectModalOpen(true);
    };

    const handleDeleteProject = (projectId: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProjectMutation.mutate(projectId);
        }
    };

    const { data: unreadCounts } = useQuery({
        queryKey: ['unread-counts'],
        queryFn: async () => talentXApi.entities.Message.getUnreadCount(),
        refetchInterval: 10000
    });

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00c853] rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">TX</span>
                    </div>
                    <span className="text-xl font-bold text-[#1a1a2e]">TalentX</span>
                </div>

                <nav className="p-4 space-y-2 flex-1">
                    <button
                        onClick={() => { setActiveView('overview'); setSelectedProjectId(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'overview' ? 'bg-[#204ecf]/10 text-[#204ecf]' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <BarChart className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => { setActiveView('projects'); setSelectedProjectId(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'projects' ? 'bg-[#204ecf]/10 text-[#204ecf]' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Briefcase className="w-5 h-5" />
                        Projects
                    </button>
                    <button
                        onClick={() => setActiveView('messages')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'messages' ? 'bg-[#204ecf]/10 text-[#204ecf]' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5" />
                            Messages
                        </div>
                        {(unreadCounts?.general || 0) + (unreadCounts?.support || 0) > 0 && (
                            <span className="bg-[#204ecf] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {(unreadCounts?.general || 0) + (unreadCounts?.support || 0)}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveView('hire')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'hire' ? 'bg-[#204ecf]/10 text-[#204ecf]' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Hire Talent
                    </button>
                    <button
                        onClick={() => setActiveView('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeView === 'settings' ? 'bg-[#204ecf]/10 text-[#204ecf]' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[#1a1a2e] truncate">{user.full_name}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onLogout} className="text-gray-400 hover:text-red-500">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 lg:hidden p-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#00c853] rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">TX</span>
                        </div>
                        <span className="text-xl font-bold text-[#1a1a2e]">TalentX</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onLogout}>
                        <LogOut className="w-5 h-5" />
                    </Button>
                </header>

                {/* Top Bar (Desktop) */}
                <header className="bg-white border-b border-gray-200 hidden lg:flex items-center justify-between px-8 py-4 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-[#1a1a2e]">
                        {activeView === 'projects' && (selectedProjectId ? 'Project Details' : 'Projects')}
                        {activeView === 'messages' && 'Messages'}
                        {activeView === 'hire' && 'Hire Talent'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none text-sm focus:ring-2 focus:ring-[#204ecf] w-64"
                            />
                        </div>
                        <NotificationCenter userId={user.id} />
                        <Button
                            onClick={() => {
                                setIsEditMode(false);
                                setNewProjectName('');
                                setNewProjectDescription('');
                                setIsNewProjectModalOpen(true);
                            }}
                            className="bg-[#204ecf] hover:bg-[#1a3da8] text-white rounded-full px-6"
                        >
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Button>
                    </div>
                </header>

                <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
                    {activeView === 'overview' && <ClientOverview />}
                    {activeView === 'projects' && (
                        selectedProjectId && selectedProject ? (
                            <ProjectDetail
                                user={user}
                                project={selectedProject}
                                onBack={() => setSelectedProjectId(null)}
                            />
                        ) : (
                            <ProjectList
                                projects={projects}
                                onSelectProject={setSelectedProjectId}
                                onEdit={openEditModal}
                                onDelete={handleDeleteProject}
                            />
                        )
                    )}

                    {activeView === 'messages' && <MessagesView user={user} />}
                    {activeView === 'settings' && <SettingsView />}
                    {activeView === 'hire' && (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-[#1a1a2e]">Start Hiring</h1>
                                <p className="text-gray-500">Choose how you want to build your team</p>
                            </div>
                            <HireView />
                        </div>
                    )}
                </div>
            </main>

            {/* New Project Modal */}
            {isNewProjectModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#1a1a2e]">{isEditMode ? 'Edit Project' : 'Create New Project'}</h3>
                            <button onClick={() => { setIsNewProjectModalOpen(false); setIsEditMode(false); setNewProjectName(''); setNewProjectDescription(''); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateOrUpdateProject} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. Mobile App Development"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Briefly describe your project goals..."
                                />
                            </div>
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
                                    className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white py-6 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
                                >
                                    {isEditMode
                                        ? (updateProjectMutation.isPending ? 'Updating...' : 'Update Project')
                                        : (createProjectMutation.isPending ? 'Creating...' : 'Create Project')
                                    }
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
