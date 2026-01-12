'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { ExternalLink, Check, X, Trash2, Mail, Plus, User as UserIcon, Users, Briefcase, BarChart as ChartIcon, TrendingUp, Settings as SettingsIcon, DollarSign, ClipboardCheck, ArrowUpRight, Search, Zap, PieChart, Activity, BookOpen, FileText, MessageSquare, HelpCircle, Pencil, Star } from 'lucide-react';
import { useToast } from "@/shared/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { talentXApi, API_URL } from '@/shared/api/talentXApi';
import Link from 'next/link';
import { createPageUrl } from '@/shared/lib/utils';
import { motion } from 'framer-motion';
import { MessagesView } from './MessagesView';
import ProjectDetail from './ProjectDetail';
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
    const [contentSubTab, setContentSubTab] = useState("faqs");
    const [isCMSModalOpen, setIsCMSModalOpen] = useState(false);
    const [cmsModalSubmitting, setCmsModalSubmitting] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [cmsFormData, setCmsFormData] = useState<any>({});
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
            const [apps, notifs] = await Promise.all([
                talentXApi.entities.Application.list(),
                talentXApi.entities.Application.notifications()
            ]);
            setApplications(apps);
            setNotifications(notifs);
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

    // Hire Requests
    const { data: hireRequests, refetch: refetchHireRequests } = useQuery({
        queryKey: ['hire-requests'],
        queryFn: async () => talentXApi.entities.HireRequest.list()
    });

    // CMS queries
    const { data: faqs } = useQuery({
        queryKey: ['cms-faqs'],
        queryFn: () => talentXApi.entities.CMS.FAQ.list()
    });
    const { data: testimonials } = useQuery({
        queryKey: ['cms-testimonials'],
        queryFn: () => talentXApi.entities.CMS.Testimonial.list()
    });
    const { data: caseStudies } = useQuery({
        queryKey: ['cms-case-studies'],
        queryFn: () => talentXApi.entities.CMS.CaseStudy.list()
    });
    const { data: blogPosts } = useQuery({
        queryKey: ['cms-blog-posts'],
        queryFn: () => talentXApi.entities.CMS.BlogPost.list()
    });

    // Analytics
    const { data: analytics } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: async () => talentXApi.entities.Admin.getAnalytics()
    });

    const [auditFilters, setAuditFilters] = useState({
        entityType: 'all',
        startDate: '',
        endDate: ''
    });

    // Audit Logs
    const { data: auditLogs } = useQuery({
        queryKey: ['audit-logs', auditFilters],
        queryFn: async () => talentXApi.entities.Admin.getAuditLogs(auditFilters),
        refetchInterval: 30000 // Refresh every 30 seconds
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

    const cmsMutation = useMutation({
        mutationFn: async ({ type, action, id, data }: { type: string, action: 'create' | 'update' | 'delete', id?: string, data?: any }) => {
            const api: any = talentXApi.entities.CMS;
            let entityKey = type === 'blog' ? 'BlogPost' : type === 'faqs' ? 'FAQ' : type === 'testimonials' ? 'Testimonial' : 'CaseStudy';
            if (action === 'create') return api[entityKey].create(data);
            if (action === 'update') return api[entityKey].update(id, data);
            if (action === 'delete') return api[entityKey].delete(id);
        },
        onSuccess: (_, variables) => {
            const key = `cms-${variables.type}`;
            queryClient.invalidateQueries({ queryKey: [key] });
            toast({ title: `CMS Entry ${variables.action === 'delete' ? 'deleted' : 'saved'} successfully` });
            setIsCMSModalOpen(false);
            setEditingItem(null);
            setCmsModalSubmitting(false);
        },
        onError: (error: any) => {
            setCmsModalSubmitting(false);
            toast({
                title: 'Operation failed',
                description: error.response?.data?.message || 'An error occurred',
                variant: 'destructive'
            });
        }
    });

    const handleCMSAction = (type: string, action: 'create' | 'update' | 'delete', id?: string, data?: any) => {
        if (action === 'delete' && !confirm('Are you sure?')) return;
        if (action !== 'delete') setCmsModalSubmitting(true);
        cmsMutation.mutate({ type, action, id, data });
    };

    const openCMSModal = (item?: any) => {
        setEditingItem(item || null);
        if (item) {
            setCmsFormData({ ...item });
        } else {
            // Defaults based on current subtab
            if (contentSubTab === 'faqs') setCmsFormData({ question: '', answer: '', category: 'General' });
            if (contentSubTab === 'testimonials') setCmsFormData({ author: '', role: '', company: '', quote: '', headline: '', rating: 5 });
            if (contentSubTab === 'case-studies') setCmsFormData({ title: '', image: '', client_name: '', video_url: '', logo: '', color: '#000000' });
            if (contentSubTab === 'blog') setCmsFormData({ title: '', content: '', excerpt: '', image: '', author: '', category: 'Industry', published: true });
        }
        setIsCMSModalOpen(true);
    };

    const handleSubmitCMS = (e: React.FormEvent) => {
        e.preventDefault();
        const action = editingItem ? 'update' : 'create';
        handleCMSAction(contentSubTab, action, editingItem?.id, cmsFormData);
    };

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
            await talentXApi.entities.Application.updateStatus(id, { status, type });
            toast({ title: `Application ${status.replace('_', ' ')}` });
            fetchAppAppNotifications();
        } catch (error) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            await talentXApi.entities.Application.delete(id);
            toast({ title: "Application deleted" });
            fetchAppAppNotifications();
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


    const updateHireRequestStatus = async (id: string, status: string) => {
        try {
            await talentXApi.entities.HireRequest.updateStatus(id, status);
            toast({ title: `Hire request ${status}` });
            refetchHireRequests();
        } catch (error) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        try {
            await talentXApi.entities.User.toggleStatus(userId, newStatus as any);
            toast({ title: `User ${newStatus === 'active' ? 'activated' : 'disabled'}` });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (error) {
            toast({ title: "Failed to update status", variant: "destructive" });
        }
    };

    const calculateInsights = () => {
        if (!hireRequests || !allUsers || !projects) return null;

        const totalLeads = hireRequests.length;
        const matchedLeads = hireRequests.filter((r: any) => r.status === 'matched').length;
        const matchRate = totalLeads ? Math.round((matchedLeads / totalLeads) * 100) : 0;

        // Roughly estimate churn: clients with no active projects started in 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const clients = allUsers.filter((u: any) => u.role === 'client');
        const churnedClients = clients.filter((c: any) => {
            const clientProjects = projects.filter((p: any) => p.clientId === c.id);
            if (clientProjects.length === 0) return true; // Never started
            const lastProject = clientProjects.sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())[0];
            return new Date(lastProject.start_date) < ninetyDaysAgo;
        });

        // Category breakdown
        const categories = hireRequests.reduce((acc: any, curr: any) => {
            const cat = curr.category || 'Unknown';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        return {
            matchRate,
            churnRate: clients.length ? Math.round((churnedClients.length / clients.length) * 100) : 0,
            totalClients: clients.length,
            activeLeads: hireRequests.filter((r: any) => r.status === 'pending').length,
            categories: Object.entries(categories).sort((a: any, b: any) => b[1] - a[1])
        };
    };

    const insights = calculateInsights();

    const { data: unreadCounts } = useQuery({
        queryKey: ['unread-counts'],
        queryFn: async () => talentXApi.entities.Message.getUnreadCount(),
        refetchInterval: 10000
    });

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">


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
                    <TabsList className="flex flex-wrap lg:grid w-full grid-cols-4 lg:grid-cols-10 lg:w-fit mb-8 h-auto p-1 bg-gray-100 rounded-xl">
                        <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                        <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
                        <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                        <TabsTrigger value="applications" className="flex-1">Applications</TabsTrigger>
                        <TabsTrigger value="hire-requests" className="flex items-center gap-2 flex-1">
                            Leads
                            {hireRequests?.filter((r: any) => r.status === 'pending').length ? (
                                <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{hireRequests.filter((r: any) => r.status === 'pending').length}</span>
                            ) : null}
                        </TabsTrigger>
                        <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
                        <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
                        <TabsTrigger value="financials" className="flex-1">Financials</TabsTrigger>
                        <TabsTrigger value="messages" className="flex items-center gap-2 flex-1">
                            Support
                            {unreadCounts?.support ? (
                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCounts.support}</span>
                            ) : null}
                        </TabsTrigger>
                        <TabsTrigger value="audit-logs" className="flex items-center gap-2 flex-1">
                            Audit Logs
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
                    </TabsList>

                    {/* --- Overview Tab --- */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-white border-gray-100 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 border-none">+{analytics?.revenue.growth}%</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Global Revenue</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">${analytics?.revenue.total.toLocaleString()}</h3>
                                    <div className="h-10 mt-4 flex items-end gap-1">
                                        {analytics?.revenue.history.map((h: any, i: number) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-blue-100 rounded-sm hover:bg-blue-600 transition-colors"
                                                style={{ height: `${(h.value / 150000) * 100}%` }}
                                                title={`${h.month}: $${h.value.toLocaleString()}`}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-gray-100 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Users className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 border-none">+{analytics?.users.growth}%</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{analytics?.users.total}</h3>
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500" style={{ width: '65%' }} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400">TALENT</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-gray-100 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <Briefcase className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-700 border-none">ACTIVE</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">Active Projects</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{analytics?.projects.active}</h3>
                                    <p className="text-xs text-gray-400 mt-4">{analytics?.projects.completed} projects archiving</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-gray-100 shadow-sm">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <ClipboardCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-700 border-none">PENDING</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">New Leads</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{hireRequests?.filter((r: any) => r.status === 'pending').length}</h3>
                                    <p className="text-xs text-gray-400 mt-4">Average response time: 4h</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 bg-white border-gray-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        Platform Growth
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px] w-full flex items-end gap-3 pb-8 relative">
                                        {/* Y-Axis lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="w-full border-t border-gray-50" />
                                            ))}
                                        </div>
                                        {analytics?.revenue.history.map((h: any, i: number) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                                                <div
                                                    className="w-full bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600 group-hover:scale-x-105"
                                                    style={{ height: `${(h.value / 150000) * 100}%` }}
                                                />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">{h.month}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-gray-100 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-purple-600" />
                                        Activity Feed
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className="flex gap-3">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{notif.content}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {notifications.length === 0 && <p className="text-gray-500 text-center py-4">No new activity</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* --- Insights Tab --- */}
                    <TabsContent value="insights" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Zap className="w-4 h-4" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Market Liquidity</p>
                                    </div>
                                    <CardTitle className="text-3xl font-black text-gray-900">{insights?.matchRate}%</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-gray-500">Lead-to-Project Match Rate</p>
                                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600" style={{ width: `${insights?.matchRate}%` }} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">Target: 45% Matching</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <Activity className="w-4 h-4" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Growth Churn</p>
                                    </div>
                                    <CardTitle className="text-3xl font-black text-gray-900">{insights?.churnRate}%</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-gray-500">Inactive Clients (90d)</p>
                                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${insights?.churnRate}%` }} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">{insights?.totalClients} Total Registered Clients</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-purple-600">
                                        <PieChart className="w-4 h-4" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Categories</p>
                                    </div>
                                    <CardTitle className="text-3xl font-black text-gray-900">{insights?.categories.length}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium text-gray-500">Active Talent Segments</p>
                                    <div className="flex gap-1 mt-4">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`h-2 flex-1 rounded-full ${i === 1 ? 'bg-purple-600' : 'bg-gray-100'}`} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-3">Dominant: {insights?.categories[0]?.[0] || 'N/A'}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-gray-900">Category Demand Heatmap</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {insights?.categories.map(([cat, count]: any) => (
                                            <div key={cat} className="space-y-1.5">
                                                <div className="flex justify-between items-center text-xs font-bold uppercase">
                                                    <span className="text-gray-500 tracking-tighter">{cat}</span>
                                                    <span className="text-gray-900">{count} leads</span>
                                                </div>
                                                <div className="h-4 bg-gray-50 rounded-md overflow-hidden flex gap-0.5">
                                                    {Array.from({ length: count }).map((_, i) => (
                                                        <div key={i} className="flex-1 bg-blue-500/20 hover:bg-blue-600 transition-colors" />
                                                    ))}
                                                    <div className="flex-[5] bg-gray-50" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-gray-900">Retention Strategy</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
                                        <h4 className="font-bold text-blue-900 text-sm">Marketplace Health: Good</h4>
                                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                            Your match rate is {insights?.matchRate}%. Increasing this to 40% would result in an estimated $15k revenue bump.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended Actions</p>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                <Mail className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-900">Email churned clients (Top Designers offer)</p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                <TrendingUp className="w-4 h-4 text-gray-500 group-hover:text-white" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-900">Lower platform fee for {insights?.categories[0]?.[0]} leads</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-6 mt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Content Hub</h2>
                                <p className="text-sm text-gray-500 font-medium">Manage platform content and marketing assets</p>
                            </div>
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                                {[
                                    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
                                    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
                                    { id: 'case-studies', label: 'Case Studies', icon: Briefcase },
                                    { id: 'blog', label: 'Blog', icon: FileText },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setContentSubTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${contentSubTab === tab.id
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <tab.icon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CMS List Views */}
                        <Card className="bg-white border-none shadow-sm min-h-[500px]">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold text-gray-900">
                                    {contentSubTab === 'faqs' && 'Platform FAQs'}
                                    {contentSubTab === 'testimonials' && 'Client Testimonials'}
                                    {contentSubTab === 'case-studies' && 'Success Stories'}
                                    {contentSubTab === 'blog' && 'Market Insights (Blog)'}
                                </CardTitle>
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 px-4 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                                    onClick={() => openCMSModal()}
                                >
                                    <Plus className="w-4 h-4" />
                                    Add {contentSubTab === 'blog' ? 'Post' : 'Entry'}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {contentSubTab === 'faqs' && (
                                    <div className="space-y-3">
                                        {(faqs || []).length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <HelpCircle className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No FAQs Found</p>
                                                <p className="text-sm text-gray-500 mt-1 max-w-xs">Start by adding common questions to help your users navigate the platform.</p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {faqs?.map((faq: any) => (
                                                    <div key={faq.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 transition-all group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Badge className="bg-blue-50 text-blue-600 border-none px-2 py-0.5 text-[10px] font-bold uppercase">{faq.category || 'General'}</Badge>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => openCMSModal(faq)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => handleCMSAction('faqs', 'delete', faq.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-gray-900 mb-1">{faq.question}</h4>
                                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{faq.answer}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {contentSubTab === 'testimonials' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(testimonials || []).length === 0 ? (
                                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                                <MessageSquare className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No Testimonials Found</p>
                                            </div>
                                        ) : (
                                            testimonials?.map((t: any) => (
                                                <div key={t.id} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-100 flex flex-col group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <div key={i} className={`w-2 h-2 rounded-full ${i <= t.rating ? 'bg-yellow-400' : 'bg-gray-100'}`} />
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                                                            <button onClick={() => openCMSModal(t)} className="text-gray-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                                                            <button onClick={() => handleCMSAction('testimonials', 'delete', t.id)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900 mb-3 line-clamp-3">"{t.headline}"</p>
                                                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-4 italic">"{t.quote}"</p>
                                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                            {t.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-gray-900">{t.author}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold">{t.role} @ {t.company}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {contentSubTab === 'case-studies' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(caseStudies || []).length === 0 ? (
                                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                                <Briefcase className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No Case Studies Found</p>
                                            </div>
                                        ) : (
                                            caseStudies?.map((s: any) => (
                                                <div key={s.id} className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-gray-100">
                                                    <img src={s.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={s.title} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{s.client_name || 'Success Story'}</p>
                                                                <h4 className="text-xl font-black text-white">{s.title}</h4>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => openCMSModal(s)} className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20"><Pencil className="w-3.5 h-3.5" /></button>
                                                                <button onClick={() => handleCMSAction('case-studies', 'delete', s.id)} className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {contentSubTab === 'blog' && (
                                    <div className="space-y-4">
                                        {(blogPosts || []).length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                                <FileText className="w-12 h-12 text-gray-200 mb-4" />
                                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No Blog Posts Found</p>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent border-gray-50">
                                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Article</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</TableHead>
                                                        <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {blogPosts?.map((post: any) => (
                                                        <TableRow key={post.id} className="hover:bg-gray-50 border-gray-50">
                                                            <TableCell>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                                        <img src={post.image} className="w-full h-full object-cover" alt="" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-gray-900">{post.title}</p>
                                                                        <p className="text-[10px] text-gray-400 font-medium">By {post.author}</p>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge className="bg-gray-100 text-gray-600 border-none font-bold text-[10px] uppercase">{post.category}</Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1">
                                                                    {post.published ? (
                                                                        <Badge className="bg-green-50 text-green-600 border-none font-bold text-[10px] uppercase w-fit">Published</Badge>
                                                                    ) : (
                                                                        <Badge className="bg-yellow-50 text-yellow-600 border-none font-bold text-[10px] uppercase w-fit">Draft</Badge>
                                                                    )}
                                                                    {post.featured && (
                                                                        <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] uppercase w-fit flex items-center gap-1">
                                                                            <Star className="w-2.5 h-2.5 fill-current" />
                                                                            Featured
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-xs font-medium text-gray-500">
                                                                {new Date(post.createdAt || '').toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button onClick={() => openCMSModal(post)} size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-blue-600"><Pencil className="w-3.5 h-3.5" /></Button>
                                                                    <Button onClick={() => handleCMSAction('blog', 'delete', post.id)} size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="applications" className="space-y-4 mt-6">
                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className='text-black'>Candidate Applications</CardTitle>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => {
                                        talentXApi.entities.Application.getSheetUrl()
                                            .then(data => {
                                                if (data.url) window.open(data.url, '_blank');
                                                else alert('Google Sheet ID not configured in server');
                                            });
                                    }}>
                                        <ExternalLink className="w-4 h-4 mr-2" /> Google Sheet
                                    </Button>
                                    <Button onClick={fetchAppAppNotifications} variant="default" size="sm">Refresh</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-50 uppercase text-[10px] font-bold text-gray-400">
                                            <TableHead>Candidate</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Resume</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map((app) => (
                                            <TableRow key={app.id} className="border-gray-50 hover:bg-gray-50/50">
                                                <TableCell className="py-4">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{app.name}</p>
                                                        <p className="text-xs text-gray-500">{app.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`capitalize border-none ${app.type === 'talent' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                                        {app.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {app.resumeUrl ? (
                                                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-tight">
                                                            View Resume <ArrowUpRight className="w-3 h-3" />
                                                        </a>
                                                    ) : <span className="text-gray-400 italic text-xs">No upload</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${getStatusColor(app.status)}`}>
                                                        {app.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    {app.status === 'pending' && (
                                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-3 text-[10px] font-bold uppercase" onClick={() => updateAppStatus(app.id, 'accepted', app.type)}>
                                                            Approve
                                                        </Button>
                                                    )}
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => deleteApplication(app.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Hire Requests (Leads) Tab --- */}
                    <TabsContent value="hire-requests" className="space-y-4 mt-6">
                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className='text-black font-bold'>Incoming Leads</CardTitle>
                                    <p className="text-xs text-gray-500 mt-1">Direct requests from the landing page hire forms.</p>
                                </div>
                                <Button onClick={() => refetchHireRequests()} variant="outline" size="sm" className="h-8 text-xs font-bold uppercase">
                                    Refresh
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {hireRequests?.map((req: any) => (
                                        <div key={req.id} className="p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${req.hire_type === 'talent' ? 'bg-blue-50 text-blue-600' : req.hire_type === 'agency' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                                                        {req.client_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-gray-900">{req.client_name}</h4>
                                                            <Badge variant="outline" className="text-[10px] uppercase h-5">{req.hire_type}</Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-500">{req.client_email} • {req.company_name || 'Individual'}</p>
                                                        <p className="text-sm text-gray-600 mt-2 font-medium">"{req.project_description}"</p>
                                                        <div className="flex gap-6 mt-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                                                <span className="text-xs font-bold text-gray-700">{req.budget}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <ChartIcon className="w-3.5 h-3.5 text-gray-400" />
                                                                <span className="text-xs font-bold text-gray-700">{req.timeline}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${req.status === 'pending' ? 'bg-blue-100 text-blue-700' : req.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                        {req.status}
                                                    </Badge>
                                                    <div className="mt-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {req.status === 'pending' && (
                                                            <Button size="sm" variant="outline" className="h-8 text-xs font-bold" onClick={() => updateHireRequestStatus(req.id, 'reviewing')}>Mark Reviewing</Button>
                                                        )}
                                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-bold uppercase" onClick={() => updateHireRequestStatus(req.id, 'matched')}>Match Done</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!hireRequests || hireRequests.length === 0) && (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <p className="text-gray-400 font-medium">No active leads</p>
                                        </div>
                                    )}
                                </div>
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
                                            <TableRow key={u.id} className="border-gray-50 hover:bg-gray-50/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                            <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.full_name}&background=random`} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{u.full_name}</div>
                                                            <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`capitalize border-none shadow-none font-bold text-[10px] ${u.role === 'talent' ? 'bg-blue-50 text-blue-700' : u.role === 'client' ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'}`}>
                                                        {u.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        <span className={`text-xs font-bold uppercase tracking-tighter ${u.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                                                            {u.status}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-gray-500" onClick={() => handleOpenUserModal(u)}>Edit</Button>
                                                    <Button variant="ghost" size="sm" className={`h-8 text-xs font-bold ${u.status === 'active' ? 'text-orange-600' : 'text-green-600'}`} onClick={() => handleToggleUserStatus(u.id, u.status)}>
                                                        {u.status === 'active' ? 'Disable' : 'Enable'}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-600" onClick={() => handleDeleteUser(u.id, u.full_name)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
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

                    {/* --- Financials Tab --- */}
                    <TabsContent value="financials" className="space-y-4 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white border-none shadow-sm pb-4">
                                <CardHeader>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Available Balance</p>
                                    <CardTitle className="text-3xl font-black text-gray-900">$42,850.00</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-10">Withdraw Funds</Button>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-none shadow-sm pb-4">
                                <CardHeader>
                                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">In Escrow</p>
                                    <CardTitle className="text-3xl font-black text-gray-900">$18,200.00</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-400">Locked in 12 active projects</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white border-none shadow-sm pb-4">
                                <CardHeader>
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Processing</p>
                                    <CardTitle className="text-3xl font-black text-gray-900">$3,400.00</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xs text-gray-400">Clearing within 48-72 hours</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-white border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-black font-bold">Transaction History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-50 uppercase text-[10px] font-bold text-gray-400">
                                            <TableHead>Transaction</TableHead>
                                            <TableHead>Project</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects?.filter((p: any) => p.budget_spent > 0).map((project: any) => (
                                            <TableRow key={project.id} className="border-gray-50 hover:bg-gray-50/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Payment Received</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">REF: TX-{project.id.substring(0, 6)}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600 font-medium">{project.name}</TableCell>
                                                <TableCell className="text-sm font-black text-gray-900">${project.budget_spent?.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge className="bg-green-100 text-green-700 border-none text-[10px] font-bold">COMPLETED</Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-gray-400 font-bold uppercase tracking-tighter">
                                                    {new Date(project.start_date).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- Settings Tab --- */}
                    <TabsContent value="settings" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <SettingsIcon className="w-4 h-4 text-gray-400" />
                                        Platform Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Platform Commission</p>
                                                <p className="text-xs text-gray-500">Service fee taken from each payment</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-black text-blue-600">12%</span>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400"><TrendingUp className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Automatic Vetting</p>
                                                <p className="text-xs text-gray-500">AI-powered initial review for talents</p>
                                            </div>
                                            <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center px-1">
                                                <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Maintenance Mode</p>
                                                <p className="text-xs text-gray-500">Disable platform for public updates</p>
                                            </div>
                                            <div className="w-10 h-5 bg-gray-200 rounded-full flex items-center px-1">
                                                <div className="w-3 h-3 bg-white rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-gray-900 hover:bg-black text-white font-bold h-11">Save Settings</Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                        External Integrations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600 font-black">S</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Stripe Dashboard</p>
                                                <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">Connected</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="font-bold text-xs uppercase text-gray-400">Manage</Button>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                                <span className="text-green-600 font-black">G</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Google Sheets Sync</p>
                                                <p className="text-xs text-green-600 font-bold uppercase tracking-tighter">Connected</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="font-bold text-xs uppercase text-gray-400">Manage</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="messages" className="space-y-4 mt-6">
                        {user ? (
                            <MessagesView user={user} initialShowSupport={true} />
                        ) : (
                            <div className="flex items-center justify-center p-12 text-gray-400">Loading support dashboard...</div>
                        )}
                    </TabsContent>

                    <TabsContent value="audit-logs" className="mt-6">
                        <AuditLogsView
                            logs={auditLogs || []}
                            filters={auditFilters}
                            onFilterChange={setAuditFilters}
                        />
                    </TabsContent>
                </Tabs>
            )}

            {/* --- CMS Modal --- */}
            {isCMSModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white text-black rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 flex flex-col"
                    >
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                            <div>
                                <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] uppercase mb-1">CMS Management</Badge>
                                <h3 className="text-2xl font-black tracking-tight">
                                    {editingItem ? 'Edit ' : 'New '}
                                    {contentSubTab === 'faqs' && 'FAQ'}
                                    {contentSubTab === 'testimonials' && 'Testimonial'}
                                    {contentSubTab === 'case-studies' && 'Case Study'}
                                    {contentSubTab === 'blog' && 'Blog Post'}
                                </h3>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsCMSModalOpen(false)} className="rounded-full hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-400" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmitCMS} className="flex-1 overflow-y-auto p-8 space-y-6">
                            {contentSubTab === 'faqs' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Question</Label>
                                        <Input
                                            required
                                            className="h-12 rounded-xl border-gray-100 focus:border-blue-500 transition-all font-medium bg-white text-gray-900"
                                            value={cmsFormData.question}
                                            onChange={e => setCmsFormData({ ...cmsFormData, question: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Answer</Label>
                                        <Textarea
                                            required
                                            className="min-h-[150px] rounded-xl border-gray-100 focus:border-blue-500 transition-all font-medium leading-relaxed bg-white text-gray-900"
                                            value={cmsFormData.answer}
                                            onChange={e => setCmsFormData({ ...cmsFormData, answer: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</Label>
                                        <Input
                                            className="h-12 rounded-xl border-gray-100 focus:border-blue-500 transition-all font-medium bg-white text-gray-900"
                                            value={cmsFormData.category}
                                            onChange={e => setCmsFormData({ ...cmsFormData, category: e.target.value })}
                                            placeholder="General, Technical, Pricing, etc."
                                        />
                                    </div>
                                </div>
                            )}

                            {contentSubTab === 'testimonials' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author Name</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.author} onChange={e => setCmsFormData({ ...cmsFormData, author: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Company</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.company} onChange={e => setCmsFormData({ ...cmsFormData, company: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Headline</Label>
                                        <Input required className="h-12 rounded-xl md:col-span-2 bg-white text-gray-900" value={cmsFormData.headline} onChange={e => setCmsFormData({ ...cmsFormData, headline: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quote</Label>
                                        <Textarea required className="min-h-[100px] rounded-xl bg-white text-gray-900" value={cmsFormData.quote} onChange={e => setCmsFormData({ ...cmsFormData, quote: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            {contentSubTab === 'case-studies' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Title</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.title} onChange={e => setCmsFormData({ ...cmsFormData, title: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Client Name</Label>
                                        <Input className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.client_name || ''} onChange={e => setCmsFormData({ ...cmsFormData, client_name: e.target.value })} placeholder="Company or client name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Image URL</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.image} onChange={e => setCmsFormData({ ...cmsFormData, image: e.target.value })} placeholder="https://..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Company Logo URL</Label>
                                        <Input className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.logo || ''} onChange={e => setCmsFormData({ ...cmsFormData, logo: e.target.value })} placeholder="https://..." />
                                        <p className="text-xs text-gray-500 mt-1">Add a link to the company's logo image.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">YouTube Video URL</Label>
                                        <Input className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.video_url || ''} onChange={e => setCmsFormData({ ...cmsFormData, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
                                        <p className="text-xs text-gray-500 mt-1">Optional: Add a YouTube video URL to showcase the case study</p>
                                    </div>
                                </div>
                            )}

                            {contentSubTab === 'blog' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Post Title</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.title} onChange={e => setCmsFormData({ ...cmsFormData, title: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Author</Label>
                                            <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.author} onChange={e => setCmsFormData({ ...cmsFormData, author: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</Label>
                                            <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.category} onChange={e => setCmsFormData({ ...cmsFormData, category: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Image URL</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.image} onChange={e => setCmsFormData({ ...cmsFormData, image: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Excerpt</Label>
                                        <Input required className="h-12 rounded-xl bg-white text-gray-900" value={cmsFormData.excerpt} onChange={e => setCmsFormData({ ...cmsFormData, excerpt: e.target.value })} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-bold text-blue-900">Featured Post</Label>
                                            <p className="text-xs text-blue-600/70">Promote this article to the top of the blog page</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="w-10 h-6 bg-gray-200 rounded-full appearance-none cursor-pointer checked:bg-blue-600 transition-colors relative before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-transform checked:before:translate-x-4"
                                            checked={cmsFormData.featured || false}
                                            onChange={e => setCmsFormData({ ...cmsFormData, featured: e.target.checked })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Article Content (Markdown supported)</Label>
                                        <Textarea required className="min-h-[250px] rounded-xl bg-white text-gray-900" value={cmsFormData.content} onChange={e => setCmsFormData({ ...cmsFormData, content: e.target.value })} />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4 shrink-0">
                                <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-gray-100 hover:bg-gray-50" onClick={() => setIsCMSModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={cmsModalSubmitting}
                                    className="flex-[2] h-14 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                                >
                                    {cmsModalSubmitting ? 'Saving changes...' : (editingItem ? 'Update Entry' : 'Publish Entry')}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function AuditLogsView({ logs, filters, onFilterChange }: {
    logs: any[];
    filters: { entityType?: string; startDate?: string; endDate?: string };
    onFilterChange: (f: any) => void;
}) {
    return (
        <Card className="bg-white border-none shadow-sm overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            System Audit Logs
                        </CardTitle>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Track all critical administrative actions across the platform.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-blue-100 text-blue-600 font-bold">{logs.length} Results</Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] font-bold uppercase h-7 px-2 hover:bg-gray-100"
                            onClick={() => onFilterChange({ entityType: 'all', startDate: '', endDate: '' })}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</Label>
                        <select
                            className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                            value={filters.entityType}
                            onChange={(e) => onFilterChange({ ...filters, entityType: e.target.value })}
                        >
                            <option value="all">All Categories</option>
                            <option value="Project">Projects</option>
                            <option value="User">Users</option>
                            <option value="CaseStudy">Case Studies</option>
                            <option value="BlogPost">Blog Posts</option>
                            <option value="FAQ">FAQs</option>
                            <option value="Testimonial">Testimonials</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Start Date</Label>
                        <input
                            type="date"
                            className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={filters.startDate}
                            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">End Date</Label>
                        <input
                            type="date"
                            className="w-full h-10 px-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={filters.endDate}
                            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-gray-50/30">
                        <TableRow className="hover:bg-transparent border-gray-50">
                            <TableHead className="w-[180px] text-[10px] font-black uppercase tracking-widest text-gray-400">Timestamp</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Action</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400">Entity</TableHead>
                            <TableHead className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-900">{new Date(log.createdAt).toLocaleDateString()}</span>
                                        <span className="text-[10px] font-medium text-gray-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
                                            {log.admin?.avatar_url ? (
                                                <img src={log.admin.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-4 h-4 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-900">{log.admin?.full_name || 'System / Auto'}</span>
                                            <span className="text-[9px] font-medium text-gray-400 uppercase">{log.admin?.email || 'AUTOMATED'}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`font-black text-[9px] uppercase tracking-tighter border-none ${log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                                                log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-gray-700">{log.entityType}</span>
                                        <span className="text-[10px] font-medium text-gray-400 font-mono">#{log.entityId?.slice(0, 8)}...</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {log.details ? (
                                        <div className="relative group/tooltip inline-block">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 text-blue-600">
                                                <Search className="w-4 h-4" />
                                            </Button>
                                            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl text-[10px] opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 text-left font-mono whitespace-pre-wrap shadow-xl">
                                                <div className="font-bold text-blue-400 mb-1 uppercase tracking-widest border-b border-white/10 pb-1">Context Data</div>
                                                {JSON.stringify(JSON.parse(log.details), null, 2)}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-gray-300 font-bold uppercase">No Context</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {logs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-4 bg-gray-50 rounded-full">
                                            <Activity className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">No audit logs recorded yet</h4>
                                        <p className="text-xs text-gray-300 font-medium">Logs will appear here as admins perform actions.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

