export type Role = 'ADMIN' | 'USER';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RoomMember {
    id: number;
    roomId: number;
    userId: number;
    role: Role;
    user?: User;
}

export interface Room {
    id: number;
    name: string;
    description: string;
    createdBy: number;
    createdAt?: string;
    updatedAt?: string;
    members?: RoomMember[];
}

export interface BookingParticipant {
    id: number;
    bookingId: number;
    userId: number;
    user?: User;
}

export interface Booking {
    id: number;
    roomId: number;
    createdBy: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    creator?: User;
    participants?: BookingParticipant[];
}