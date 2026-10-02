'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Trash2, UserPlus, Shield, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { addMemberSchema, AddMemberFormValues } from '@/lib/validations/room';
import {
    useAddRoomMemberMutation,
    useRemoveRoomMemberMutation,
    useGetRoomByIdQuery,
} from '@/store/api/roomsApi';
import { Room } from '@/types';
import { useAppSelector } from '@/store/hooks';

interface RoomMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    room: Room | null;
}

export default function RoomMembersModal({
    isOpen,
    onClose,
    room,
}: RoomMembersModalProps) {
    const currentUser = useAppSelector((state) => state.auth.user);

    const { data: roomDetails } = useGetRoomByIdQuery(room?.id ?? '', {
        skip: !isOpen || !room,
    });

    const activeRoom = roomDetails || room;

    const [addMember, { isLoading: isAdding }] = useAddRoomMemberMutation();
    const [removeMember, { isLoading: isRemoving }] =
        useRemoveRoomMemberMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddMemberFormValues>({
        resolver: zodResolver(addMemberSchema),
        defaultValues: {
            email: '',
            role: 'USER',
        },
    });

    if (!isOpen || !activeRoom) return null;

    const members = [...(activeRoom.members || [])].sort((a, b) => {
        if (a.userId === activeRoom.createdBy) return -1;
        if (b.userId === activeRoom.createdBy) return 1;
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
        return (a.user?.name || '').localeCompare(b.user?.name || '');
    });

    const currentMemberRecord = members.find(
        (m) => m.userId === currentUser?.id
    );
    const isCreator = activeRoom.createdBy === currentUser?.id;
    const isAdmin = isCreator || currentMemberRecord?.role === 'ADMIN';

    const onSubmit = async (data: AddMemberFormValues) => {
        try {
            await addMember({
                roomId: activeRoom.id,
                email: data.email,
                role: data.role,
            }).unwrap();
            toast.success('Member added successfully');
            reset({ email: '', role: 'USER' });
        } catch (err: unknown) {
            const apiError = err as { data?: { message?: string } };
            toast.error(apiError?.data?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeMember({ roomId: activeRoom.id, userId }).unwrap();
            toast.success('Member removed');
        } catch (err: unknown) {
            const apiError = err as { data?: { message?: string } };
            toast.error(apiError?.data?.message || 'Failed to remove member');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Room Members</h2>
                        <p className="text-sm text-gray-500">{activeRoom.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {isAdmin && (
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                            Add Member by Email
                        </label>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    placeholder="colleague@example.com"
                                    {...register('email')}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <select
                                {...register('role')}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>

                            <button
                                type="submit"
                                disabled={isAdding}
                                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>{isAdding ? 'Adding...' : 'Add'}</span>
                            </button>
                        </div>
                    </form>
                )}

                <div className="max-h-64 space-y-2 overflow-y-auto">
                    {members.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-500">
                            No members assigned to this room yet.
                        </p>
                    ) : (
                        members.map((member) => (
                            <div
                                key={member.id || `${member.roomId}-${member.userId}`}
                                className="flex items-center justify-between rounded-lg border border-gray-200 px-3.5 py-2.5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                        {member.role === 'ADMIN' ? (
                                            <Shield className="h-4 w-4 text-blue-600" />
                                        ) : (
                                            <UserIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {member.user?.name || `User #${member.userId}`}
                                        </p>
                                        {member.user?.email && (
                                            <p className="text-xs text-gray-500">
                                                {member.user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${member.role === 'ADMIN'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {member.role === 'ADMIN' && member.userId === activeRoom.createdBy ? 'CREATOR' : member.role}
                                    </span>

                                    {(isCreator || (isAdmin && member.role !== 'ADMIN')) && member.userId !== currentUser?.id && member.userId !== activeRoom.createdBy && (
                                        <button
                                            onClick={() => handleRemoveMember(member.userId)}
                                            disabled={isRemoving}
                                            title="Remove member"
                                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}