import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ValidationError, DatabaseError } from 'sequelize';

import { ApiError } from '../errors/ApiError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation error',
            errors: err.issues.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }

    if (err instanceof ValidationError) {
        return res.status(409).json({
            message: 'Database validation error or duplicate entry',
            errors: err.errors.map((e) => ({
                field: e.path,
                message: e.message,
            })),
        });
    }

    if (err instanceof DatabaseError) {
        if (err.message.includes('invalid input syntax for type uuid')) {
            return res.status(400).json({
                message: 'Invalid ID format provided',
            });
        }
        if (err.message.includes('no_overlap')) {
            return res.status(409).json({
                message: 'The selected time slot conflicts with an existing booking',
            });
        }
    }

    console.error('Unhandled Error:', err);
    return res.status(500).json({
        message: 'Internal server error',
    });
};