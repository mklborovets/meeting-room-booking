'use client';

import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
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
import { getApiErrorMessage } from '@/lib/error';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    booking?: Booking | null;
}

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
            startTime: new Date(),
            endTime: new Date(),
        },
    });

    const startTimeValue = useWatch({ control, name: 'startTime' });
    const endTimeValue = useWatch({ control, name: 'endTime' });

    useEffect(() => {
        if (booking) {
            reset({
                title: booking.title,
                description: booking.description || '',
                startTime: new Date(booking.startTime),
                endTime: new Date(booking.endTime),
            });
        } else {
            const now = new Date();
            now.setMinutes(0, 0, 0);
            now.setHours(now.getHours() + 1);
            const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

            reset({
                title: '',
                description: '',
                startTime: now,
                endTime: oneHourLater,
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
                startTime: data.startTime.toISOString(),
                endTime: data.endTime.toISOString(),
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
            toast.error(getApiErrorMessage(err, 'Failed to save booking. Check for time overlaps.'));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Booking' : 'New Booking'}
            maxWidth="md"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Meeting Title"
                    placeholder="e.g. Sprint Planning"
                    {...register('title')}
                    error={errors.title?.message}
                />

                <Textarea
                    label="Description"
                    rows={3}
                    placeholder="Agenda, notes, or links..."
                    {...register('description')}
                    error={errors.description?.message}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="startTime" className="mb-1 block text-sm font-medium text-gray-700">
                            Start Time
                        </label>
                        <Controller
                            control={control}
                            name="startTime"
                            render={({ field }) => (
                                <DatePicker
                                    id="startTime"
                                    selected={field.value ? new Date(field.value) : null}
                                    onChange={(date: Date | null) => field.onChange(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy HH:mm"
                                    minDate={!isEditing ? new Date() : undefined}
                                    selectsStart
                                    startDate={startTimeValue}
                                    endDate={endTimeValue}
                                    placeholderText="Select start time"
                                    wrapperClassName="w-full"
                                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                                />
                            )}
                        />
                        {errors.startTime && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.startTime?.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="endTime" className="mb-1 block text-sm font-medium text-gray-700">
                            End Time
                        </label>
                        <Controller
                            control={control}
                            name="endTime"
                            render={({ field }) => (
                                <DatePicker
                                    id="endTime"
                                    selected={field.value ? new Date(field.value) : null}
                                    onChange={(date: Date | null) => field.onChange(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="MMMM d, yyyy HH:mm"
                                    minDate={startTimeValue || (!isEditing ? new Date() : undefined)}
                                    selectsEnd
                                    startDate={startTimeValue}
                                    endDate={endTimeValue}
                                    placeholderText="Select end time"
                                    wrapperClassName="w-full"
                                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                                />
                            )}
                        />
                        {errors.endTime && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.endTime?.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Book Room'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}