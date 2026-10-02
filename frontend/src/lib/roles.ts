import { Room } from '@/types';

export const getRoomRole = (room: Room | null | undefined, user: { id: string } | null | undefined) => {
    if (!room || !user) return { isCreator: false, isAdmin: false, isMember: false, role: null };

    const isCreator = room.createdBy === user.id;
    const currentMemberRecord = room.members?.find((m) => m.userId === user.id);
    const role = currentMemberRecord?.role || null;

    const isAdmin = isCreator || role === 'ADMIN';
    const isMember = isCreator || !!currentMemberRecord;

    return { isCreator, isAdmin, isMember, role };
};
