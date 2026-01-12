import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../domain/repositories/IUserRepository'; // We may need to extend this repo
import { INotificationRepository } from '../../domain/repositories/INotificationRepository';
import { StripeService } from '../../infrastructure/external-services/StripeService';
import { RegisterDTO, LoginDTO } from '../dtos/AuthDTO';
import { JWTService } from '../../interface/middleware/AuthMiddleware';

// We might need to extend IUserRepository to support full creation logic or keep using Prisma directly in repo?
// For pure clean arch, we should add `createFullUser` to IUserRepository.
// For now, I'll assume we can add methods to PrismaUserRepository or use a temporary specialized AuthRepo.
// Let's add `create` to IUserRepository (it previously had `createUserFromApplication`).

export class AuthService {
    constructor(
        private userRepo: IUserRepository,
        private notificationRepo: INotificationRepository,
        private stripeService: StripeService
    ) { }

    async register(dto: RegisterDTO) {
        // 1. Check if exists
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw new Error("User already exists");
        }

        // 2. Stripe Customer (if client)
        let stripeCustomerId = null;
        if (dto.role === 'client') {
            stripeCustomerId = await this.stripeService.createCustomer(dto.email, dto.full_name, {
                company_name: dto.company_name || ""
            });
        }

        // 3. Create User (Delegated to Repo)
        // We need a generic create method on Repo.
        // Assuming IUserRepository has `create` (I will update it).
        const newUser = await (this.userRepo as any).create({
            ...dto,
            stripeCustomerId
        });

        // 4. Notification
        await this.notificationRepo.create({
            type: "account_created",
            content: `New ${dto.role} account created: ${dto.full_name} (${dto.email})`,
            data: JSON.stringify({ userId: newUser.id })
        });

        // 5. Generate Token
        const token = JWTService.generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        });

        const { password, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword, token };
    }

    async login(dto: LoginDTO) {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (user.status === 'disabled') {
            throw new Error("This account has been disabled by an administrator");
        }

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) {
            throw new Error("Invalid email or password");
        }

        const token = JWTService.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

        return { user: { id: user.id, email: user.email, role: user.role }, token };
    }
}
