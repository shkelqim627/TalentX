import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { CreateTaskDTO, UpdateTaskDTO } from '../dtos/TaskDTO';

export class TaskService {
    constructor(
        private taskRepo: ITaskRepository,
        private notificationRepo: INotificationRepository
    ) { }

    async createTask(dto: CreateTaskDTO) {
        const taskData = {
            projectId: dto.project_id, // Map snake_case DTO to camelCase DB
            title: dto.title,
            description: dto.description,
            status: dto.status,
            priority: dto.priority,
            due_date: dto.due_date ? new Date(dto.due_date) : undefined,
            assigneeId: dto.assignee_id
        };

        const task = await this.taskRepo.create(taskData);

        // Notify assignee
        if (task.assigneeId) {
            await this.notificationRepo.create({
                type: 'task_assigned',
                content: `You have been assigned a new task: "${task.title}" in project "${task.project?.name}"`,
                userId: task.assigneeId,
                data: JSON.stringify({ taskId: task.id, projectId: task.projectId })
            });
        }

        return task;
    }

    async updateTask(id: string, dto: UpdateTaskDTO) {
        // Fetch current task to check assignee change if needed, optimizing by just notifying if new assignee
        // Or matching legacy exactly which checks (assignee_id && task.assigneeId === assignee_id) -> Wait logic in legacy was notifying if "assignee_id" passed matches existing? 
        // Logic: if (assignee_id && task.assigneeId === assignee_id) ... wait line 80 in legacy
        // "if (assignee_id && task.assigneeId === assignee_id)" -> This implies notifying if it REMAINS the same? Or typo in legacy?
        // Likely intended: if assignee changed OR if just assigned.
        // Let's implement standard "Assignee Notification"

        const updateData: any = {};
        if (dto.title !== undefined) updateData.title = dto.title;
        if (dto.description !== undefined) updateData.description = dto.description;
        if (dto.status !== undefined) updateData.status = dto.status;
        if (dto.priority !== undefined) updateData.priority = dto.priority;
        if (dto.due_date !== undefined) updateData.due_date = dto.due_date ? new Date(dto.due_date) : null;
        if (dto.assignee_id !== undefined) updateData.assigneeId = dto.assignee_id;

        const updatedTask = await this.taskRepo.update(id, updateData);

        if (dto.assignee_id) { // If assignee was part of update
            await this.notificationRepo.create({
                type: 'task_assigned',
                content: `You have been assigned a new task: "${updatedTask.title}" in project "${updatedTask.project?.name}"`,
                userId: updatedTask.assigneeId,
                data: JSON.stringify({ taskId: updatedTask.id, projectId: updatedTask.projectId })
            });
        }

        return updatedTask;
    }

    async listTasks(projectId?: string) {
        return this.taskRepo.findAllByProject(projectId);
    }

    async deleteTask(id: string) {
        return this.taskRepo.delete(id);
    }
}
