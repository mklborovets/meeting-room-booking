import { Calendar, Shield, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Room, Booking } from '@/types';
import { isSameDay } from 'date-fns';

interface RoomHeaderProps {
    room: Room;
    isRoomAdmin: boolean;
    onBookRoom: () => void;
    onMembersClick: () => void;
    bookings?: Booking[];
}

export function RoomHeader({
    room,
    isRoomAdmin,
    onBookRoom,
    onMembersClick,
    bookings,
}: RoomHeaderProps) {
    let statusBadge = null;
    if (bookings) {
        const now = new Date();
        const todaysBookings = bookings.filter(b => isSameDay(new Date(b.startTime), now));

        const currentBooking = todaysBookings.find(
            b => new Date(b.startTime) <= now && new Date(b.endTime) >= now
        );

        if (currentBooking) {
            const endString = currentBooking.endTime.toString().slice(11, 16);
            statusBadge = (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 text-xs font-medium border border-red-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Occupied until {new Date(currentBooking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            );
        } else {
            const nextBooking = todaysBookings
                .filter(b => new Date(b.startTime) > now)
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

            if (nextBooking) {
                statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-medium border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Available until {new Date(nextBooking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                );
            } else {
                statusBadge = (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-medium border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Available
                    </span>
                );
            }
        }
    }

    return (
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
                        {statusBadge}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {room.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        variant="outline"
                        onClick={onMembersClick}
                        icon={<Users />}
                    >
                        Members ({room.members?.length || 0})
                    </Button>

                    {isRoomAdmin && (
                        <Button onClick={onBookRoom} icon={<Plus />}>
                            Book Room
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
