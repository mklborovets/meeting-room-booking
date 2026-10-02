import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';
import { ApiError } from '../errors/ApiError';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { env } from '../config/env';

export class AuthService {
    private static generateToken(user: User): string {
        const options: SignOptions = {
            expiresIn: env.JWT_EXPIRES_IN as any,
        };

        return jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            env.JWT_SECRET,
            options
        );
    }

    static async register(data: RegisterInput) {
        const existingUser = await User.findOne({ where: { email: data.email } });
        if (existingUser) {
            throw new ApiError(409, 'User with this email already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await User.create({
            name: data.name,
            email: data.email,
            passwordHash,
        });

        const token = this.generateToken(user);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }

    static async login(data: LoginInput) {
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const token = this.generateToken(user);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }

    static async getCurrentUser(userId: string) {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'createdAt'],
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return user;
    }
}