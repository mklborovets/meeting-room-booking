'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, LogOut, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { baseApi } from '@/store/api/baseApi';
import toast from 'react-hot-toast';

import { useLogoutMutation } from '@/store/api/authApi';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [logoutApi] = useLogoutMutation();

    if (!isAuthenticated || pathname === '/login' || pathname === '/register') {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error('Logout failed on backend:', error);
        }
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
        toast.success('Logged out successfully');
        router.push('/login');
    };

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <span>RoomBooking</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{user.name}</span>
                            <span className="hidden text-gray-400 sm:inline">
                                ({user.email})
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}