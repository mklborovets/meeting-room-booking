import { baseApi } from './baseApi';
import { Booking } from '@/types';

export const bookingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBookingsByRoom: builder.query<Booking[], string>({
            query: (roomId) => `/bookings/room/${roomId}`,
            providesTags: (result, error, roomId) => [
                { type: 'Booking', id: `ROOM_${roomId}` },
            ],
        }),
        createBooking: builder.mutation<
            Booking,
            {
                roomId: string;
                title: string;
                description?: string;
                startTime: string;
                endTime: string;
            }
        >({
            query: (body) => ({
                url: '/bookings',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { roomId }) => [
                { type: 'Booking', id: `ROOM_${roomId}` },
            ],
        }),
        updateBooking: builder.mutation<
            Booking,
            {
                id: string;
                roomId: string;
                title?: string;
                description?: string;
                startTime?: string;
                endTime?: string;
            }
        >({
            query: ({ id, roomId, ...body }) => ({
                url: `/bookings/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { roomId }) => [
                { type: 'Booking', id: `ROOM_${roomId}` },
            ],
        }),
        deleteBooking: builder.mutation<
            { message: string },
            { id: string; roomId: string }
        >({
            query: ({ id }) => ({
                url: `/bookings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { roomId }) => [
                { type: 'Booking', id: `ROOM_${roomId}` },
            ],
        }),
        toggleParticipation: builder.mutation<
            { message: string; joined?: boolean },
            { id: string; roomId: string }
        >({
            query: ({ id }) => ({
                url: `/bookings/${id}/participate`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, { roomId }) => [
                { type: 'Booking', id: `ROOM_${roomId}` },
            ],
        }),
    }),
});

export const {
    useGetBookingsByRoomQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
    useToggleParticipationMutation,
} = bookingsApi;