import { sequelize } from '../config/database';
import { Room, RoomMember, RoomRole, User, Booking } from '../models';
import { ApiError } from '../middlewares/error.middleware';
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

    static async getAllRooms() {
        return Room.findAll({
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
                {
                    model: Booking,
                    as: 'bookings',
                    include: [
                        {
                            model: User,
                            as: 'creator',
                            attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: User,
                            as: 'participants',
                            attributes: ['id', 'name', 'email'],
                            through: { attributes: [] },
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

    static async addMemberByEmail(roomId: string, data: AddRoomMemberInput) {
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            throw new ApiError(404, 'User with this email does not exist');
        }

        const existingMembership = await RoomMember.findOne({
            where: { roomId, userId: user.id },
        });

        if (existingMembership) {
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

    static async removeMember(roomId: string, targetUserId: string) {
        const membership = await RoomMember.findOne({
            where: { roomId, userId: targetUserId },
        });

        if (!membership) {
            throw new ApiError(404, 'Member not found in this room');
        }

        await membership.destroy();
    }
}