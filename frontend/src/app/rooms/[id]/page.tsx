'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Plus,
    Calendar,
    Clock,
    Users,
    Edit2,
    Trash2,
    UserCheck,
    UserPlus,
    Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetRoomByIdQuery } from '@/store/api/roomsApi';
import {
    useGetBookingsByRoomQuery,
    useDeleteBookingMutation,
    useToggleParticipationMutation,
} from '@/store/api/bookingsApi';
import { useAppSelector } from '@/store/hooks';
import { Booking } from '@/types';
import BookingModal from '@/components/bookings/BookingModal';
import RoomMembersModal from '@/components/rooms/RoomMembersModal';

export default function RoomBookingsPage() {
    const params = useParams();
    const roomId = params?.id as string;

    const currentUser = useAppSelector((state) => state.auth.user);

    const {
        data: room,
        isLoading: isRoomLoading,
        isError: isRoomError,
    } = useGetRoomByIdQuery(roomId, {
        skip: !roomId,
    });

    const {
        data: bookings,
        isLoading: isBookingsLoading,
        isError: isBookingsError,
    } = useGetBookingsByRoomQuery(roomId, {
        skip: !roomId,
    });

    const [deleteBooking] = useDeleteBookingMutation();
    const [toggleParticipation, { isLoading: isToggling }] =
        useToggleParticipationMutation();

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

    const currentMemberRecord = room?.members?.find(
        (m) => m.userId === currentUser?.id
    );
    const isRoomAdmin =
        room?.createdBy === currentUser?.id ||
        currentMemberRecord?.role === 'ADMIN';

    const canManageBooking = (booking: Booking) => {
        if (!currentUser) return false;
        return isRoomAdmin || booking.createdBy === currentUser.id;
    };

    const handleOpenCreate = () => {
        setSelectedBooking(null);
        setIsBookingModalOpen(true);
    };

    const handleOpenEdit = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsBookingModalOpen(true);
    };

    const handleDeleteBooking = async (booking: Booking) => {
        if (
            !window.confirm(`Are you sure you want to cancel "${booking.title}"?`)
        ) {
            return;
        }
        try {
            await deleteBooking({ id: booking.id, roomId }).unwrap();
            toast.success('Booking cancelled');
        } catch (err: unknown) {
            const apiError = err as { data?: { message?: string } };
            toast.error(apiError?.data?.message || 'Failed to cancel booking');
        }
    };

    const handleToggleParticipation = async (booking: Booking) => {
        try {
            const res = await toggleParticipation({
                id: booking.id,
                roomId,
            }).unwrap();
            toast.success(res.message || 'Participation updated');
        } catch (err: unknown) {
            const apiError = err as { data?: { message?: string } };
            toast.error(apiError?.data?.message || 'Failed to update participation');
        }
    };

    if (isRoomLoading || isBookingsLoading) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-32 animate-pulse rounded-xl border border-gray-200 bg-white p-6 mb-6" />
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-6"
                        />
                    ))}
                </div>
            </main>
        );
    }

    if (isRoomError || !room) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                    Room not found or you do not have permission to view it.
                </div>
                <div className="mt-4 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Rooms
                    </Link>
                </div>
            </main>
        );
    }

    const sortedBookings = [...(bookings || [])].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Meeting Rooms</span>
                </Link>
            </div>

            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
                            {isRoomAdmin && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                    <Shield className="h-3 w-3" />
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            {room.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={() => setIsMembersModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Users className="h-4 w-4" />
                            <span>Members ({room.members?.length || 0})</span>
                        </button>

                        {isRoomAdmin && (
                            <button
                                onClick={handleOpenCreate}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Book Room</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Scheduled Bookings</h2>
                <span className="text-sm text-gray-500">
                    {sortedBookings.length}{' '}
                    {sortedBookings.length === 1 ? 'booking' : 'bookings'}
                </span>
            </div>

            {isBookingsError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                    Failed to load bookings for this room.
                </div>
            )}

            {!isBookingsError && sortedBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                        No bookings scheduled
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        This room is currently free. Schedule a meeting to reserve a time
                        slot.
                    </p>
                    {isRoomAdmin && (
                        <button
                            onClick={handleOpenCreate}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Book Room</span>
                        </button>
                    )}
                </div>
            )}

            {!isBookingsError && sortedBookings.length > 0 && (
                <div className="space-y-4">
                    {sortedBookings.map((booking) => {
                        const startDate = new Date(booking.startTime);
                        const endDate = new Date(booking.endTime);
                        const participants = booking.participants || [];
                        const isParticipating = participants.some(
                            (p) => p.userId === currentUser?.id
                        );
                        const canEdit = canManageBooking(booking);

                        return (
                            <div
                                key={booking.id}
                                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {booking.title}
                                            </h3>
                                            {isParticipating && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                    <UserCheck className="h-3 w-3" />
                                                    Joined
                                                </span>
                                            )}
                                        </div>

                                        {booking.description && (
                                            <p className="text-sm text-gray-600">
                                                {booking.description}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-500">
                                            <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                <span>{format(startDate, 'MMM d, yyyy')}</span>
                                            </div>

                                            <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                                <span>
                                                    {format(startDate, 'HH:mm')} –{' '}
                                                    {format(endDate, 'HH:mm')}
                                                </span>
                                            </div>

                                            {booking.creator && (
                                                <span>
                                                    Created by{' '}
                                                    <strong className="text-gray-700">
                                                        {booking.creator.name}
                                                    </strong>
                                                </span>
                                            )}
                                        </div>

                                        {participants.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-1.5 pt-2">
                                                <span className="text-xs text-gray-500 mr-1">
                                                    Participants:
                                                </span>
                                                {participants.map((p) => (
                                                    <span
                                                        key={p.id}
                                                        className=" rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                                                    >
                                                        {p.name || `User #${p.id}`}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-start">
                                        <button
                                            onClick={() => handleToggleParticipation(booking)}
                                            disabled={isToggling}
                                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${isParticipating
                                                ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                }`}
                                        >
                                            {isParticipating ? (
                                                <>
                                                    <span>Leave</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="h-4 w-4" />
                                                    <span>Join</span>
                                                </>
                                            )}
                                        </button>

                                        {canEdit && (
                                            <>
                                                <button
                                                    onClick={() => handleOpenEdit(booking)}
                                                    title="Edit Booking"
                                                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteBooking(booking)}
                                                    title="Cancel Booking"
                                                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
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

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                roomId={roomId}
                booking={selectedBooking}
            />

            <RoomMembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                room={room}
            />
        </main>
    );
}