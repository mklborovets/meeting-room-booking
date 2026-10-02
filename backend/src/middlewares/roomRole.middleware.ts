import { Request, Response, NextFunction } from 'express';
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

export const requireRoomRole = (allowedRoles: RoomRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const roomId = (req.params.roomId || req.params.id) as string;

        if (!userId) {
            return next(new ApiError(401, 'Authentication required'));
        }

        if (!roomId) {
            return next(new ApiError(400, 'Room ID is required'));
        }

        try {
            await checkRoomPermission(
                roomId,
                userId,
                allowedRoles
            );
            next();
        } catch (error) {
            next(error);
        }
    };
};