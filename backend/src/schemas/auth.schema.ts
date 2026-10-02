import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.string().trim().toLowerCase().email('Invalid email address').max(100, 'Email is too long'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address').max(100, 'Email is too long'),
    password: z.string().min(1, 'Password is required').max(100, 'Password is too long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
