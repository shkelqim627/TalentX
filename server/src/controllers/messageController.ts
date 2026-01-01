import { Response, Request } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/auth';

export const listMessages = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { isSupport, type, userId: threadUserId } = req.query;

    try {
        let where: any = {};

        if (isSupport === 'true') {
            if (userRole === 'admin') {
                if (type === 'threads') {
                    // Get all unique users who sent messages to support
                    const threads = await prisma.message.findMany({
                        where: { receiverId: 'support-system-user-id-001' },
                        distinct: ['senderId'],
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    full_name: true,
                                    avatar_url: true,
                                }
                            }
                        },
                        orderBy: { timestamp: 'desc' }
                    });

                    const formattedThreads = threads.map(t => ({
                        userId: t.senderId,
                        userName: t.sender.full_name,
                        userAvatar: t.sender.avatar_url,
                        lastMessage: t.content
                    }));

                    return res.json(formattedThreads);
                }

                if (threadUserId) {
                    where = {
                        OR: [
                            { senderId: threadUserId as string, receiverId: 'support-system-user-id-001' },
                            { senderId: 'support-system-user-id-001', receiverId: threadUserId as string }
                        ]
                    };
                } else {
                    // Default to all support if no thread selected (or empty)
                    where = {
                        OR: [
                            { receiverId: 'support-system-user-id-001' },
                            { senderId: 'support-system-user-id-001' }
                        ]
                    };
                }
            } else {
                // Clients see their support thread
                where = {
                    OR: [
                        { senderId: userId, receiverId: 'support-system-user-id-001' },
                        { senderId: 'support-system-user-id-001', receiverId: userId }
                    ]
                };
            }
        } else {
            // Normal DMs
            where = {
                AND: [
                    {
                        OR: [
                            { senderId: userId },
                            { receiverId: userId },
                        ]
                    },
                    {
                        NOT: [
                            { receiverId: 'support-system-user-id-001' },
                            { senderId: 'support-system-user-id-001' }
                        ]
                    }
                ]
            };
        }

        const messages = await prisma.message.findMany({
            where,
            include: {
                sender: {
                    select: {
                        id: true,
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
            orderBy: { timestamp: 'asc' }
        });

        const formattedMessages = messages.map((m) => ({
            ...m,
            sender_name: m.senderId === 'support-system-user-id-001' ? 'Admin Support' : m.sender?.full_name || 'System',
            sender_avatar: m.senderId === 'support-system-user-id-001' ? 'https://ui-avatars.com/api/?name=Admin+Support&background=00c853&color=fff' : m.sender?.avatar_url,
        }));

        res.json(formattedMessages);
    } catch (error) {
        console.error('List messages error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
    const senderId = req.user?.id;
    const userRole = req.user?.role;
    const { receiver_id, content, isSupport } = req.body;

    try {
        // Handle admin replying as 'support'
        const actualSenderId = (isSupport && userRole === 'admin') ? 'support-system-user-id-001' : senderId!;
        const actualReceiverId = (isSupport && userRole !== 'admin') ? 'support-system-user-id-001' : receiver_id;

        const message = await prisma.message.create({
            data: {
                senderId: actualSenderId,
                receiverId: actualReceiverId,
                content,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        full_name: true,
                        avatar_url: true,
                    },
                },
            },
        });

        // Notify Admins for new support tickets
        if (isSupport && userRole !== 'admin') {
            const admins = await prisma.user.findMany({ where: { role: 'admin' } });
            await prisma.notification.createMany({
                data: admins.map(admin => ({
                    userId: admin.id,
                    type: 'support_ticket',
                    content: `New support ticket from ${message.sender.full_name}: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                    data: JSON.stringify({ senderId: senderId, messageId: message.id })
                }))
            });
        }

        const formattedMessage = {
            ...message,
            sender_name: message.sender.full_name,
            sender_avatar: message.sender.avatar_url,
        };

        res.status(201).json(formattedMessage);
    } catch (error) {
        console.error('Create message error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const [generalCount, supportCount] = await Promise.all([
            // General messages (exclude support)
            prisma.message.count({
                where: {
                    receiverId: userId,
                    read: false,
                    NOT: [
                        { senderId: 'support-system-user-id-001' },
                        { receiverId: 'support-system-user-id-001' }
                    ]
                }
            }),
            // Support messages (from support to user, or for admins all to support)
            prisma.message.count({
                where: {
                    receiverId: req.user?.role === 'admin' ? 'support-system-user-id-001' : userId,
                    read: false,
                    senderId: req.user?.role === 'admin' ? { not: 'support-system-user-id-001' } : 'support-system-user-id-001'
                }
            })
        ]);

        res.json({ general: generalCount, support: supportCount });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const markMessagesAsRead = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { isSupport, threadUserId } = req.body;

    try {
        let where: any = { read: false };

        if (isSupport) {
            if (req.user?.role === 'admin') {
                // Admin marks client messages as read in a specific thread
                where = {
                    ...where,
                    senderId: threadUserId,
                    receiverId: 'support-system-user-id-001'
                };
            } else {
                // Client/Talent marks admin support replies as read
                where = {
                    ...where,
                    senderId: 'support-system-user-id-001',
                    receiverId: userId
                };
            }
        } else {
            // Mark all regular DMs to this user as read
            where = {
                ...where,
                receiverId: userId,
                NOT: [
                    { senderId: 'support-system-user-id-001' },
                    { receiverId: 'support-system-user-id-001' }
                ]
            };
        }

        await prisma.message.updateMany({
            where,
            data: { read: true }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
