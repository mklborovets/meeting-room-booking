import { useMemo } from 'react';
import { format, isSameDay, startOfDay, addHours, differenceInMinutes } from 'date-fns';
import { Booking } from '@/types';

interface DailyTimelineProps {
    date: Date;
    bookings: Booking[];
}

export function DailyTimeline({ date, bookings }: DailyTimelineProps) {
    const START_HOUR = 8;
    const END_HOUR = 20;
    const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;

    const dayStart = startOfDay(date);
    const timelineStart = addHours(dayStart, START_HOUR);
    const timelineEnd = addHours(dayStart, END_HOUR);

    const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

    const timelineBookings = useMemo(() => {
        return bookings.filter(b => isSameDay(new Date(b.startTime), date)).map(booking => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);

            const visualStart = start < timelineStart ? timelineStart : start;
            const visualEnd = end > timelineEnd ? timelineEnd : end;

            let leftPercent = (differenceInMinutes(visualStart, timelineStart) / TOTAL_MINUTES) * 100;
            let widthPercent = (differenceInMinutes(visualEnd, visualStart) / TOTAL_MINUTES) * 100;

            leftPercent = Math.max(0, Math.min(100, leftPercent));
            widthPercent = Math.max(0, Math.min(100 - leftPercent, widthPercent));

            return {
                ...booking,
                visualStart,
                visualEnd,
                leftPercent,
                widthPercent,
                isOutOfBounds: end <= timelineStart || start >= timelineEnd
            };
        }).filter(b => !b.isOutOfBounds);
    }, [bookings, date, timelineStart, timelineEnd, TOTAL_MINUTES]);

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-6">Daily Schedule</h3>

            <div className="relative w-full h-12 bg-gray-50 rounded-md border border-gray-100">
                {hours.map((hour, index) => {
                    const isLast = index === hours.length - 1;
                    const leftPos = (index / (hours.length - 1)) * 100;
                    return (
                        <div
                            key={hour}
                            className="absolute top-0 bottom-0 border-l border-gray-200 flex flex-col justify-end"
                            style={{ left: `${leftPos}%` }}
                        >
                            {!isLast && (
                                <span className="absolute -left-3 -bottom-6 text-xs text-gray-400">
                                    {hour.toString().padStart(2, '0')}:00
                                </span>
                            )}
                            {isLast && (
                                <span className="absolute -right-3 -bottom-6 text-xs text-gray-400">
                                    {hour.toString().padStart(2, '0')}:00
                                </span>
                            )}
                        </div>
                    );
                })}

                {timelineBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="absolute top-1 bottom-1 bg-blue-500 rounded-md shadow-sm border border-blue-600 opacity-90 hover:opacity-100 cursor-pointer transition-opacity flex items-center justify-center overflow-hidden"
                        style={{
                            left: `${booking.leftPercent}%`,
                            width: `${booking.widthPercent}%`,
                            minWidth: '4px'
                        }}
                        title={`${booking.title}\n${format(new Date(booking.startTime), 'HH:mm')} - ${format(new Date(booking.endTime), 'HH:mm')}`}
                    >
                        {booking.widthPercent > 10 && (
                            <span className="text-[10px] text-white font-medium truncate px-1">
                                {booking.title}
                            </span>
                        )}
                    </div>
                ))}

                {isSameDay(date, new Date()) && (
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{
                            left: `${Math.max(0, Math.min(100, (differenceInMinutes(new Date(), timelineStart) / TOTAL_MINUTES) * 100))}%`,
                            display: new Date() >= timelineStart && new Date() <= timelineEnd ? 'block' : 'none'
                        }}
                    >
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    </div>
                )}
            </div>
            <div className="mt-8 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                    <span>Booked slot</span>
                </div>
                <span>Hours outside 08:00 - 20:00 might not be displayed properly</span>
            </div>
        </div>
    );
}
