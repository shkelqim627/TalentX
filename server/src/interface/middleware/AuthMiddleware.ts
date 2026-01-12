import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Extend Express Request
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
        }
    }
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    }
}

export class JWTService {
    static generateToken(userInformation: { id: string; email: string; role: string }) {
        return jwt.sign(userInformation, JWT_SECRET, { expiresIn: '24h' });
    }

    static decodeToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return null;
        }
    }

    static extractToken(req: Request) {
        // Cookie priority
        if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
        }
        // Bearer fallback
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            return req.headers.authorization.split(" ")[1];
        }
        return null;
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = JWTService.extractToken(req);
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = JWTService.decodeToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded as any;
    next();
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};
