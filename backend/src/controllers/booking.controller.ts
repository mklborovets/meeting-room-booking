import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';

export class BookingController {
    static async getByRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const bookings = await BookingService.getBookingsByRoom(
                req.params.roomId as string,
                req.user!.id
            );
            res.status(200).json(bookings);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const booking = await BookingService.createBooking(
                req.user!.id,
                req.body
            );
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const booking = await BookingService.updateBooking(
                req.params.id as string,
                req.user!.id,
                req.body
            );
            res.status(200).json(booking);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await BookingService.deleteBooking(
                req.params.id as string,
                req.user!.id
            );
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async toggleParticipation(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const booking = await BookingService.toggleParticipation(
                req.params.id as string,
                req.user!.id
            );
            res.status(200).json(booking);
        } catch (error) {
            next(error);
        }
    }
}