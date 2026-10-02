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
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        {...register('name')}
                        error={errors.name?.message}
                    />

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
                        placeholder="At least 6 characters"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Repeat your password"
                        {...register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                    />

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </Button>
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