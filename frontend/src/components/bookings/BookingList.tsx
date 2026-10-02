import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookingCard } from './BookingCard';
import { Booking, User } from '@/types';

interface BookingListProps {
    title: string;
    description: string;
    bookings: Booking[];
    currentUser: User | null;
    isRoomAdmin: boolean;
    onEdit: (booking: Booking) => void;
    onDelete: (booking: Booking) => void;
    onToggleParticipation: (booking: Booking, isParticipating: boolean) => void;
    pendingBookingId: string | null;
    onBookRoom?: () => void;
    showEmptyStateBookButton?: boolean;
}

export function BookingList({
    title,
    description,
    bookings,
    currentUser,
    isRoomAdmin,
    onEdit,
    onDelete,
    onToggleParticipation,
    pendingBookingId,
    onBookRoom,
    showEmptyStateBookButton,
}: BookingListProps) {
    return (
        <div className="mb-8">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                    {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                </span>
            </div>

            {bookings.length === 0 ? (
                <EmptyState
                    title={`No ${title.toLowerCase()}`}
                    description="There are no bookings in this category."
                    icon={<Calendar className="h-6 w-6" />}
                    action={
                        showEmptyStateBookButton && isRoomAdmin && onBookRoom ? (
                            <Button onClick={onBookRoom}>
                                Book Room
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            currentUser={currentUser}
                            isRoomAdmin={isRoomAdmin}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleParticipation={onToggleParticipation}
                            pendingBookingId={pendingBookingId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
