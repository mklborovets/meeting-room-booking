'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import toast from 'react-hot-toast';
import { roomSchema, RoomFormValues } from '@/lib/validations/room';
import {
    useCreateRoomMutation,
    useUpdateRoomMutation,
} from '@/store/api/roomsApi';
import { Room } from '@/types';
import { getApiErrorMessage } from '@/lib/error';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
            toast.error(getApiErrorMessage(err, 'Failed to save room'));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Meeting Room' : 'Create Meeting Room'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Room Name"
                    placeholder="e.g. Conference Room A"
                    {...register('name')}
                    error={errors.name?.message}
                />

                <Textarea
                    label="Description"
                    rows={3}
                    placeholder="Capacity, projector availability, floor..."
                    {...register('description')}
                    error={errors.description?.message}
                />

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Room'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}