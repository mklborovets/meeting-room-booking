'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetMeQuery } from '@/store/api/authApi';
import { setUser, logout } from '@/store/slices/authSlice';

const PUBLIC_PATHS = ['/login', '/register'];

export default function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { token, isAuthenticated, isInitialized, user } = useAppSelector(
        (state) => state.auth
    );

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    const { data: userData, isError, isLoading } = useGetMeQuery(undefined, {
        skip: !isInitialized || !token || !!user,
    });

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData));
        }
    }, [userData, dispatch]);

    useEffect(() => {
        if (isError) {
            dispatch(logout());
            if (!isPublicPath) {
                router.replace('/login');
            }
        }
    }, [isError, dispatch, isPublicPath, router]);

    useEffect(() => {
        if (!isInitialized) return;

        if (!isAuthenticated && !token && !isPublicPath) {
            router.replace('/login');
        } else if (isAuthenticated && isPublicPath) {
            router.replace('/');
        }
    }, [isInitialized, isAuthenticated, token, isPublicPath, router]);

    if (!isInitialized || (token && !user && isLoading)) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated && !isPublicPath) {
        return null;
    }

    return <>{children}</>;
}