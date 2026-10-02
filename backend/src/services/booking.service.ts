import { Op } from 'sequelize';
import {
    Booking,
    BookingParticipant,
    Room,
    RoomMember,
    RoomRole,
    User,
} from '../models';
import { ApiError } from '../errors/ApiError';
import {
    CreateBookingInput,
    UpdateBookingInput,
} from '../schemas/booking.schema';
import { checkRoomPermission } from '../middlewares/roomRole.middleware';

export class BookingService {
    private static async verifyRoomRole(
        roomId: string,
        userId: string,
        allowedRoles: RoomRole[]
    ) {
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
    }

    private static async checkTimeConflict(
        roomId: string,
        startTime: Date,
        endTime: Date,
        excludeBookingId?: string
    ) {
        const conflictingBooking = await Booking.findOne({
            where: {
                roomId,
                ...(excludeBookingId ? { id: { [Op.ne]: excludeBookingId } } : {}),
                [Op.and]: [
                    { startTime: { [Op.lt]: endTime } },
                    { endTime: { [Op.gt]: startTime } },
                ],
            },
        });

        if (conflictingBooking) {
            throw new ApiError(
                409,
                'The selected time slot conflicts with an existing booking'
            );
        }
    }

    static async getBookingsByRoom(roomId: string, userId: string) {
        await checkRoomPermission(roomId, userId, [RoomRole.ADMIN, RoomRole.USER]);

        return Booking.findAll({
            where: { roomId },
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
            order: [['startTime', 'ASC']],
        });
    }

    static async getBookingById(bookingId: string) {
        const booking = await Booking.findByPk(bookingId, {
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
        });

        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        return booking;
    }

    static async createBooking(userId: string, data: CreateBookingInput) {
        await checkRoomPermission(data.roomId, userId, [RoomRole.ADMIN, RoomRole.USER]);

        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        await this.checkTimeConflict(data.roomId, startTime, endTime);

        const booking = await Booking.sequelize!.transaction(async (t) => {
            const newBooking = await Booking.create(
                {
                    roomId: data.roomId,
                    createdBy: userId,
                    title: data.title,
                    description: data.description || '',
                    startTime,
                    endTime,
                },
                { transaction: t }
            );

            await BookingParticipant.create(
                {
                    bookingId: newBooking.id,
                    userId,
                },
                { transaction: t }
            );

            return newBooking;
        });

        return this.getBookingById(booking.id);
    }

    static async updateBooking(
        bookingId: string,
        userId: string,
        data: UpdateBookingInput
    ) {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        if (booking.createdBy !== userId) {
            await checkRoomPermission(booking.roomId, userId, [RoomRole.ADMIN]);
        }

        const newStartTime = data.startTime
            ? new Date(data.startTime)
            : booking.startTime;
        const newEndTime = data.endTime ? new Date(data.endTime) : booking.endTime;

        if (newStartTime >= newEndTime) {
            throw new ApiError(400, 'endTime must be after startTime');
        }

        await this.checkTimeConflict(
            booking.roomId,
            newStartTime,
            newEndTime,
            booking.id
        );

        await booking.update({
            title: data.title ?? booking.title,
            description: data.description ?? booking.description,
            startTime: newStartTime,
            endTime: newEndTime,
        });

        return this.getBookingById(booking.id);
    }

    static async deleteBooking(bookingId: string, userId: string) {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        if (booking.createdBy !== userId) {
            await checkRoomPermission(booking.roomId, userId, [RoomRole.ADMIN]);
        }
        await booking.destroy();
    }

    static async joinBooking(bookingId: string, userId: string) {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        await checkRoomPermission(booking.roomId, userId, [
            RoomRole.ADMIN,
            RoomRole.USER,
        ]);

        const existingParticipant = await BookingParticipant.findOne({
            where: { bookingId, userId },
        });

        if (!existingParticipant) {
            await BookingParticipant.create({ bookingId, userId });
        }
    }

    static async leaveBooking(bookingId: string, userId: string) {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new ApiError(404, 'Booking not found');
        }

        await checkRoomPermission(booking.roomId, userId, [
            RoomRole.ADMIN,
            RoomRole.USER,
        ]);

        const existingParticipant = await BookingParticipant.findOne({
            where: { bookingId, userId },
        });

        if (existingParticipant) {
            await existingParticipant.destroy();
        }
    }
}