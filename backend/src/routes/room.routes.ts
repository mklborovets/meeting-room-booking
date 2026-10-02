import { Router } from 'express';
import { RoomController } from '../controllers/room.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRoomRole } from '../middlewares/roomRole.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createRoomSchema,
    updateRoomSchema,
    addRoomMemberSchema,
} from '../schemas/room.schema';
import { RoomRole } from '../models';

const router = Router();

router.use(authenticate);

router.get('/', RoomController.getAll);
router.post('/', validate(createRoomSchema), RoomController.create);
router.get(
    '/:id',
    requireRoomRole([RoomRole.ADMIN, RoomRole.USER]),
    RoomController.getById
);

import { BookingController } from '../controllers/booking.controller';

router.get(
    '/:roomId/bookings',
    requireRoomRole([RoomRole.ADMIN, RoomRole.USER]),
    BookingController.getByRoom
);

router.put(
    '/:id',
    requireRoomRole([RoomRole.ADMIN]),
    validate(updateRoomSchema),
    RoomController.update
);

router.delete(
    '/:id',
    requireRoomRole([RoomRole.ADMIN]),
    RoomController.delete
);

router.post(
    '/:id/members',
    requireRoomRole([RoomRole.ADMIN]),
    validate(addRoomMemberSchema),
    RoomController.addMember
);

router.delete(
    '/:id/members/:userId',
    requireRoomRole([RoomRole.ADMIN]),
    RoomController.removeMember
);

export default router;