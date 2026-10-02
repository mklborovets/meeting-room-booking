'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetRoomByIdQuery } from '@/store/api/roomsApi';
import {
    useGetBookingsByRoomQuery,
    useDeleteBookingMutation,
    useJoinBookingMutation,
    useLeaveBookingMutation,
} from '@/store/api/bookingsApi';
import { useAppSelector } from '@/store/hooks';
import { Booking } from '@/types';
import BookingModal from '@/components/bookings/BookingModal';
import RoomMembersModal from '@/components/rooms/RoomMembersModal';
import { RoomHeader } from '@/components/rooms/RoomHeader';
import { BookingSchedule } from '@/components/bookings/BookingSchedule';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { getRoomRole } from '@/lib/roles';
import { getApiErrorMessage } from '@/lib/error';

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
    const [joinBooking] = useJoinBookingMutation();
    const [leaveBooking] = useLeaveBookingMutation();

    const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

    const isRoomAdmin = getRoomRole(room, currentUser).isAdmin;



    const handleOpenCreate = () => {
        setSelectedBooking(null);
        setIsBookingModalOpen(true);
    };

    const handleOpenEdit = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsBookingModalOpen(true);
    };

    const confirmDeleteBooking = async () => {
        if (!bookingToDelete) return;
        try {
            await deleteBooking({ id: bookingToDelete.id, roomId }).unwrap();
            toast.success('Booking cancelled');
            setBookingToDelete(null);
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, 'Failed to cancel booking'));
        }
    };

    const handleToggleParticipation = async (booking: Booking, isParticipating: boolean) => {
        setPendingBookingId(booking.id);
        try {
            if (isParticipating) {
                const res = await leaveBooking({ id: booking.id, roomId }).unwrap();
                toast.success(res.message || 'Successfully left booking');
            } else {
                const res = await joinBooking({ id: booking.id, roomId }).unwrap();
                toast.success(res.message || 'Successfully joined booking');
            }
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, 'Failed to update participation'));
        } finally {
            setPendingBookingId(null);
        }
    };

    const { futureBookings, pastBookings } = useMemo(() => {
        const now = new Date().getTime();
        const all = [...(bookings || [])];
        return {
            futureBookings: all.filter((b) => new Date(b.endTime).getTime() >= now),
            pastBookings: all.filter((b) => new Date(b.endTime).getTime() < now).reverse(),
        };
    }, [bookings]);

    if (isRoomLoading || isBookingsLoading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Meeting Rooms</span>
                </Link>
            </div>

            <RoomHeader
                room={room}
                isRoomAdmin={isRoomAdmin}
                onBookRoom={handleOpenCreate}
                onMembersClick={() => setIsMembersModalOpen(true)}
                bookings={bookings || []}
            />

            {isBookingsError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 mb-8">
                    Failed to load bookings for this room.
                </div>
            )}

            {!isBookingsError && (
                <BookingSchedule
                    bookings={bookings || []}
                    currentUser={currentUser}
                    isRoomAdmin={isRoomAdmin}
                    onEdit={handleOpenEdit}
                    onDelete={(b) => setBookingToDelete(b)}
                    onToggleParticipation={handleToggleParticipation}
                    pendingBookingId={pendingBookingId}
                    onBookRoom={handleOpenCreate}
                />
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

            <ConfirmModal
                isOpen={!!bookingToDelete}
                onClose={() => setBookingToDelete(null)}
                onConfirm={confirmDeleteBooking}
                title="Cancel Booking"
                description={`Are you sure you want to cancel "${bookingToDelete?.title}"? This action cannot be undone.`}
                confirmText="Cancel Booking"
                isDestructive
            />
        </main>
    );
}