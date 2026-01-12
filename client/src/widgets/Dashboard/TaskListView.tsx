import React from 'react';
import { Task } from '@/shared/types';
import { Clock, AlertCircle, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import { Button } from "@/shared/components/ui/button";

interface TaskListViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

const statusIcons = {
    todo: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50' },
    in_progress: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    review: { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    done: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' }
};

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onTaskClick }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Assignee</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => {
                        const { icon: StatusIcon, color: statusColor, bg: statusBg } = statusIcons[task.status];
                        return (
                            <tr
                                key={task.id}
                                onClick={() => onTaskClick(task)}
                                className="group hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#1a1a2e] group-hover:text-[#204ecf] transition-colors line-clamp-1">{task.title}</span>
                                        <span className="text-xs text-gray-400 line-clamp-1 mt-0.5">{task.description || 'No description'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg ${statusBg}`}>
                                        <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                                        <span className={`text-xs font-bold capitalize ${statusColor}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                            task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                                'bg-blue-50 text-blue-600'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={task.assignee?.avatar_url || `https://ui-avatars.com/api/?name=${task.assignee?.full_name || 'Unassigned'}&background=random`}
                                            className="w-6 h-6 rounded-full border border-gray-200"
                                            alt="Assignee"
                                        />
                                        <span className="text-xs font-medium text-gray-600">{task.assignee?.full_name || 'Unassigned'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'No date'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-gray-600">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                                No tasks found in this view.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskListView;
