import { Request, Response } from 'express';
import { UserService } from '../../application/services/UserService';
import { UpdateUserSchema } from '../../application/dtos/UserDTO';
import { AuthRequest } from '../middleware/AuthMiddleware';

export class UserController {
    constructor(private userService: UserService) { }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching users' });
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            res.json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message || 'User not found' });
        }
    };

    updateUser = async (req: AuthRequest, res: Response) => {
        try {
            const validationResult = UpdateUserSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ errors: (validationResult.error as any).errors });
            }

            const updatedUser = await this.userService.updateUser(req.user!.id, req.params.id, validationResult.data);
            res.json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating user' });
        }
    };

    deleteUser = async (req: AuthRequest, res: Response) => {
        try {
            await this.userService.deleteUser(req.user!.id, req.params.id);
            res.json({ message: 'User deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error deleting user' });
        }
    };
}
