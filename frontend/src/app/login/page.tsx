'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validations/auth';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { baseApi } from '@/store/api/baseApi';
import { getApiErrorMessage } from '@/lib/error';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await login(data).unwrap();
            dispatch(baseApi.util.resetApiState());
            dispatch(setCredentials(response));
            toast.success('Signed in successfully');
            router.push('/');
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, 'Failed to sign in. Please check your credentials.'));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <LogIn className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign in to manage meeting room bookings
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}