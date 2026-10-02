'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Users,
    Edit2,
    Trash2,
    Calendar,
    DoorOpen,
    Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    useGetRoomsQuery,
    useDeleteRoomMutation,
} from '@/store/api/roomsApi';
import { useAppSelector } from '@/store/hooks';
import { Room } from '@/types';
import RoomModal from '@/components/rooms/RoomModal';
import RoomMembersModal from '@/components/rooms/RoomMembersModal';
import { getRoomRole } from '@/lib/roles';
import { getApiErrorMessage } from '@/lib/error';

export default function HomePage() {
    const currentUser = useAppSelector((state) => state.auth.user);
    const { data: rooms, isLoading, isError } = useGetRoomsQuery();
    const [deleteRoom] = useDeleteRoomMutation();

    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [membersRoom, setMembersRoom] = useState<Room | null>(null);

    const checkIsRoomAdmin = (room: Room) => {
        return getRoomRole(room, currentUser).isAdmin;
    };

    const handleOpenCreate = () => {
        setSelectedRoom(null);
        setIsRoomModalOpen(true);
    };

    const handleOpenEdit = (room: Room) => {
        setSelectedRoom(room);
        setIsRoomModalOpen(true);
    };

    const handleDelete = async (room: Room) => {
        if (!window.confirm(`Are you sure you want to delete "${room.name}"?`)) {
            return;
        }
        try {
            await deleteRoom(room.id).unwrap();
            toast.success('Room deleted successfully');
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, 'Failed to delete room'));
        }
    };

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meeting Rooms</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Select a room to view schedule and book meetings
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    <span>Create Room</span>
                </button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-48 animate-pulse rounded-xl border border-gray-200 bg-white p-6"
                        />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                    Failed to load meeting rooms. Please make sure the backend server is
                    running.
                </div>
            )}

            {!isLoading && !isError && rooms?.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <DoorOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                        No meeting rooms yet
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        Get started by creating your first meeting room and inviting team
                        members.
                    </p>
                    <button
                        onClick={handleOpenCreate}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create Room</span>
                    </button>
                </div>
            )}

            {!isLoading && !isError && rooms && rooms.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => {
                        const isAdmin = checkIsRoomAdmin(room);

                        return (
                            <div
                                key={room.id}
                                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {room.name}
                                        </h2>
                                        {isAdmin && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                                <Shield className="h-3 w-3" />
                                                Admin
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                                        {room.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="mt-6 border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <Link
                                            href={`/rooms/${room.id}`}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                        >
                                            <Calendar className="h-4 w-4" />
                                            <span>View Bookings</span>
                                        </Link>

                                        <button
                                            onClick={() => setMembersRoom(room)}
                                            title="Room Members"
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                        >
                                            <Users className="h-4 w-4" />
                                        </button>

                                        {isAdmin && (
                                            <>
                                                <button
                                                    onClick={() => handleOpenEdit(room)}
                                                    title="Edit Room"
                                                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(room)}
                                                    title="Delete Room"
                                                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <RoomModal
                isOpen={isRoomModalOpen}
                onClose={() => setIsRoomModalOpen(false)}
                room={selectedRoom}
            />

            <RoomMembersModal
                isOpen={!!membersRoom}
                onClose={() => setMembersRoom(null)}
                room={membersRoom}
            />
        </main>
    );
}