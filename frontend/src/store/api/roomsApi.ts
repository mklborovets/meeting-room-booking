import { baseApi } from './baseApi';
import { Room, Role } from '@/types';

export const roomsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query<Room[], void>({
            query: () => '/rooms',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Room' as const, id })),
                        { type: 'Room', id: 'LIST' },
                    ]
                    : [{ type: 'Room', id: 'LIST' }],
        }),
        getRoomById: builder.query<Room, string>({
            query: (id) => `/rooms/${id}`,
            providesTags: (result, error, id) => [{ type: 'Room', id }],
        }),
        createRoom: builder.mutation<Room, { name: string; description?: string }>({
            query: (body) => ({
                url: '/rooms',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Room', id: 'LIST' }],
        }),
        updateRoom: builder.mutation<
            Room,
            { id: string; name: string; description?: string }
        >({
            query: ({ id, ...body }) => ({
                url: `/rooms/${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Room', id },
                { type: 'Room', id: 'LIST' },
            ],
        }),
        deleteRoom: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/rooms/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Room', id: 'LIST' }],
        }),
        addRoomMember: builder.mutation<
            void,
            { roomId: string; email: string; role: Role }
        >({
            query: ({ roomId, ...body }) => ({
                url: `/rooms/${roomId}/members`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { roomId }) => [
                { type: 'Room', id: roomId },
                { type: 'Room', id: 'LIST' },
            ],
        }),
        removeRoomMember: builder.mutation<
            void,
            { roomId: string; userId: string }
        >({
            query: ({ roomId, userId }) => ({
                url: `/rooms/${roomId}/members/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { roomId }) => [
                { type: 'Room', id: roomId },
                { type: 'Room', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetRoomsQuery,
    useGetRoomByIdQuery,
    useCreateRoomMutation,
    useUpdateRoomMutation,
    useDeleteRoomMutation,
    useAddRoomMemberMutation,
    useRemoveRoomMemberMutation,
} = roomsApi;