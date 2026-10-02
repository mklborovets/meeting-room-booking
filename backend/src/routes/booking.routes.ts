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

router.get('/room/:roomId', BookingController.getByRoom);
router.post('/', validate(createBookingSchema), BookingController.create);
router.put('/:id', validate(updateBookingSchema), BookingController.update);
router.delete('/:id', BookingController.delete);
router.post('/:id/participate', BookingController.toggleParticipation);

export default router;