import { Calendar, Shield, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Room } from '@/types';

interface RoomHeaderProps {
    room: Room;
    isRoomAdmin: boolean;
    onBookRoom: () => void;
    onMembersClick: () => void;
}

export function RoomHeader({
    room,
    isRoomAdmin,
    onBookRoom,
    onMembersClick,
}: RoomHeaderProps) {
    return (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
                        {isRoomAdmin && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                                <Shield className="h-3 w-3" />
                                Admin
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                        {room.description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        variant="outline"
                        onClick={onMembersClick}
                        icon={<Users />}
                    >
                        Members ({room.members?.length || 0})
                    </Button>

                    {isRoomAdmin && (
                        <Button onClick={onBookRoom} icon={<Plus />}>
                            Book Room
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
