import { z } from 'zod';

export const bookingSchema = z
    .object({
        title: z
            .string()
            .min(2, 'Title must be at least 2 characters')
            .max(120, 'Title must be under 120 characters'),
        description: z
            .string()
            .max(500, 'Description must be under 500 characters')
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
            return data.endTime > data.startTime;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime'],
        }
    );

export type BookingFormValues = z.infer<typeof bookingSchema>;