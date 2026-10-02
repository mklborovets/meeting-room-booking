import { format } from 'date-fns';
import { Calendar, Clock, Edit2, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Booking, User } from '@/types';

interface BookingCardProps {
    booking: Booking;
    currentUser: User | null;
    isRoomAdmin: boolean;
    onEdit: (booking: Booking) => void;
    onDelete: (booking: Booking) => void;
    onToggleParticipation: (booking: Booking, isParticipating: boolean) => void;
    isToggling: boolean;
}

export function BookingCard({
    booking,
    currentUser,
    isRoomAdmin,
    onEdit,
    onDelete,
    onToggleParticipation,
    isToggling,
}: BookingCardProps) {
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);
    const participants = booking.participants || [];

    const isParticipating = participants.some((p) => p.id === currentUser?.id);
    const canEdit = currentUser && (isRoomAdmin || booking.createdBy === currentUser.id);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                            {booking.title}
                        </h3>
                        {isParticipating && (
                            <Badge variant="success">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Joined
                            </Badge>
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
                                {format(startDate, 'HH:mm')} – {format(endDate, 'HH:mm')}
                            </span>
                        </div>

                        {booking.creator && (
                            <span>
                                Created by <strong className="text-gray-700">{booking.creator.name}</strong>
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
                                    className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700"
                                >
                                    {p.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start">
                    <Button
                        variant={isParticipating ? "outline" : "primary"}
                        onClick={() => onToggleParticipation(booking, isParticipating)}
                        isLoading={isToggling}
                        icon={!isParticipating ? <UserPlus /> : undefined}
                    >
                        {isParticipating ? 'Leave' : 'Join'}
                    </Button>

                    {canEdit && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => onEdit(booking)}
                                className="!p-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                aria-label="Edit Booking"
                            >
                                <Edit2 className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={() => onDelete(booking)}
                                className="!p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
                                aria-label="Cancel Booking"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
