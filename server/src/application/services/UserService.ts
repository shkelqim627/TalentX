import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateUserDTO } from '../dtos/UserDTO';
import { AuditLogService } from './AuditLogService';
import bcrypt from 'bcryptjs';

export class UserService {
    constructor(
        private userRepo: IUserRepository,
        private auditLogService: AuditLogService
    ) { }

    async getAllUsers() {
        return this.userRepo.findAll();
    }

    async getUserById(id: string) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("User not found");
        return user;
    }

    async updateUser(adminId: string, id: string, dto: UpdateUserDTO) {
        // Handle Password Hashing if present
        let updateData: any = { ...dto };
        if ((dto as any).password) {
            updateData.password = await bcrypt.hash((dto as any).password, 10);
        }
        const result = await this.userRepo.update(id, updateData);
        await this.auditLogService.logAction(adminId, 'UPDATE', 'User', id, { ...dto, password: (dto as any).password ? '****' : undefined });
        return result;
    }

    async deleteUser(adminId: string, id: string) {
        const user = await this.userRepo.findById(id);
        const result = await this.userRepo.delete(id);
        await this.auditLogService.logAction(adminId, 'DELETE', 'User', id, { name: user?.full_name, email: user?.email });
        return result;
    }
}
