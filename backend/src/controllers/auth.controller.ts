import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { env } from '../config/env';

export class AuthController {
    private static setTokenCookie(res: Response, token: string) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    static async register(req: Request, res: Response) {
        const { user, token } = await AuthService.register(req.body);
        AuthController.setTokenCookie(res, token);
        res.status(201).json({ user });
    }

    static async login(req: Request, res: Response) {
        const { user, token } = await AuthService.login(req.body);
        AuthController.setTokenCookie(res, token);
        res.status(200).json({ user });
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }

    static async getMe(req: Request, res: Response) {
        const user = await AuthService.getCurrentUser(req.user!.id);
        res.status(200).json({ user });
    }
}