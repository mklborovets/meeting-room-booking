import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, addDays, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Booking, User } from '@/types';
import { DailyTimeline } from './DailyTimeline';
import { BookingList } from './BookingList';

interface BookingScheduleProps {
    bookings: Booking[];
    currentUser: User | null;
    isRoomAdmin: boolean;
    onEdit: (booking: Booking) => void;
    onDelete: (booking: Booking) => void;
    onToggleParticipation: (booking: Booking, isParticipating: boolean) => void;
    isToggling: boolean;
    onBookRoom?: () => void;
}

export function BookingSchedule({
    bookings,
    currentUser,
    isRoomAdmin,
    onEdit,
    onDelete,
    onToggleParticipation,
    isToggling,
    onBookRoom,
}: BookingScheduleProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

    const handlePrevDay = () => setSelectedDate(prev => addDays(prev, -1));
    const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));
    const handleToday = () => setSelectedDate(startOfDay(new Date()));

    const bookingsForSelectedDate = useMemo(() => {
        return bookings.filter(b => isSameDay(new Date(b.startTime), selectedDate));
    }, [bookings, selectedDate]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="px-2" onClick={handlePrevDay} aria-label="Previous day">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-[140px] text-center font-semibold text-gray-800">
                        {format(selectedDate, 'EEEE, MMM d')}
                    </div>
                    <Button variant="outline" className="px-2" onClick={handleNextDay} aria-label="Next day">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="outline" onClick={handleToday} className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Today
                </Button>
            </div>

            <DailyTimeline date={selectedDate} bookings={bookingsForSelectedDate} />

            <BookingList
                title="Schedule for Date"
                description={`Bookings on ${format(selectedDate, 'MMMM d, yyyy')}`}
                bookings={bookingsForSelectedDate}
                currentUser={currentUser}
                isRoomAdmin={isRoomAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleParticipation={onToggleParticipation}
                isToggling={isToggling}
                onBookRoom={onBookRoom}
                showEmptyStateBookButton={isSameDay(selectedDate, new Date()) || selectedDate > new Date()}
            />
        </div>
    );
}
