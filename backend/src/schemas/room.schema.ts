import { z } from 'zod';
import { RoomRole } from '../models';

export const createRoomSchema = z.object({
    name: z.string().min(2, 'Room name must be at least 2 characters'),
    description: z.string().optional(),
});

export const updateRoomSchema = z.object({
    name: z.string().min(2, 'Room name must be at least 2 characters').optional(),
    description: z.string().optional(),
});

export const addRoomMemberSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.nativeEnum(RoomRole),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type AddRoomMemberInput = z.infer<typeof addRoomMemberSchema>;