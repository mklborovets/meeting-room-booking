export type Role = 'ADMIN' | 'USER';

export interface User {
    userId: string | undefined;
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
}

export interface RoomMember {
    id: string;
    roomId: string;
    userId: string;
    role: Role;
    user: User;
}

export interface Room {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
    members: RoomMember[];
}

export interface BookingParticipant {
    id: string;
    bookingId: string;
    userId: string;
    user: User;
}

export interface Booking {
    id: string;
    roomId: string;
    createdBy: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    creator: User;
    participants: User[];
}