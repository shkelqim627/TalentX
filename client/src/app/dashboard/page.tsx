'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/api/talentXApi';
import { Button } from "@/components/ui/button";
import {
    Plus, MoreHorizontal, Clock, CheckCircle, Circle, AlertCircle, Search, Bell, Settings, LogOut, MessageSquare, Briefcase, Users, BarChart, User as UserIcon, CheckCircle2, LayoutGrid, List, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { Project, Task, User, Message, Talent } from '@/types';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import AgencyDashboard from '@/components/dashboard/AgencyDashboard';
import TaskModal from '@/components/dashboard/TaskModal';
import TaskListView from '@/components/dashboard/TaskListView';
import KanbanBoard from '@/components/dashboard/KanbanBoard';
import ProjectDetail from '@/components/dashboard/ProjectDetail';
import { MessagesView } from '@/components/dashboard/MessagesView';
import { Badge } from "@/components/ui/badge";
import NotificationCenter from '@/components/dashboard/NotificationCenter';

function DashboardContent() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<'overview' | 'projects' | 'messages' | 'tasks' | 'users' | 'stats' | 'hire' | 'settings'>('overview');
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskViewMode, setTaskViewMode] = useState<'board' | 'list'>('board');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const searchParams = useSearchParams();

    // Initialize User
    useEffect(() => {
        talentXApi.auth.me().then(u => {
            setUser(u);
            // Redirect admin to new dashboard
            if (u.role === 'admin') {
                router.push('/admin/dashboard');
                return;
            }

            // Sync with search params
            const viewParam = searchParams.get('view');
            if (viewParam) {
                setActiveView(viewParam as any);
            } else {
                // Set default view based on role
                if (u.role === 'talent') setActiveView('overview');
                if (u.role === 'client') setActiveView('overview');
            }

            const projectParam = searchParams.get('project');
            if (projectParam) {
                setSelectedProject(projectParam);
                setActiveView('projects');
            }
        });
    }, [searchParams]);

    const handleLogout = async () => {
        await talentXApi.auth.logout();
        router.push(createPageUrl('Login'));
    };

    // --- Queries ---

    // Projects
    const { data: projects, isLoading: projectsLoading } = useQuery({
        queryKey: ['projects', user?.id],
        queryFn: async () => {
            if (!user) return [];
            // Use list() which handles role-based filtering on backend
            const allProjects = await talentXApi.entities.Project.list();

            return allProjects;
        },
        enabled: !!user
    });

    // Tasks
    const { data: tasks, isLoading: tasksLoading } = useQuery({
        queryKey: ['tasks', selectedProject, user?.id],
        queryFn: async () => {
            if (selectedProject) {
                return await talentXApi.entities.Task.filter({ project_id: selectedProject });
            }
            if (user?.role === 'talent') {
                return await talentXApi.entities.Task.filter({ assignee: user.id });
            }
            return [];
        },
        enabled: !!user
    });

    // Messages
    const { data: messages, isLoading: messagesLoading } = useQuery({
        queryKey: ['messages', user?.id],
        queryFn: async () => {
            if (!user) return [];
            return await talentXApi.entities.Message.list({});
        },
        enabled: !!user && activeView === 'messages'
    });

    // Notifications
    const { data: notifications } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            if (!user) return [];
            return await talentXApi.entities.Notification.list(user.id);
        },
        enabled: !!user,
        refetchInterval: 10000
    });

    const { data: unreadCounts } = useQuery({
        queryKey: ['unread-counts', user?.id],
        queryFn: async () => talentXApi.entities.Message.getUnreadCount(),
        enabled: !!user,
        refetchInterval: 15000
    });

    const { data: talentProfile, refetch: refetchTalentProfile } = useQuery({
        queryKey: ['talentProfile', user?.id],
        queryFn: async () => {
            if (user?.role !== 'talent') return null;
            return await talentXApi.entities.Talent.getByUserId(user.id);
        },
        enabled: !!user && user.role === 'talent'
    });

    const { data: agencyProfile, refetch: refetchAgencyProfile } = useQuery({
        queryKey: ['agencyProfile', user?.id],
        queryFn: async () => {
            if (user?.role !== 'agency') return null;
            return await talentXApi.entities.Agency.getByUserId(user.id);
        },
        enabled: !!user && user.role === 'agency'
    });


    // --- Mutations ---

    const updateTaskMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
            return await talentXApi.entities.Task.update(id, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Task updated');
        }
    });

    const updateTalentMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Talent> }) => {
            return await talentXApi.entities.Talent.update(id, data);
        },
        onSuccess: () => {
            toast.success('Profile updated successfully');
            refetchTalentProfile();
        },
        onError: () => {
            toast.error('Failed to update profile');
        }
    });

    const updateAgencyMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<any> }) => {
            return await talentXApi.entities.Agency.update(id, data);
        },
        onSuccess: () => {
            toast.success('Profile updated successfully');
            refetchAgencyProfile();
        },
        onError: () => {
            toast.error('Failed to update profile');
        }
    });

    const sendMessageMutation = useMutation({
        mutationFn: async ({ content, receiver_id, isSupport }: { content: string; receiver_id: string; isSupport?: boolean }) => {
            return talentXApi.entities.Message.create({
                receiver_id,
                content,
                isSupport
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            toast.success('Message sent');
        }
    });

    // --- Views ---





    // --- Mutations ---

    const createUserMutation = useMutation({
        mutationFn: async (data: any) => talentXApi.entities.User.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully');
            setIsUserModalOpen(false);
        },
        onError: () => toast.error('Failed to create user')
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => talentXApi.entities.User.update(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully');
            setIsUserModalOpen(false);
            // If updating current user, update local state
            if (updatedUser.id === user?.id) {
                setUser(prev => prev ? { ...prev, ...updatedUser } : null);
            }
        },
        onError: () => toast.error('Failed to update user')
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => talentXApi.entities.User.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully');
        },
        onError: () => toast.error('Failed to delete user')
    });

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userFormData, setUserFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'client',
        // Role specific fields
        title: '',
        agency_name: ''
    });

    const handleOpenUserModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setUserFormData({
                full_name: user.full_name,
                email: user.email,
                password: '', // Don't show password
                role: user.role,
                title: '',
                agency_name: ''
            });
        } else {
            setEditingUser(null);
            setUserFormData({
                full_name: '',
                email: '',
                password: '',
                role: 'client',
                title: '',
                agency_name: ''
            });
        }
        setIsUserModalOpen(true);
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            updateUserMutation.mutate({ id: editingUser.id, data: userFormData as any });
        } else {
            createUserMutation.mutate(userFormData as any);
        }
    };

    const UsersView = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold text-lg text-[#1a1a2e]">User Management</h2>
                <Button onClick={() => handleOpenUserModal()} className="bg-[#204ecf] text-white hover:bg-[#1a3da8]">
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Assuming allUsers is fetched somewhere, if not, this will be empty */}
                    {/* {allUsers?.map((u) => ( */}
                    {/* This part was commented out or missing `allUsers` query, keeping it as is for now */}
                    {/* ))} */}
                </tbody>
            </table>

            {/* Simple Modal Directive */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                    value={userFormData.full_name}
                                    onChange={e => setUserFormData({ ...userFormData, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                    value={userFormData.email}
                                    onChange={e => setUserFormData({ ...userFormData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                    value={userFormData.password}
                                    onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#204ecf] outline-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                    value={userFormData.role}
                                    onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}
                                    disabled={!!editingUser}
                                >
                                    <option value="client">Client</option>
                                    <option value="talent">Talent</option>
                                    <option value="agency">Agency</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Dynamic Fields */}
                            {userFormData.role === 'talent' && !editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        placeholder="e.g. Senior React Developer"
                                        value={userFormData.title}
                                        onChange={e => setUserFormData({ ...userFormData, title: e.target.value })}
                                    />
                                </div>
                            )}
                            {userFormData.role === 'agency' && !editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        placeholder="e.g. DevCorp Solutions"
                                        value={userFormData.agency_name}
                                        onChange={e => setUserFormData({ ...userFormData, agency_name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <Button type="button" variant="ghost" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#204ecf] hover:bg-[#1a3da8] text-white">
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );

    const StatsView = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#1a1a2e]">$124,500</span>
                    <span className="text-green-500 text-sm font-medium">+12%</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Active Projects</h3>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#1a1a2e]">45</span>
                    <span className="text-green-500 text-sm font-medium">+5</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#1a1a2e]">1,234</span>
                    <span className="text-green-500 text-sm font-medium">+8%</span>
                </div>
            </div>
        </div>
    );

    const HireView = () => {
        const [step, setStep] = useState<'options' | 'requirements' | 'selection' | 'confirmation' | 'success'>('options');
        const [selectedTargetProject, setSelectedTargetProject] = useState<string>('');
        const [hireType, setHireType] = useState<'talent' | 'team' | 'agency' | null>(null);
        const [requirements, setRequirements] = useState({ skills: '', team_size: 3, budget: '' });
        const [generatedTeams, setGeneratedTeams] = useState<any[]>([]);
        const [selectedTeam, setSelectedTeam] = useState<any>(null);

        // Queries
        const generateTeamsMutation = useMutation({
            mutationFn: (data: any) => talentXApi.entities.Team.generate(data),
            onSuccess: (data) => {
                setGeneratedTeams(data);
                setStep('selection');
            },
            onError: () => toast.error("Failed to generate teams. Please try again.")
        });

        const hireTeamMutation = useMutation({
            mutationFn: (data: any) => talentXApi.entities.Team.hire(data),
            onSuccess: () => {
                setStep('success');
                toast.success("Team hired successfully!");
            },
            onError: () => toast.error("Failed to hire team.")
        });

        const handleOptionSelect = (type: 'talent' | 'team' | 'agency') => {
            setHireType(type);
            if (type === 'team') {
                setStep('requirements');
            } else {
                router.push(createPageUrl(type === 'talent' ? 'BrowseTalent' : 'BrowseAgencies'));
            }
        };

        const handleGenerate = (e: React.FormEvent) => {
            e.preventDefault();
            generateTeamsMutation.mutate(requirements);
        };

        const handleHire = (team: any) => {
            if (!projects || projects.length === 0) {
                toast.error("You need a project to hire a team. Please create a project first.");
                // Ideally redirect to create project or show modal, for now just toast and maybe redirect to projects view
                setActiveView('projects');
                return;
            }
            setSelectedTeam(team);
            setStep('confirmation');
        };

        const confirmHire = (projectId: string) => {
            hireTeamMutation.mutate({
                talentIds: selectedTeam.members.map((m: any) => m.id),
                projectId: projectId
            });
        };

        if (step === 'confirmation') {
            return (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" onClick={() => setStep('selection')} className="text-gray-500 p-0 hover:bg-transparent">
                            ← Back to Team Selection
                        </Button>
                        <h2 className="text-2xl font-bold text-[#1a1a2e]">Confirm Hiring</h2>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl mb-8">
                        <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{selectedTeam?.team_name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{selectedTeam?.description}</p>
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-500">Total Members:</span>
                            <span className="text-[#1a1a2e]">{selectedTeam?.members?.length}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium mt-2">
                            <span className="text-gray-500">Hourly Rate:</span>
                            <span className="text-[#1a1a2e]">${selectedTeam?.hourly_rate}/hr</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Project to Assign Team</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none bg-white"
                                value={selectedTargetProject}
                                onChange={e => setSelectedTargetProject(e.target.value)}
                            >
                                <option value="">Select a project...</option>
                                {projects?.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-2">Team members will be added to this project.</p>
                        </div>

                        <Button
                            onClick={() => {
                                if (selectedTargetProject) {
                                    confirmHire(selectedTargetProject);
                                } else {
                                    toast.error("Please select a project.");
                                }
                            }}
                            className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white py-6 text-lg rounded-xl font-bold shadow-lg shadow-blue-500/20"
                            disabled={!selectedTargetProject || hireTeamMutation.isPending}
                        >
                            {hireTeamMutation.isPending ? 'Propagating Contracts...' : 'Confirm Hire & Assign Team'}
                        </Button>
                    </div>
                </div>
            );
        }

        if (step === 'success') {
            return (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">Team Hired Successfully!</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Your new team <strong>{selectedTeam?.team_name}</strong> has been added to your project.
                        They are ready to start collaborating.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => { setActiveView('projects'); setStep('options'); }}
                            className="bg-[#204ecf] text-white px-8 py-2 rounded-xl"
                        >
                            View Project
                        </Button>
                    </div>
                </div>
            );
        }

        if (step === 'selection') {
            return (
                <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" onClick={() => setStep('requirements')} className="text-gray-500">
                            ← Back to Requirements
                        </Button>
                        <h2 className="text-2xl font-bold text-[#1a1a2e]">Select Your Team</h2>
                    </div>

                    {generateTeamsMutation.isPending ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-10 h-10 border-4 border-[#204ecf] border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Analyzing thousands of profiles to find your perfect match...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {generatedTeams.map((team, idx) => (
                                <div key={team.id} className="bg-white border-2 border-transparent hover:border-[#204ecf] rounded-2xl shadow-sm overflow-hidden transition-all group">
                                    <div className={`p-1 h-2 w-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-[#1a1a2e]">{team.team_name}</h3>
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">{team.match_score}% Match</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-6 h-10">{team.description}</p>

                                        <div className="space-y-3 mb-6">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Team Members</h4>
                                            <div className="flex -space-x-2 overflow-hidden py-2">
                                                {team.members.map((member: any) => (
                                                    <img
                                                        key={member.id}
                                                        className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                                                        src={member.image_url || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                                                        alt={member.name}
                                                        title={`${member.name} - ${member.role}`}
                                                    />
                                                ))}
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full ring-2 ring-white bg-gray-100 text-xs font-medium text-gray-500">
                                                    +{team.members.length}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {team.members.slice(0, 4).map((m: any) => (
                                                    <div key={m.id} className="flex items-center gap-1.5 text-gray-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                        <span className="truncate">{m.role}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">Hourly Rate</p>
                                                <p className="text-lg font-bold text-[#1a1a2e]">${team.hourly_rate}/hr</p>
                                            </div>
                                            <Button
                                                onClick={() => handleHire(team)}
                                                disabled={hireTeamMutation.isPending}
                                                className="bg-[#1a1a2e] text-white hover:bg-[#204ecf] transition-colors"
                                            >
                                                {hireTeamMutation.isPending && selectedTeam?.id === team.id ? 'Hiring...' : 'Hire Team'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (step === 'requirements') {
            return (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" onClick={() => setStep('options')} className="text-gray-500 p-0 hover:bg-transparent">
                            ← Back
                        </Button>
                        <h2 className="text-2xl font-bold text-[#1a1a2e]">Build Your Ideal Team</h2>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                placeholder="e.g. React, Node.js, AWS, UI/UX Design"
                                value={requirements.skills}
                                onChange={e => setRequirements({ ...requirements, skills: e.target.value })}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-2">Separate skills with commas</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Team Size</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none bg-white"
                                    value={requirements.team_size}
                                    onChange={e => setRequirements({ ...requirements, team_size: parseInt(e.target.value) })}
                                >
                                    {[2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num} Members</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Budget (Est.)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                    placeholder="$5,000"
                                    value={requirements.budget}
                                    onChange={e => setRequirements({ ...requirements, budget: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#204ecf] hover:bg-[#1a3da8] text-white py-6 text-lg rounded-xl font-bold shadow-lg shadow-blue-500/20"
                            disabled={generateTeamsMutation.isPending}
                        >
                            {generateTeamsMutation.isPending ? 'Generating Teams...' : 'Generate Team Options'}
                        </Button>
                    </form>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-3 gap-8">
                <div onClick={() => handleOptionSelect('talent')} className="cursor-pointer group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#204ecf] transition-all h-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <UserIcon className="w-8 h-8 text-[#204ecf]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Hire Freelancers</h3>
                        <p className="text-gray-500 mb-6">Find top 3% developers, designers, and finance experts for your projects.</p>
                        <Button variant="outline" className="mt-auto w-full group-hover:bg-[#204ecf] group-hover:text-white">Browse Talent</Button>
                    </div>
                </div>
                <div onClick={() => handleOptionSelect('team')} className="cursor-pointer group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#204ecf] transition-all h-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Hire a Team</h3>
                        <p className="text-gray-500 mb-6">Get a full-stack team automatically generated based on your requirements.</p>
                        <Button variant="outline" className="mt-auto w-full group-hover:bg-purple-600 group-hover:text-white">Build Team</Button>
                    </div>
                </div>
                <div onClick={() => handleOptionSelect('agency')} className="cursor-pointer group">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#204ecf] transition-all h-full flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8 text-[#00c853]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Hire an Agency</h3>
                        <p className="text-gray-500 mb-6">Partner with top development and design agencies for large-scale projects.</p>
                        <Button variant="outline" className="mt-auto w-full group-hover:bg-[#00c853] group-hover:text-white">Browse Agencies</Button>
                    </div>
                </div>
            </div>
        );
    };

    const TalentOverview = () => {
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState({
            title: talentProfile?.title || '',
            category: talentProfile?.category || 'developer',
            bio: talentProfile?.bio || '',
            hourly_rate: talentProfile?.hourly_rate || 0,
            experience_years: talentProfile?.experience_years || 0,
            skills: talentProfile?.skills || [],
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (talentProfile?.id) {
                updateTalentMutation.mutate({ id: talentProfile.id, data: formData as any });
                setIsEditing(false);
            }
        };

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#1a1a2e]">Profile Overview</h1>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "ghost" : "outline"}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Earnings</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">${(talentProfile?.completed_projects || 0) * 1200}</div>
                        <p className="text-xs text-gray-400 mt-1">Estimates based on projects</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-[#204ecf]" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Projects</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">{talentProfile?.completed_projects || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">Completed assignments</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <BarChart className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Rating</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">{talentProfile?.rating || '5.0'}</div>
                        <p className="text-xs text-yellow-600 mt-1">Excellent performance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Plus className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Applications</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">12</div>
                        <p className="text-xs text-gray-400 mt-1">Active bids</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-4xl">
                        <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Edit Professional Profile</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Professional Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none bg-white font-medium"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                                    >
                                        <option value="developer">Developer</option>
                                        <option value="designer">Designer</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="finance">Finance</option>
                                        <option value="product_manager">Product Manager</option>
                                        <option value="project_manager">Project Manager</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        value={formData.hourly_rate}
                                        onChange={e => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        value={formData.experience_years}
                                        onChange={e => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                    value={formData.skills.join(', ')}
                                    onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') })}
                                    placeholder="React, TypeScript, Node.js"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Professional Bio</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none resize-none"
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={updateTalentMutation.isPending}
                                    className="px-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateTalentMutation.isPending}
                                    className="bg-[#204ecf] text-white hover:bg-[#1a3da8] px-8"
                                >
                                    {updateTalentMutation.isPending ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Profile Info Card */}
                        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-6 mb-8">
                                <img
                                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.full_name}&background=random`}
                                    alt={user?.full_name}
                                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-[#1a1a2e]">{user?.full_name}</h2>
                                    <p className="text-[#204ecf] font-semibold">{talentProfile?.title || 'Professional Talent'}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-medium">
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ${talentProfile?.hourly_rate || 0}/hr</span>
                                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {talentProfile?.experience_years || 0} Years Exp</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About Me</h3>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {talentProfile?.bio || 'No bio provided yet. Update your profile to tell clients about yourself.'}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Skills & Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {talentProfile?.skills?.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-blue-50 text-[#204ecf] rounded-lg text-sm font-bold">
                                                {skill}
                                            </span>
                                        ))}
                                        {(!talentProfile?.skills || talentProfile.skills.length === 0) && (
                                            <span className="text-gray-400 text-sm">No skills added yet</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-[#1a1a2e] mb-4">Availability</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-bold text-gray-700">Currently Available</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Open to new projects and contracts</p>
                            </div>

                            <div className="bg-[#1a1a2e] p-6 rounded-2xl text-white">
                                <h3 className="font-bold mb-4">Upgrade to Pro</h3>
                                <p className="text-sm text-gray-400 mb-6 font-medium">Get featured placements and direct client matchmaking.</p>
                                <Button className="w-full bg-[#00c853] hover:bg-[#00a846] text-white border-none">Learn More</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const SettingsView = () => {
        const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');
        const [formData, setFormData] = useState({
            full_name: user?.full_name || '',
            email: user?.email || '',
            password: ''
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (user?.id) {
                updateUserMutation.mutate({ id: user.id, data: formData });
            }
        };

        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#1a1a2e]">Settings</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'profile' ? 'text-[#204ecf] border-b-2 border-[#204ecf]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'billing' ? 'text-[#204ecf] border-b-2 border-[#204ecf]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Billing & Subscription
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'profile' ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                            value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">New Password (leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={updateUserMutation.isPending}
                                        className="bg-[#204ecf] hover:bg-[#1a3da8] text-white px-8 h-12 rounded-xl shadow-lg shadow-blue-100"
                                    >
                                        {updateUserMutation.isPending ? 'Saving...' : 'Save Profile Changes'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#1a1a2e]">Professional Plan</h3>
                                            <p className="text-sm text-[#204ecf] font-semibold">$99/month</p>
                                        </div>
                                        <Badge className="bg-[#204ecf] text-white hover:bg-[#204ecf]">Active</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-6 font-medium">Your next billing date is January 24, 2026.</p>
                                    <Button variant="outline" className="border-[#204ecf] text-[#204ecf] hover:bg-blue-50">Manage Subscription</Button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-bold text-[#1a1a2e]">Payment Methods</h3>
                                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-400 text-xs italic">VISA</div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1a1a2e]">Visa ending in 4242</p>
                                                <p className="text-xs text-gray-400">Expires 12/26</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">Remove</Button>
                                    </div>
                                    <Button variant="ghost" className="text-[#204ecf] p-0 font-bold hover:bg-transparent">
                                        <Plus className="w-4 h-4 mr-2" /> Add payment method
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ClientOverview = () => {
        const stats = {
            totalProjects: projects?.length || 0,
            completedProjects: projects?.filter(p => p.status === 'completed').length || 0,
            totalBudget: projects?.reduce((acc, p) => acc + (p.total_budget || 0), 0) || 0,
            totalSpent: projects?.reduce((acc, p) => acc + (p.budget_spent || 0), 0) || 0,
            activeTasks: tasks?.filter(t => t.status !== 'done').length || 0
        };

        const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#1a1a2e]">{value}</span>
                    {subtitle && <span className="text-xs text-gray-400 font-medium">{subtitle}</span>}
                </div>
            </div>
        );

        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e]">Welcome back, {user?.full_name}!</h1>
                        <p className="text-gray-500">Here's what's happening with your projects.</p>
                    </div>
                    <Button onClick={() => setActiveView('hire')} className="bg-[#00c853] hover:bg-[#00a846] text-white rounded-xl px-6">
                        <Plus className="w-4 h-4 mr-2" /> Start New Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Active Projects"
                        value={stats.totalProjects - stats.completedProjects}
                        icon={Briefcase}
                        color="bg-blue-50 text-blue-600"
                        subtitle={`/ ${stats.totalProjects} total`}
                    />
                    <StatCard
                        title="Completed Projects"
                        value={stats.completedProjects}
                        icon={CheckCircle}
                        color="bg-green-50 text-green-600"
                    />
                    <StatCard
                        title="Total Investment"
                        value={`$${stats.totalSpent.toLocaleString()}`}
                        icon={DollarSign}
                        color="bg-purple-50 text-purple-600"
                        subtitle={`of $${stats.totalBudget.toLocaleString()}`}
                    />
                    <StatCard
                        title="Tasks in Progress"
                        value={stats.activeTasks}
                        icon={Clock}
                        color="bg-orange-50 text-orange-600"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-[#1a1a2e]">Recent Projects</h2>
                                <button onClick={() => setActiveView('projects')} className="text-sm font-bold text-[#204ecf] hover:underline">View all</button>
                            </div>
                            <div className="space-y-4">
                                {projects?.slice(0, 3).map((project) => (
                                    <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                                            <Briefcase className="w-5 h-5 text-gray-400 group-hover:text-[#204ecf]" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-[#1a1a2e] text-sm">{project.name}</h4>
                                                {project.assigned_to && (
                                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                        <img
                                                            src={project.assigned_to.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.assigned_to.name)}&background=random`}
                                                            alt={project.assigned_to.name}
                                                            className="w-4 h-4 rounded-full"
                                                        />
                                                        <span className="text-[10px] font-bold text-gray-500">{project.assigned_to.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#204ecf]" style={{ width: `${project.progress || 0}%` }}></div>
                                                </div>
                                                <span className="text-xs text-gray-500 font-medium">{project.progress || 0}%</span>
                                            </div>
                                        </div>
                                        <Badge className={`${project.status === 'completed' ? 'bg-green-50 text-green-600 hover:bg-green-50' :
                                            project.status === 'active' ? 'bg-blue-50 text-[#204ecf] hover:bg-blue-50' :
                                                'bg-gray-50 text-gray-600 hover:bg-gray-50'
                                            } border-none font-bold uppercase text-[10px]`}>
                                            {project.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#1a1a2e] p-6 rounded-2xl text-white shadow-xl shadow-blue-900/10">
                            <h3 className="font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button onClick={() => setActiveView('messages')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                                    <MessageSquare className="w-4 h-4 text-blue-400" />
                                    Contact Support
                                </button>
                                <button onClick={() => setActiveView('settings')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                                    <Settings className="w-4 h-4 text-purple-400" />
                                    Account Settings
                                </button>
                                <button onClick={() => setActiveView('hire')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">
                                    <Users className="w-4 h-4 text-green-400" />
                                    Hire More Talent
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Recent Messages</h3>
                            <div className="space-y-4 text-center py-4">
                                <MessageSquare className="w-8 h-8 text-gray-200 mx-auto" />
                                <p className="text-xs text-gray-400">No new messages from your team.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const AgencyOverview = () => {
        const [isEditing, setIsEditing] = useState(false);
        const [formData, setFormData] = useState({
            agency_name: agencyProfile?.agency_name || '',
            description: agencyProfile?.description || '',
            team_size: agencyProfile?.team_size || 1,
            hourly_rate_range: agencyProfile?.hourly_rate_range || '',
            services: agencyProfile?.services || [],
        });

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (agencyProfile?.id) {
                updateAgencyMutation.mutate({ id: agencyProfile.id, data: formData as any });
                setIsEditing(false);
            }
        };

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#1a1a2e]">Agency Profile</h1>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "ghost" : "outline"}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Revenue</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">${(agencyProfile?.completed_projects || 0) * 5000}</div>
                        <p className="text-xs text-gray-400 mt-1">Estimated earnings</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-[#204ecf]" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Projects</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">{agencyProfile?.completed_projects || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">Completed projects</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                                <BarChart className="w-6 h-6 text-yellow-600" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Rating</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">{agencyProfile?.rating || '5.0'}</div>
                        <p className="text-xs text-yellow-600 mt-1">Excellent performance</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Team Size</h3>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-[#1a1a2e]">{agencyProfile?.team_size || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">Team members</p>
                    </div>
                </div>

                {isEditing ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-4xl">
                        <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Edit Agency Profile</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Agency Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        value={formData.agency_name}
                                        onChange={e => setFormData({ ...formData, agency_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Team Size</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        value={formData.team_size}
                                        onChange={e => setFormData({ ...formData, team_size: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate Range</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none"
                                        value={formData.hourly_rate_range}
                                        onChange={e => setFormData({ ...formData, hourly_rate_range: e.target.value })}
                                        placeholder="$100-$200"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] outline-none resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    disabled={updateAgencyMutation.isPending}
                                    className="px-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={updateAgencyMutation.isPending}
                                    className="bg-[#204ecf] text-white hover:bg-[#1a3da8] px-8"
                                >
                                    {updateAgencyMutation.isPending ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={user?.avatar_url || `https://ui-avatars.com/api/?name=${agencyProfile?.agency_name}&background=random`}
                                alt={agencyProfile?.agency_name}
                                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-[#1a1a2e]">{agencyProfile?.agency_name}</h2>
                                <p className="text-[#204ecf] font-semibold">{agencyProfile?.hourly_rate_range || 'Rate not set'}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-medium">
                                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {agencyProfile?.team_size || 0} Members</span>
                                    <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {agencyProfile?.completed_projects || 0} Projects</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About Agency</h3>
                                <p className="text-gray-600 leading-relaxed font-medium">
                                    {agencyProfile?.description || 'No description provided yet. Update your profile to tell clients about your agency.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (user.role === 'client') {
        return (
            <ClientDashboard
                user={user}
                onLogout={handleLogout}
                activeView={activeView}
                setActiveView={setActiveView}
                MessagesView={MessagesView}
                HireView={HireView}
                SettingsView={SettingsView}
                ClientOverview={ClientOverview}
            />
        );
    }

    if (user.role === 'agency') {
        return (
            <AgencyDashboard
                user={user}
                onLogout={handleLogout}
                activeView={activeView}
                setActiveView={setActiveView}
                MessagesView={MessagesView}
                SettingsView={SettingsView}
                AgencyOverview={AgencyOverview}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* Logo Link */}
                        <Link href={createPageUrl('Home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#00c853] rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm">TX</span>
                            </div>
                            <span className="text-xl font-bold text-[#1a1a2e]">TalentX</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            {user.role === 'talent' && (
                                <>
                                    <button onClick={() => setActiveView('overview')} className={`font-medium py-5 border-b-2 ${activeView === 'overview' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>Dashboard</button>
                                    <button onClick={() => { setActiveView('projects'); setSelectedProject(null); }} className={`font-medium py-5 border-b-2 ${activeView === 'projects' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>Projects</button>
                                    <button onClick={() => setActiveView('tasks')} className={`font-medium py-5 border-b-2 ${activeView === 'tasks' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>My Tasks</button>
                                    <button onClick={() => setActiveView('messages')} className={`font-medium py-5 border-b-2 flex items-center gap-2 ${activeView === 'messages' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>
                                        Messages
                                        {(unreadCounts?.general || 0) + (unreadCounts?.support || 0) > 0 && (
                                            <span className="bg-[#204ecf] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                {(unreadCounts?.general || 0) + (unreadCounts?.support || 0)}
                                            </span>
                                        )}
                                    </button>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <button onClick={() => setActiveView('stats')} className={`font-medium py-5 border-b-2 ${activeView === 'stats' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>Overview</button>
                                    <button onClick={() => setActiveView('users')} className={`font-medium py-5 border-b-2 ${activeView === 'users' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>Users</button>
                                    <button onClick={() => setActiveView('messages')} className={`font-medium py-5 border-b-2 flex items-center gap-2 ${activeView === 'messages' ? 'border-[#204ecf] text-[#1a1a2e]' : 'border-transparent text-gray-500'}`}>
                                        Support
                                        {unreadCounts?.support ? (
                                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCounts.support}</span>
                                        ) : null}
                                    </button>
                                </>
                            )}
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
                            <Button variant="ghost" size="icon" onClick={handleLogout}>
                                <LogOut className="w-5 h-5 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {activeView === 'overview' && user?.role === 'talent' && <TalentOverview />}

                {activeView === 'projects' && !selectedProject && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-[#1a1a2e]">My Projects</h1>
                        </div>
                        {/* We need to import ProjectList at top, but for now assuming it is available or I will add import */}
                        {projects && projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project: any) => (
                                    <div
                                        key={project.id}
                                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                                        onClick={() => setSelectedProject(project.id)}
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
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Start Date</p>
                                                    <p className="text-gray-700 font-medium">{new Date(project.created_at || new Date()).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Role</p>
                                                    <p className="text-gray-900 font-bold">Talent</p>
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
                )}
                {activeView === 'projects' && selectedProject && projects?.find(p => p.id === selectedProject) && (
                    <ProjectDetail
                        user={user!}
                        project={projects!.find(p => p.id === selectedProject)!}
                        onBack={() => setSelectedProject(null)}
                    />
                )}

                {activeView === 'tasks' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold text-[#1a1a2e]">My Assigned Tasks</h1>
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
                        </div>
                        {taskViewMode === 'board' ? <KanbanBoard
                            tasks={tasks || []}
                            onTaskClick={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }}
                            onUpdateStatus={(id, status) => updateTaskMutation.mutate({ id, status: status as any })}
                        /> : <TaskListView tasks={tasks || []} onTaskClick={(task) => { setSelectedTask(task); setIsTaskModalOpen(true); }} />}
                    </div>
                )}

                {activeView === 'messages' && user && <MessagesView user={user} />}

                {activeView === 'settings' && <SettingsView />}

                {activeView === 'users' && <UsersView />}

                {activeView === 'stats' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-[#1a1a2e]">Platform Overview</h1>
                        </div>
                        <StatsView />
                    </>
                )}

                {activeView === 'hire' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-[#1a1a2e]">Start Hiring</h1>
                            <p className="text-gray-500">Choose how you want to build your team</p>
                        </div>
                        <HireView />
                    </>
                )}

                {/* Task Modal for global view */}
                {isTaskModalOpen && user && (
                    <TaskModal
                        task={selectedTask}
                        user={user}
                        teamMembers={[]} // Talents don't need to reassign from here
                        onClose={() => { setIsTaskModalOpen(false); setSelectedTask(null); }}
                        onSave={() => { }} // Read-only for talents in this view
                        isSaving={false}
                    />
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <DashboardContent />
        </React.Suspense>
    );
}
