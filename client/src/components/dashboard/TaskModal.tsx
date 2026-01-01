import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Task, User, Project } from '@/types';

interface TaskModalProps {
    task: Task | null;
    user: User;
    teamMembers: any[];
    onClose: () => void;
    onSave: (data: any) => void;
    onDelete?: (id: string) => void;
    isSaving: boolean;
    readOnly?: boolean;
}

export default function TaskModal({ task, user, teamMembers, onClose, onSave, onDelete, isSaving, readOnly = false }: TaskModalProps) {
    const isEdit = !!task;
    const isReadOnly = readOnly;

    const [taskData, setTaskData] = useState<{
        title: string;
        description: string;
        assigneeId: string;
        priority: 'low' | 'medium' | 'high';
        due_date: string;
    }>({
        title: task?.title || '',
        description: task?.description || '',
        assigneeId: task?.assignee?.id || '',
        priority: task?.priority || 'medium',
        due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;
        onSave(taskData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#204ecf]">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a2e]">
                            {isReadOnly ? 'Task Details' : isEdit ? 'Edit Task' : 'Create New Task'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Plus className="w-6 h-6 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 text-black">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Task Summary</label>
                                <input
                                    type="text"
                                    required
                                    disabled={isReadOnly}
                                    value={taskData.title}
                                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] focus:border-transparent outline-none transition-all font-medium disabled:bg-gray-50 bg-white"
                                    placeholder="What needs to be done?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={8}
                                    disabled={isReadOnly}
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#204ecf] focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed disabled:bg-gray-50 bg-white"
                                    placeholder="Add a detailed description..."
                                />
                                <p className="text-xs text-gray-400 mt-2 text-right">Markdown supported</p>
                            </div>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl h-fit border border-gray-100">
                            {user.role !== 'agency' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assignee</label>
                                    <select
                                        disabled={isReadOnly}
                                        value={taskData.assigneeId}
                                        onChange={(e) => setTaskData({ ...taskData, assigneeId: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#204ecf] outline-none disabled:opacity-70 disabled:bg-gray-100"
                                    >
                                        <option value="">Unassigned</option>
                                        {teamMembers?.map((m: any) => (
                                            <option key={m.id} value={m.id}>{m.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                                <select
                                    disabled={isReadOnly}
                                    value={taskData.priority}
                                    onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#204ecf] outline-none disabled:opacity-70 disabled:bg-gray-100"
                                >
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                                <input
                                    type="date"
                                    disabled={isReadOnly}
                                    value={taskData.due_date}
                                    onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#204ecf] outline-none disabled:opacity-70 disabled:bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            {isReadOnly ? 'Close' : 'Cancel'}
                        </Button>
                        {!isReadOnly && isEdit && onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => task?.id && onDelete(task.id)}
                                disabled={isSaving}
                                className="mr-auto"
                            >
                                Delete Task
                            </Button>
                        )}
                        {!isReadOnly && (
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="bg-[#204ecf] hover:bg-[#1a3da8] text-white px-8 transition-all"
                            >
                                {isSaving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
                            </Button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
