import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createRoomSchema,
    updateRoomSchema,
    addRoomMemberSchema,
} from '../schemas/room.schema';
import { RoomRole } from '../models';

import { BookingController } from '../controllers/booking.controller';

const router = Router();

router.use(authenticate);

router.get('/', RoomController.getAll);
router.post('/', validate(createRoomSchema), RoomController.create);
router.get(
    '/:id',
    RoomController.getById
);

router.get(
    '/:roomId/bookings',
    BookingController.getByRoom
);

router.put(
    '/:id',
    validate(updateRoomSchema),
    RoomController.update
);

router.delete(
    '/:id',
    RoomController.delete
);

router.post(
    '/:id/members',
    validate(addRoomMemberSchema),
    RoomController.addMember
);

router.delete(
    '/:id/members/:userId',
    RoomController.removeMember
);

export default router;