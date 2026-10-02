import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';

export class RoomController {
    static async create(req: Request, res: Response) {
        const room = await RoomService.createRoom(req.user!.id, req.body);
        res.status(201).json(room);
    }

    static async getAll(req: Request, res: Response) {
        const rooms = await RoomService.getAllRooms(req.user!.id);
        res.status(200).json(rooms);
    }

    static async getById(req: Request, res: Response) {
        const room = await RoomService.getRoomById(req.params.id as string);
        res.status(200).json(room);
    }

    static async update(req: Request, res: Response) {
        const room = await RoomService.updateRoom(
            req.params.id as string,
            req.body
        );
        res.status(200).json(room);
    }

    static async delete(req: Request, res: Response) {
        await RoomService.deleteRoom(req.params.id as string);
        res.status(204).send();
    }

    static async addMember(req: Request, res: Response) {
        const room = await RoomService.addMemberByEmail(
            req.params.id as string,
            req.user!.id,
            req.body
        );
        res.status(200).json(room);
    }

    static async removeMember(req: Request, res: Response) {
        await RoomService.removeMember(
            req.params.id as string,
            req.params.userId as string,
            req.user!.id
        );
        res.status(204).send();
    }
}