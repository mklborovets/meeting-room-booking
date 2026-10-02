export const getApiErrorMessage = (error: unknown, fallbackMessage: string = 'An unexpected error occurred'): string => {
    if (typeof error === 'object' && error !== null) {
        const err = error as { data?: { message?: string }; message?: string };
        return err.data?.message || err.message || fallbackMessage;
    }
    return fallbackMessage;
};
