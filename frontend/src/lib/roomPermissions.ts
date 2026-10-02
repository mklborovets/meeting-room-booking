import { Room, RoomMember, User } from '@/types';

export interface NormalizedMember {
    userId: number;
    role: 'ADMIN' | 'USER';
    name: string;
    email: string;
}

export function normalizeRoomMembers(room?: Room | null): NormalizedMember[] {
    if (!room) return [];

    const rawMembers =
        (room as unknown as { members?: unknown[]; roomMembers?: unknown[] })
            .members ||
        (room as unknown as { roomMembers?: unknown[] }).roomMembers ||
        [];

    return rawMembers.map((item: any) => {
        if (item.userId !== undefined) {
            return {
                userId: Number(item.userId),
                role: item.role === 'ADMIN' ? 'ADMIN' : 'USER',
                name: item.user?.name || item.name || `User #${item.userId}`,
                email: item.user?.email || item.email || '',
            };
        }

        const throughRole =
            item.RoomMember?.role || item.roomMember?.role || item.role;
        return {
            userId: Number(item.id),
            role: throughRole === 'ADMIN' ? 'ADMIN' : 'USER',
            name: item.name || `User #${item.id}`,
            email: item.email || '',
        };
    });
}

export function isUserRoomAdmin(
    room?: Room | null,
    currentUser?: User | null
): boolean {
    if (!room || !currentUser || !currentUser.id) return false;

    const currentUserId = Number(currentUser.id);
    if (Number(room.createdBy) === currentUserId) {
        return true;
    }

    const members = normalizeRoomMembers(room);
    const memberRecord = members.find((m) => m.userId === currentUserId);
    return memberRecord?.role === 'ADMIN';
}