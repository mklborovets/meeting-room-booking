import { sequelize } from '../config/database';
import { Room, RoomMember, RoomRole, User, Booking } from '../models';
import { ApiError } from '../errors/ApiError';
import { checkRoomPermission } from '../utils/permissions';
import {
    CreateRoomInput,
    UpdateRoomInput,
    AddRoomMemberInput,
} from '../schemas/room.schema';

export class RoomService {
    static async createRoom(userId: string, data: CreateRoomInput) {
        const room = await sequelize.transaction(async (t) => {
            const newRoom = await Room.create(
                {
                    name: data.name,
                    description: data.description || '',
                    createdBy: userId,
                },
                { transaction: t }
            );

            await RoomMember.create(
                {
                    roomId: newRoom.id,
                    userId,
                    role: RoomRole.ADMIN,
                },
                { transaction: t }
            );

            return newRoom;
        });

        return this.getRoomById(room.id, userId);
    }

    static async getAllRooms(userId: string) {
        return Room.findAll({
            where: {
                '$members.userId$': userId
            },
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: RoomMember,
                    as: 'members',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    }

    static async getRoomById(roomId: string, userId: string) {
        await checkRoomPermission(roomId, userId, [RoomRole.ADMIN, RoomRole.USER]);

        const room = await Room.findByPk(roomId, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: RoomMember,
                    as: 'members',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name', 'email'],
                        },
                    ],
                },
            ],
        });

        if (!room) {
            throw new ApiError(404, 'Meeting room not found');
        }

        return room;
    }

    static async updateRoom(roomId: string, userId: string, data: UpdateRoomInput) {
        await checkRoomPermission(roomId, userId, [RoomRole.ADMIN]);
        const room = await Room.findByPk(roomId);
        if (!room) {
            throw new ApiError(404, 'Meeting room not found');
        }

        await room.update(data);
        return this.getRoomById(roomId, userId);
    }

    static async deleteRoom(roomId: string, userId: string) {
        await checkRoomPermission(roomId, userId, [RoomRole.ADMIN]);
        const room = await Room.findByPk(roomId);
        if (!room) {
            throw new ApiError(404, 'Meeting room not found');
        }

        await room.destroy();
    }

    static async addMemberByEmail(roomId: string, requesterUserId: string, data: AddRoomMemberInput) {
        await checkRoomPermission(roomId, requesterUserId, [RoomRole.ADMIN]);
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            throw new ApiError(404, 'User with this email does not exist');
        }

        const existingMembership = await RoomMember.findOne({
            where: { roomId, userId: user.id },
        });

        if (existingMembership) {
            const room = await Room.findByPk(roomId);
            if (user.id === room?.createdBy && data.role !== RoomRole.ADMIN) {
                throw new ApiError(403, 'The creator of the room must remain an ADMIN');
            }
            if (existingMembership.role === RoomRole.ADMIN && data.role !== RoomRole.ADMIN && requesterUserId !== room?.createdBy) {
                throw new ApiError(403, 'Only the room creator can downgrade other administrators');
            }
            existingMembership.role = data.role;
            await existingMembership.save();
        } else {
            await RoomMember.create({
                roomId,
                userId: user.id,
                role: data.role,
            });
        }

        return this.getRoomById(roomId, requesterUserId);
    }

    static async removeMember(roomId: string, targetUserId: string, requesterUserId: string) {
        await checkRoomPermission(roomId, requesterUserId, [RoomRole.ADMIN]);
        const room = await Room.findByPk(roomId);
        if (!room) {
            throw new ApiError(404, 'Meeting room not found');
        }

        if (targetUserId === room.createdBy) {
            throw new ApiError(403, 'The creator of the room cannot be removed');
        }

        const targetMembership = await RoomMember.findOne({
            where: { roomId, userId: targetUserId },
        });

        if (!targetMembership) {
            throw new ApiError(404, 'Member not found in this room');
        }

        if (requesterUserId !== room.createdBy && targetMembership.role === RoomRole.ADMIN) {
            throw new ApiError(403, 'Only the room creator can remove other administrators');
        }

        await targetMembership.destroy();
    }
}
