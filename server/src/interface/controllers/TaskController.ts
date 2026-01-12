import { Request, Response } from 'express';
import { TaskService } from '../../application/services/TaskService';
import { CreateTaskSchema, UpdateTaskSchema } from '../../application/dtos/TaskDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class TaskController {
    constructor(private taskService: TaskService) { }

    createTask = async (req: AuthRequest, res: Response) => {
        try {
            const validation = CreateTaskSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const task = await this.taskService.createTask(validation.data);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error creating task' });
        }
    };

    listTasks = async (req: AuthRequest, res: Response) => {
        try {
            const project_id = req.query.project_id as string | undefined;
            const tasks = await this.taskService.listTasks(project_id);
            res.json(tasks);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error listing tasks' });
        }
    };

    updateTask = async (req: AuthRequest, res: Response) => {
        try {
            const validation = UpdateTaskSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ errors: (validation.error as any).errors });
            }
            const task = await this.taskService.updateTask(req.params.id, validation.data);
            res.json(task);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating task' });
        }
    };

    deleteTask = async (req: AuthRequest, res: Response) => {
        try {
            await this.taskService.deleteTask(req.params.id);
            res.json({ message: 'Task deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error deleting task' });
        }
    };
}
