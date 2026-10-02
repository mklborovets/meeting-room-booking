import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
    isToggling: boolean;
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
    isToggling,
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
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                        No {title.toLowerCase()}
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        There are no bookings in this category.
                    </p>
                    {showEmptyStateBookButton && isRoomAdmin && onBookRoom && (
                        <Button onClick={onBookRoom} className="mt-4">
                            Book Room
                        </Button>
                    )}
                </div>
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
                            isToggling={isToggling}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
