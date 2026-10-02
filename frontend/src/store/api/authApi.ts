import { baseApi } from './baseApi';
import { AuthResponse, User } from '@/types';
import { LoginFormValues, RegisterFormValues } from '@/lib/validations/auth';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, Omit<RegisterFormValues, 'confirmPassword'>>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        login: builder.mutation<AuthResponse, LoginFormValues>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User', 'Room', 'Booking'],
        }),
        getMe: builder.query<User, void>({
            query: () => '/auth/me',
            transformResponse: (response: { user: User }) => response.user,
            providesTags: ['User'],
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Room', 'Booking'],
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetMeQuery } = authApi;