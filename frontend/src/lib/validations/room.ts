import { z } from 'zod';

export const roomSchema = z.object({
    name: z
        .string()
        .min(2, 'Room name must be at least 2 characters')
        .max(100, 'Room name must be under 100 characters'),
    description: z
        .string()
        .max(500, 'Description must be under 500 characters')
        .optional(),
});

export const addMemberSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['ADMIN', 'USER']),
});

export type RoomFormValues = z.infer<typeof roomSchema>;
export type AddMemberFormValues = z.infer<typeof addMemberSchema>;