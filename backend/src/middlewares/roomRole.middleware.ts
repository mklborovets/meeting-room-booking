import { Request, Response, NextFunction } from 'express';
import { RoomMember, RoomRole, Room } from '../models';
import { ApiError } from './error.middleware';

export const requireRoomRole = (allowedRoles: RoomRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const roomId = (req.params.roomId || req.params.id) as string;

            if (!userId) {
                throw new ApiError(401, 'Authentication required');
            }

            if (!roomId) {
                throw new ApiError(400, 'Room ID is required');
            }

            const room = await Room.findByPk(roomId);
            if (!room) {
                throw new ApiError(404, 'Meeting room not found');
            }

            const membership = await RoomMember.findOne({
                where: { roomId, userId },
            });

            if (!membership || !allowedRoles.includes(membership.role)) {
                throw new ApiError(
                    403,
                    'You do not have permission to perform this action in this room'
                );
            }

            req.roomRole = membership.role;
            next();
        } catch (error) {
            next(error);
        }
    };
};