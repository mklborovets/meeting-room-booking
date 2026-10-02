import {
    createApi,
    fetchBaseQuery,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';
import type { RootState } from '../store';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    const url = typeof args === 'string' ? args : args.url;
    const isAuthRequest = url.startsWith('/auth/login') || url.startsWith('/auth/register');

    if (result.error && result.error.status === 401 && !isAuthRequest) {
        api.dispatch(logout());
        api.dispatch(baseApi.util.resetApiState());
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Room', 'Booking'],
    endpoints: () => ({}),
});