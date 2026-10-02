import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    DB_SSL_REJECT_UNAUTHORIZED: z.string().default('false').transform(val => val === 'true')
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('Invalid environment variables:\n', _env.error.format());
    process.exit(1);
}

export const env = _env.data;
