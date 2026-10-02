import { baseApi } from './baseApi';
import { AuthResponse, User } from '@/types';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, Record<string, string>>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        login: builder.mutation<AuthResponse, Record<string, string>>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User', 'Room', 'Booking'],
        }),
        getMe: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['User'],
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;