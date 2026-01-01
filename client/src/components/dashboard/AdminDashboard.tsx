'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Check, X, Trash2, Mail, Plus, User as UserIcon, Users, Briefcase } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi } from '@/api/talentXApi';
import Link from 'next/link';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { MessagesView } from './MessagesView';
import ProjectDetail from './ProjectDetail';
import NotificationCenter from './NotificationCenter';
import { useSearchParams, useRouter } from 'next/navigation';

// --- Types ---
interface Application {
    id: string;
    userId: string;
    type: 'talent' | 'agency';
    name: string;
    email: string;
    role: string;
    status: string;
    appliedAt: string;
    resumeUrl: string | null;
    details: any;
}

export default function AdminDashboard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [user, setUser] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    useEffect(() => {
        talentXApi.auth.me().then(setUser);
    }, []);


    // --- Queries ---

    // Applications & Notifications (Original Logic)
    const [applications, setApplications] = useState<Application[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchAppAppNotifications = async () => {
        try {
            const [appsRes, notifsRes] = await Promise.all([
                fetch('http://localhost:5000/api/applications/list'),
                fetch('http://localhost:5000/api/applications/notifications')
            ]);
            if (appsRes.ok) setApplications(await appsRes.json());
            if (notifsRes.ok) setNotifications(await notifsRes.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAppAppNotifications();
        const interval = setInterval(fetchAppAppNotifications, 30000);
        return () => clearInterval(interval);
    }, []);


    // Users (From Legacy Dashboard)
    const { data: allUsers } = useQuery({
        queryKey: ['users'],
        queryFn: async () => talentXApi.entities.User.list()
    });

    // Messages (From Legacy Dashboard)
    const { data: messages } = useQuery({
        queryKey: ['messages'],
        queryFn: async () => talentXApi.entities.Message.list({})
    });

    // Projects
    const { data: projects, refetch: refetchProjects } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => talentXApi.entities.Project.list()
    });

    useEffect(() => {
        const projectId = searchParams.get('project');
        if (projectId && projects) {
            const project = projects.find((p: any) => p.id === projectId);
            if (project) {
                setSelectedProject(project);
                // Also switch tab to projects if needed, though selectedProject overrides UI
                if (activeTab !== 'projects') setActiveTab("projects");
            }
        } else if (!projectId && selectedProject) {
            // If URL no longer has project but state does, clear it
            setSelectedProject(null);
        }
    }, [searchParams, projects]);

    const deleteProjectMutation = useMutation({
        mutationFn: async (id: string) => talentXApi.entities.Project.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast({ title: 'Project deleted successfully' });
            refetchProjects();
        },
        onError: (error: any) => {
            toast({
                title: 'Failed to delete project',
                description: error.response?.data?.message || 'An error occurred',
                variant: 'destructive'
            });
        }
    });

    const handleDeleteProject = (projectId: string, projectName: string) => {
        if (confirm(`Are you sure you want to delete the project "${projectName}"? This action cannot be undone.`)) {
            deleteProjectMutation.mutate(projectId);
        }
    };



    // --- Mutations (From Legacy Dashboard) ---
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [userFormData, setUserFormData] = useState({
        full_name: '', email: '', password: '', role: 'client', title: '', agency_name: ''
    });

    const createUserMutation = useMutation({
        mutationFn: async (data: any) => talentXApi.entities.User.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({ title: 'User created successfully' });
            setIsUserModalOpen(false);
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => talentXApi.entities.User.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({ title: 'User updated successfully' });
            setIsUserModalOpen(false);
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => talentXApi.entities.User.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast({ title: 'User deleted successfully' });
        }
    });

    const handleDeleteUser = (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`)) {
            deleteUserMutation.mutate(userId);
        }
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            updateUserMutation.mutate({ id: editingUser.id, data: userFormData });
        } else {
            createUserMutation.mutate(userFormData);
        }
    };

    const handleOpenUserModal = (user?: any) => {
        if (user) {
            setEditingUser(user);
            setUserFormData({
                full_name: user.full_name, email: user.email, password: '', role: user.role, title: '', agency_name: ''
            });
        } else {
            setEditingUser(null);
            setUserFormData({ full_name: '', email: '', password: '', role: 'client', title: '', agency_name: '' });
        }
        setIsUserModalOpen(true);
    };


    // --- Actions (Original Logic) ---
    const updateAppStatus = async (id: string, status: string, type: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/applications/status/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, type })
            });

            if (response.ok) {
                toast({ title: `Application ${status.replace('_', ' ')}` });
                fetchAppAppNotifications();
            }
        } catch (error) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            const response = await fetch(`http://localhost:5000/api/applications/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast({ title: "Application deleted" });
                fetchAppAppNotifications();
            }
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'interview_invited': return 'bg-blue-100 text-blue-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


    const { data: unreadCounts } = useQuery({
        queryKey: ['unread-counts'],
        queryFn: async () => talentXApi.entities.Message.getUnreadCount(),
        refetchInterval: 10000
    });

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <NotificationCenter />
                </div>
            </div>

            {selectedProject && user ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <ProjectDetail
                        user={user}
                        project={selectedProject}
                        onBack={() => {
                            setSelectedProject(null);
                            router.push('/admin/dashboard');
                        }}
                    />
                </div>
            ) : (
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 lg:w-[500px]">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="messages" className="flex items-center gap-2">
                            Support
                            {unreadCounts?.support ? (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCounts.support}</span>
                            ) : null}
                        </TabsTrigger>
                    </TabsList>

                    {/* --- Overview Tab --- */}
                    <TabsContent value="overview" className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm text-black font-medium">Total Revenue</CardTitle>
                                    <span className="text-green-500 font-bold">$124,500</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12%</div>
                                    <p className="text-xs text-muted-foreground">from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm text-black font-medium">Active Applications</CardTitle>
                                    <span className="text-blue-500 font-bold">{applications.filter(a => a.status === 'pending').length}</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{applications.length}</div>
                                    <p className="text-xs text-black text-muted-foreground">Total applications</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm text-black font-medium">Total Users</CardTitle>
                                    <span className="text-purple-500 font-bold">{allUsers?.length || 0}</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+24</div>
                                    <p className="text-xs text-muted-foreground">new users this month</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                            {/* Notifications Widget */}
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex text-black items-center"><Mail className="w-4 h-4 mr-2" /> Recent Notifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className={`p-3 rounded-lg border text-sm ${notif.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-100'}`}>
                                                <p>{notif.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                            </div>
                                        ))}
                                        {notifications.length === 0 && <p className="text-gray-500 text-center py-4">No notifications</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* --- Applications Tab --- */}
                    <TabsContent value="applications" className="space-y-4 mt-6">
                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className='text-black'>Applications Management</CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => {
                                        fetch('http://localhost:5000/api/applications/sheet-url')
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.url) window.open(data.url, '_blank');
                                                else alert('Google Sheet ID not configured in server');
                                            });
                                    }}>
                                        <ExternalLink className="w-4 h-4 mr-2" /> View Google Sheet
                                    </Button>
                                    <Button onClick={fetchAppAppNotifications} variant="default" size="sm">Refresh</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Candidate</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Resume</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{app.name}</p>
                                                        <p className="text-sm text-gray-500">{app.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={app.type === 'talent' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-orange-200 bg-orange-50 text-orange-700'}>
                                                        {app.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {app.resumeUrl ? (
                                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                                            View <ExternalLink className="w-3 h-3 ml-1" />
                                                        </a>
                                                    ) : <span className="text-gray-400">N/A</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`px-2 py-1 rounded-full font-normal ${getStatusColor(app.status)}`}>
                                                        {app.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    {app.status === 'pending' && (
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs" onClick={() => updateAppStatus(app.id, 'accepted', app.type)}>
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {app.status === 'accepted' && <span className="text-xs text-green-600 font-medium mr-2">Account Active</span>}
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => deleteApplication(app.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {applications.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No applications found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Projects Tab --- */}
                    <TabsContent value="projects" className="space-y-4 mt-6">
                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className='text-black'>Projects Management</CardTitle>
                                <Button onClick={() => refetchProjects()} variant="default" size="sm">Refresh</Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project Name</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Budget</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Assigned To</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects?.map((project: any) => (
                                            <TableRow key={project.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{project.name}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{project.description || 'No description'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{project.client_email}</p>
                                                        <p className="text-xs text-gray-500">Client ID: {project.clientId?.substring(0, 8)}...</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`px-2 py-1 rounded-full font-normal ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                            project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {project.status?.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-900">
                                                            ${project.budget_spent?.toLocaleString() || 0} / ${project.total_budget?.toLocaleString() || 0}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {project.total_budget ? Math.round((project.budget_spent / project.total_budget) * 100) : 0}% spent
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-500 rounded-full transition-all"
                                                                style={{ width: `${project.progress || 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">{project.progress || 0}%</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {project.assigned_to ? (
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={project.assigned_to.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.assigned_to.name)}`}
                                                                alt={project.assigned_to.name}
                                                                className="w-8 h-8 rounded-full"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{project.assigned_to.name}</p>
                                                                <p className="text-xs text-gray-500 capitalize">{project.assigned_to.type}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right flex justify-end gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-xs flex items-center gap-1"
                                                        onClick={() => setSelectedProject(project)}
                                                    >
                                                        <ExternalLink className="w-3 h-3" /> View
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteProject(project.id, project.name)}
                                                        disabled={deleteProjectMutation.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!projects || projects.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">No projects found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Users Tab --- */}
                    <TabsContent value="users" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className='text-black'>User Management</CardTitle>
                                <Button onClick={() => handleOpenUserModal()} className="bg-[#204ecf] text-white">
                                    <Plus className="w-4 h-4 mr-2" /> Add User
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allUsers?.map((u: any) => (
                                            <TableRow key={u.id}>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 mr-3">
                                                            <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name}`} alt="" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{u.full_name}</div>
                                                            <div className="text-sm text-gray-500">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={'capitalize' + (u.role === 'talent' ? 'border-green-200 bg-green-50 text-green-700' : u.role === 'client' ? 'border-purple-200 bg-purple-50 text-purple-700' : 'border-orange-200 bg-orange-50 text-orange-700')}>{u.role}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{u.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    {u.role === 'talent' && (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={createPageUrl(`TalentProfile?id=${u.talent?.id}`)}>
                                                                View Profile
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {u.role === 'agency' && (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={createPageUrl(`AgencyProfile?id=${u.agency?.id}`)}>
                                                                View Profile
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    {u.role === 'client' && (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/client-profile?id=${u.id}`}>
                                                                View Profile
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpenUserModal(u)}>Edit</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteUser(u.id, u.full_name)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* User Modal */}
                        {isUserModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white text-black rounded-2xl w-full max-w-md p-6 shadow-2xl">
                                    <h3 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                                    <form onSubmit={handleUserSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Full Name</label>
                                            <input type="text" required className="w-full border rounded-lg px-3 py-2" value={userFormData.full_name} onChange={e => setUserFormData({ ...userFormData, full_name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email</label>
                                            <input type="email" required className="w-full border rounded-lg px-3 py-2" value={userFormData.email} onChange={e => setUserFormData({ ...userFormData, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                {editingUser ? 'Reset Password (optional)' : 'Password'}
                                            </label>
                                            <input
                                                type="password"
                                                required={!editingUser}
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={userFormData.password}
                                                onChange={e => setUserFormData({ ...userFormData, password: e.target.value })}
                                                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                                            />
                                            {editingUser && (
                                                <p className="text-xs text-gray-500 mt-1">Only fill this if you want to reset the user's password</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Role</label>
                                            <select className="w-full border rounded-lg px-3 py-2" value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value })} disabled={!!editingUser}>
                                                <option value="client">Client</option>
                                                <option value="talent">Talent</option>
                                                <option value="agency">Agency</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-6">
                                            <Button type="button" variant="ghost" onClick={() => setIsUserModalOpen(false)}>Cancel</Button>
                                            <Button type="submit" className="bg-[#204ecf] text-white">{editingUser ? 'Save' : 'Create'}</Button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </TabsContent>

                    {/* --- Support Tab --- */}
                    <TabsContent value="messages" className="space-y-4 mt-6">
                        {user ? (
                            <MessagesView user={user} initialShowSupport={true} />
                        ) : (
                            <div className="flex items-center justify-center p-12 text-gray-400">Loading support dashboard...</div>
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
