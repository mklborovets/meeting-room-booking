import { sequelize } from '../config/database';
import { Room, RoomMember, RoomRole, User, Booking } from '../models';
import { ApiError } from '../errors/ApiError';
import {
    CreateRoomInput,
    UpdateRoomInput,
    AddRoomMemberInput,
} from '../schemas/room.schema';

export class RoomService {
    static async createRoom(userId: string, data: CreateRoomInput) {
        const transaction = await sequelize.transaction();

        try {
            const room = await Room.create(
                {
                    name: data.name,
                    description: data.description || '',
                    createdBy: userId,
                },
                { transaction }
            );

            await RoomMember.create(
                {
                    roomId: room.id,
                    userId,
                    role: RoomRole.ADMIN,
                },
                { transaction }
            );

            await transaction.commit();
            return this.getRoomById(room.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getAllRooms(userId: string) {
        const memberships = await RoomMember.findAll({ where: { userId } });
        const roomIds = memberships.map(m => m.roomId);

        if (roomIds.length === 0) {
            return [];
        }

        return Room.findAll({
            where: { id: roomIds },
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

    static async getRoomById(roomId: string) {
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

    static async updateRoom(roomId: string, data: UpdateRoomInput) {
        const room = await Room.findByPk(roomId);
        if (!room) {
            throw new ApiError(404, 'Meeting room not found');
        }

        await room.update(data);
        return this.getRoomById(roomId);
    }

    static async deleteRoom(roomId: string) {
        const room = await Room.findByPk(roomId);
        if (!room) {
            throw new ApiError(404, 'Meeting room not found');
        }

        await room.destroy();
    }

    static async addMemberByEmail(roomId: string, requesterUserId: string, data: AddRoomMemberInput) {
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

        return this.getRoomById(roomId);
    }

    static async removeMember(roomId: string, targetUserId: string, requesterUserId: string) {
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