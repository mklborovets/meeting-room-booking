'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
    bookingSchema,
    BookingFormValues,
} from '@/lib/validations/booking';
import {
    useCreateBookingMutation,
    useUpdateBookingMutation,
} from '@/store/api/bookingsApi';
import { Booking } from '@/types';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    booking?: Booking | null;
}

const toLocalInputString = (isoDate?: string) => {
    const date = isoDate ? new Date(isoDate) : new Date();
    return format(date, "yyyy-MM-dd'T'HH:mm");
};

export default function BookingModal({
    isOpen,
    onClose,
    roomId,
    booking,
}: BookingModalProps) {
    const isEditing = !!booking;
    const [createBooking, { isLoading: isCreating }] =
        useCreateBookingMutation();
    const [updateBooking, { isLoading: isUpdating }] =
        useUpdateBookingMutation();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            title: '',
            description: '',
            startTime: '',
            endTime: '',
        },
    });

    useEffect(() => {
        if (booking) {
            reset({
                title: booking.title,
                description: booking.description || '',
                startTime: toLocalInputString(booking.startTime),
                endTime: toLocalInputString(booking.endTime),
            });
        } else {
            const now = new Date();
            now.setMinutes(0, 0, 0);
            now.setHours(now.getHours() + 1);
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

            reset({
                title: '',
                description: '',
                startTime: toLocalInputString(now.toISOString()),
                endTime: toLocalInputString(oneHourLater.toISOString()),
            });
        }
    }, [booking, reset, isOpen]);

    if (!isOpen) return null;

    const isLoading = isCreating || isUpdating;

    const onSubmit = async (data: BookingFormValues) => {
        try {
            const payload = {
                title: data.title,
                description: data.description,
                startTime: new Date(data.startTime).toISOString(),
                endTime: new Date(data.endTime).toISOString(),
            };

            if (isEditing && booking) {
                await updateBooking({
                    id: booking.id,
                    roomId,
                    ...payload,
                }).unwrap();
                toast.success('Booking updated successfully');
            } else {
                await createBooking({
                    roomId,
                    ...payload,
                }).unwrap();
                toast.success('Booking created successfully');
            }
            onClose();
        } catch (err: unknown) {
            const apiError = err as { data?: { message?: string } };
            toast.error(
                apiError?.data?.message ||
                'Failed to save booking. Check for time overlaps.'
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEditing ? 'Edit Booking' : 'New Booking'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Meeting Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Sprint Planning"
                            {...register('title')}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all hover:bg-white focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Agenda, notes, or links..."
                            {...register('description')}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all hover:bg-white focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Start Time
                            </label>
                            <Controller
                                control={control}
                                name="startTime"
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value ? new Date(field.value) : null}
                                        onChange={(date: Date | null) => field.onChange(date ? toLocalInputString(date.toISOString()) : '')}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        placeholderText="Select start time"
                                        wrapperClassName="w-full"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all hover:bg-white focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                                    />
                                )}
                            />
                            {errors.startTime && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.startTime.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                End Time
                            </label>
                            <Controller
                                control={control}
                                name="endTime"
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value ? new Date(field.value) : null}
                                        onChange={(date: Date | null) => field.onChange(date ? toLocalInputString(date.toISOString()) : '')}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        placeholderText="Select end time"
                                        wrapperClassName="w-full"
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-all hover:bg-white focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10"
                                    />
                                )}
                            />
                            {errors.endTime && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.endTime.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isLoading
                                ? 'Saving...'
                                : isEditing
                                    ? 'Save Changes'
                                    : 'Book Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}