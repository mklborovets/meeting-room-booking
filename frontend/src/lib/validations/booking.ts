import { z } from 'zod';

export const bookingSchema = z
    .object({
        title: z
            .string()
            .min(2, 'Title must be at least 2 characters')
            .max(100, 'Title must be under 100 characters'),
        description: z
            .string()
            .max(1000, 'Description must be under 1000 characters')
            .optional(),
        startTime: z.coerce.date({
            required_error: "Start time is required",
            invalid_type_error: "That's not a valid date",
        }),
        endTime: z.coerce.date({
            required_error: "End time is required",
            invalid_type_error: "That's not a valid date",
        }),
    })
    .refine(
        (data) => {
            return data.startTime.getTime() >= Date.now() - 5 * 60 * 1000;
        },
        {
            message: 'Start time cannot be in the past',
            path: ['startTime'],
        }
    )
    .refine(
        (data) => {
            return data.endTime > data.startTime;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime'],
        }
    )
    .refine(
        (data) => {
            const durationMs = data.endTime.getTime() - data.startTime.getTime();
            return durationMs <= 12 * 60 * 60 * 1000;
        },
        {
            message: 'Meeting duration cannot exceed 12 hours',
            path: ['endTime'],
        }
    );

export type BookingFormValues = z.infer<typeof bookingSchema>;