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
        startTime: z.string().min(1, 'Start time is required'),
        endTime: z.string().min(1, 'End time is required'),
    })
    .refine(
        (data) => {
            const start = new Date(data.startTime).getTime();
            const end = new Date(data.endTime).getTime();
            return !isNaN(start) && !isNaN(end) && end > start;
        },
        {
            message: 'End time must be after start time',
            path: ['endTime'],
        }
    );

export type BookingFormValues = z.infer<typeof bookingSchema>;