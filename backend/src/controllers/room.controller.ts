import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/room.service';

export class RoomController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const room = await RoomService.createRoom(req.user!.id, req.body);
            res.status(201).json(room);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const rooms = await RoomService.getAllRooms();
            res.status(200).json(rooms);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const room = await RoomService.getRoomById(req.params.id as string);
            res.status(200).json(room);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const room = await RoomService.updateRoom(
                req.params.id as string,
                req.body
            );
            res.status(200).json(room);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await RoomService.deleteRoom(req.params.id as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async addMember(req: Request, res: Response, next: NextFunction) {
        try {
            const room = await RoomService.addMemberByEmail(
                req.params.id as string,
                req.body
            );
            res.status(200).json(room);
        } catch (error) {
            next(error);
        }
    }

    static async removeMember(req: Request, res: Response, next: NextFunction) {
        try {
            await RoomService.removeMember(
                req.params.id as string,
                req.params.userId as string
            );
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}