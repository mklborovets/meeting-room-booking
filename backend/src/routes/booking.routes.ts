import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createBookingSchema,
    updateBookingSchema,
} from '../schemas/booking.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createBookingSchema), BookingController.create);
router.put('/:id', validate(updateBookingSchema), BookingController.update);
router.delete('/:id', BookingController.delete);
router.post('/:id/participants', BookingController.joinBooking);
router.delete('/:id/participants/me', BookingController.leaveBooking);

export default router;