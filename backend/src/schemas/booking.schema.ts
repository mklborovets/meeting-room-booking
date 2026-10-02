import { z } from 'zod';

export const createBookingSchema = z
    .object({
        roomId: z.string().uuid('Invalid room ID'),
        title: z.string().min(2, 'Title must be at least 2 characters'),
        description: z.string().optional(),
        startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid startTime format',
        }),
        endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid endTime format',
        }),
    })
    .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
        message: 'endTime must be after startTime',
        path: ['endTime'],
    });

export const updateBookingSchema = z
    .object({
        title: z.string().min(2, 'Title must be at least 2 characters').optional(),
        description: z.string().optional(),
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
    );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;