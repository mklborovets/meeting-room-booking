'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { roomSchema, RoomFormValues } from '@/lib/validations/room';
import {
    useCreateRoomMutation,
    useUpdateRoomMutation,
} from '@/store/api/roomsApi';
import { Room } from '@/types';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    room?: Room | null;
}

export default function RoomModal({ isOpen, onClose, room }: RoomModalProps) {
    const isEditing = !!room;
    const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();
    const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RoomFormValues>({
        resolver: zodResolver(roomSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (room) {
            reset({
                name: room.name,
                description: room.description || '',
            });
        } else {
            reset({
                name: '',
                description: '',
            });
        }
    }, [room, reset, isOpen]);

    if (!isOpen) return null;

    const isLoading = isCreating || isUpdating;

    const onSubmit = async (data: RoomFormValues) => {
        try {
            if (isEditing && room) {
                await updateRoom({ id: room.id, ...data }).unwrap();
                toast.success('Room updated successfully');
            } else {
                await createRoom(data).unwrap();
                toast.success('Room created successfully');
            }
            onClose();
        } catch (err: unknown) {
            const apiError = err as { data?: { message?: string } };
            toast.error(apiError?.data?.message || 'Failed to save room');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEditing ? 'Edit Meeting Room' : 'Create Meeting Room'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Room Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Conference Room A"
                            {...register('name')}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Capacity, projector availability, floor..."
                            {...register('description')}
                            className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isLoading
                                ? 'Saving...'
                                : isEditing
                                    ? 'Save Changes'
                                    : 'Create Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}