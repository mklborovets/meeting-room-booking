import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';
import { Room } from './Room';
import { RoomMember } from './RoomMember';
import { Booking } from './Booking';
import { BookingParticipant } from './BookingParticipant';

@Table({
    tableName: 'users',
    timestamps: true,
})
export class User extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    passwordHash!: string;

    @HasMany(() => Room, 'createdBy')
    createdRooms!: Room[];

    @HasMany(() => RoomMember, 'userId')
    roomMemberships!: RoomMember[];

    @BelongsToMany(() => Room, () => RoomMember)
    rooms!: Room[];

    @HasMany(() => Booking, 'createdBy')
    createdBookings!: Booking[];

    @BelongsToMany(() => Booking, () => BookingParticipant)
    participatingBookings!: Booking[];
}