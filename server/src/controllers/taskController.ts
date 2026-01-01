import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const listTasks = async (req: AuthRequest, res: Response) => {
    const { project_id } = req.query;
    try {
        const tasks = await prisma.task.findMany({
            where: project_id ? { projectId: project_id as string } : {},
            include: {
                assignee: {
                    select: {
                        id: true,
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    const { project_id, title, description, status, priority, due_date, assignee_id } = req.body;
    try {
        const task = await prisma.task.create({
            data: {
                projectId: project_id,
                title,
                description,
                status: status || 'todo',
                priority: priority || 'medium',
                due_date: due_date ? new Date(due_date) : null,
                assigneeId: assignee_id,
            },
            include: { project: true }
        });

        if (assignee_id) {
            await prisma.notification.create({
                data: {
                    type: 'task_assigned',
                    content: `You have been assigned a new task: "${task.title}" in project "${task.project.name}"`,
                    userId: assignee_id,
                    data: JSON.stringify({ taskId: task.id, projectId: task.projectId })
                }
            });
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assignee_id } = req.body;

    try {
        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (priority !== undefined) updateData.priority = priority;
        if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date) : null;
        if (assignee_id !== undefined) updateData.assigneeId = assignee_id;

        const task = await prisma.task.update({
            where: { id },
            data: updateData,
            include: { project: true }
        });

        // 2. Notify assignee if changed
        if (assignee_id && task.assigneeId === assignee_id) {
            await prisma.notification.create({
                data: {
                    type: 'task_assigned',
                    content: `You have been assigned a new task: "${task.title}" in project "${task.project.name}"`,
                    userId: assignee_id,
                    data: JSON.stringify({ taskId: task.id, projectId: task.projectId })
                }
            });
        }

        res.json(task);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.task.delete({
            where: { id },
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
