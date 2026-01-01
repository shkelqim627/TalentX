import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import Stripe from 'stripe';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export const register = async (req: Request, res: Response) => {
    const { email, password, full_name, role, ...additionalData } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const avatar_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random`;

        // Transaction to ensure both user and role-specific record are created
        const result = await prisma.$transaction(async (tx) => {
            // Create Stripe customer for clients
            let stripeCustomerId = null;
            if (role === 'client') {
                try {
                    const customer = await stripe.customers.create({
                        email,
                        name: full_name,
                        metadata: {
                            company_name: additionalData.company_name || ''
                        }
                    });
                    stripeCustomerId = customer.id;
                } catch (stripeError) {
                    console.error('Stripe customer creation error:', stripeError);
                }
            }

            const user = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    full_name,
                    role,
                    avatar_url,
                    stripeCustomerId,
                },
            });

            if (role === 'talent') {
                await tx.talent.create({
                    data: {
                        userId: user.id,
                        title: additionalData.title || 'Freelancer',
                        category: additionalData.category || 'developer',
                        expertise: additionalData.expertise || '[]',
                    },
                });
            } else if (role === 'agency') {
                await tx.agency.create({
                    data: {
                        userId: user.id,
                        agency_name: additionalData.agency_name || `${full_name}'s Agency`,
                    },
                });
            }

            // Create notification for admin
            await tx.notification.create({
                data: {
                    type: 'account_created',
                    content: `New ${role} account created: ${full_name} (${email})`,
                    data: JSON.stringify({
                        userId: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role,
                        company_name: additionalData.company_name || additionalData.agency_name || null
                    })
                }
            });

            return user;
        });

        const token = jwt.sign(
            { id: result.id, email: result.email, role: result.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = result;
        res.status(201).json({ user: userWithoutPassword, token });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.status === 'disabled') {
            return res.status(403).json({ message: 'This account has been disabled by an administrator' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const me = async (req: any, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                full_name: true,
                role: true,
                avatar_url: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
