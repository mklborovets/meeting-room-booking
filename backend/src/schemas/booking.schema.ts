import { z } from 'zod';

export const createBookingSchema = z
    .object({
        roomId: z.string().uuid('Invalid room ID'),
        title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title is too long'),
        description: z.string().max(1000, 'Description is too long').optional(),
        startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid startTime format',
        }),
        endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid endTime format',
        }),
    })
    .refine((data) => new Date(data.startTime) >= new Date(), {
        message: 'startTime cannot be in the past',
        path: ['startTime'],
    })
    .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
        message: 'endTime must be after startTime',
        path: ['endTime'],
    })
    .refine((data) => {
        const diffHours = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60 * 60);
        return diffHours <= 12;
    }, {
        message: 'Booking duration cannot exceed 12 hours',
        path: ['endTime'],
    });

export const updateBookingSchema = z
    .object({
        title: z.string().min(2, 'Title must be at least 2 characters').max(100, 'Title is too long').optional(),
        description: z.string().max(1000, 'Description is too long').optional(),
        startTime: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid startTime format',
            })
            .optional(),
        endTime: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: 'Invalid endTime format',
            })
            .optional(),
    })
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                return new Date(data.startTime) < new Date(data.endTime);
            }
            return true;
        },
        {
            message: 'endTime must be after startTime',
            path: ['endTime'],
        }
    )
    .refine(
        (data) => {
            if (data.startTime && data.endTime) {
                const diffHours = (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) / (1000 * 60 * 60);
                return diffHours <= 12;
            }
            return true;
        },
        {
            message: 'Booking duration cannot exceed 12 hours',
            path: ['endTime'],
        }
    );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;