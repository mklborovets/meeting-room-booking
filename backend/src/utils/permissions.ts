import { RoomMember, RoomRole } from '../models';
import { ApiError } from '../errors/ApiError';

export const checkRoomPermission = async (
    roomId: string,
    userId: string,
    allowedRoles: RoomRole[]
) => {
    const membership = await RoomMember.findOne({
        where: { roomId, userId },
    });

    if (!membership || !allowedRoles.includes(membership.role)) {
        throw new ApiError(
            403,
            'You do not have permission to perform this action in this room'
        );
    }

    return membership.role;
};
