'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/validations/auth';
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { baseApi } from '@/store/api/baseApi';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { getApiErrorMessage } from '@/lib/error';

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [registerUser, { isLoading }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const { confirmPassword, ...registerPayload } = data;
            const response = await registerUser(registerPayload).unwrap();
            dispatch(baseApi.util.resetApiState());
            dispatch(setCredentials(response));
            toast.success('Account created successfully');
            router.push('/');
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, 'Registration failed. Please try a different email.'));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign up to start booking meeting rooms
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            {...register('name')}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            {...register('email')}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="At least 6 characters"
                            {...register('password')}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Repeat your password"
                            {...register('confirmPassword')}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}