'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useGetMeQuery } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';

export default function AuthProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isPublicRoute = pathname === '/login' || pathname === '/register';
    const { data: user, isLoading } = useGetMeQuery(undefined, {
        skip: isPublicRoute,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (user) {
            dispatch(setUser(user));
        }
    }, [user, dispatch]);

    if (isLoading && !isPublicRoute) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}
