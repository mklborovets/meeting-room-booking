import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { env } from '../config/env';

const parseMaxAge = (str: string) => {
    const match = str.match(/^(\d+)([dhms])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const val = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'd') return val * 24 * 60 * 60 * 1000;
    if (unit === 'h') return val * 60 * 60 * 1000;
    if (unit === 'm') return val * 60 * 1000;
    if (unit === 's') return val * 1000;
    return 7 * 24 * 60 * 60 * 1000;
};

export class AuthController {
    private static setTokenCookie(res: Response, token: string) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: parseMaxAge(env.JWT_EXPIRES_IN),
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
