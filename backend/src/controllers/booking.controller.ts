import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

export class BookingController {
    static async getByRoom(req: Request, res: Response) {
        const bookings = await BookingService.getBookingsByRoom(
            req.params.roomId as string,
            req.user!.id
        );
        res.status(200).json(bookings);
    }

    static async create(req: Request, res: Response) {
        const booking = await BookingService.createBooking(
            req.user!.id,
            req.body
        );
        res.status(201).json(booking);
    }

    static async update(req: Request, res: Response) {
        const booking = await BookingService.updateBooking(
            req.params.id as string,
            req.user!.id,
            req.body
        );
        res.status(200).json(booking);
    }

    static async delete(req: Request, res: Response) {
        await BookingService.deleteBooking(
            req.params.id as string,
            req.user!.id
        );
        res.status(204).send();
    }

    static async joinBooking(req: Request, res: Response) {
        await BookingService.joinBooking(
            req.params.id as string,
            req.user!.id
        );
        res.status(200).json({ message: 'Successfully joined booking' });
    }

    static async leaveBooking(req: Request, res: Response) {
        await BookingService.leaveBooking(
            req.params.id as string,
            req.user!.id
        );
        res.status(200).json({ message: 'Successfully left booking' });
    }
}