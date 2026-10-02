import { z } from 'zod';
import { RoomRole } from '../models';

export const createRoomSchema = z.object({
    name: z.string().min(2, 'Room name must be at least 2 characters').max(100, 'Room name is too long'),
    description: z.string().max(1000, 'Description is too long').optional(),
});

export const updateRoomSchema = z.object({
    name: z.string().min(2, 'Room name must be at least 2 characters').max(100, 'Room name is too long').optional(),
    description: z.string().max(1000, 'Description is too long').optional(),
});

export const addRoomMemberSchema = z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    role: z.nativeEnum(RoomRole),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type AddRoomMemberInput = z.infer<typeof addRoomMemberSchema>;