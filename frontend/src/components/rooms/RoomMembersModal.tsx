'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2, UserPlus, Shield, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { addMemberSchema, AddMemberFormValues } from '@/lib/validations/room';
import {
    useAddRoomMemberMutation,
    useRemoveRoomMemberMutation,
    useGetRoomByIdQuery,
} from '@/store/api/roomsApi';
import { useAppSelector } from '@/store/hooks';
import { getRoomRole } from '@/lib/roles';
import { getApiErrorMessage } from '@/lib/error';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Room } from '@/types';

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

    const members = [...(activeRoom.members)].sort((a, b) => {
        if (a.userId === activeRoom.createdBy) return -1;
        if (b.userId === activeRoom.createdBy) return 1;
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
        return a.user.name.localeCompare(b.user.name);
    });

    const { isCreator, isAdmin } = getRoomRole(activeRoom, currentUser);

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
            toast.error(getApiErrorMessage(err, 'Failed to add member'));
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            await removeMember({ roomId: activeRoom.id, userId }).unwrap();
            toast.success('Member removed');
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, 'Failed to remove member'));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Room Members"
            subtitle={activeRoom.name}
            maxWidth="lg"
        >
            {isAdmin && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Add Member by Email
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row items-start">
                        <div className="flex-1 w-full">
                            <Input
                                label=""
                                type="email"
                                placeholder="colleague@example.com"
                                {...register('email')}
                                error={errors.email?.message}
                                aria-label="New member email"
                            />
                        </div>

                        <select
                            {...register('role')}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                            aria-label="New member role"
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>

                        <Button
                            type="submit"
                            isLoading={isAdding}
                            icon={<UserPlus />}
                        >
                            {isAdding ? 'Adding...' : 'Add'}
                        </Button>
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
                            key={member.id}
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
                                        {member.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {member.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant={member.role === 'ADMIN' ? 'primary' : 'secondary'}>
                                    {member.role === 'ADMIN' && member.userId === activeRoom.createdBy ? 'CREATOR' : member.role}
                                </Badge>

                                {(isCreator || (isAdmin && member.role !== 'ADMIN')) && member.userId !== currentUser?.id && member.userId !== activeRoom.createdBy && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleRemoveMember(member.userId)}
                                        disabled={isRemoving}
                                        aria-label="Remove member"
                                        className="!p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Modal>
    );
}