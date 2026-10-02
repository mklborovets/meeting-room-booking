import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { env } from '../config/env';

interface JwtPayload {
    id: string;
    email: string;
    name: string;
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            throw new ApiError(401, 'Authentication required');
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
        };

        next();
    } catch (error) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(401, 'Invalid or expired token'));
    }
};