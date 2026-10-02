import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';
import { Room } from './Room';
import { User } from './User';
import { BookingParticipant } from './BookingParticipant';

@Table({
    tableName: 'bookings',
    timestamps: true,
})
export class Booking extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id!: string;

    @ForeignKey(() => Room)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        onDelete: 'CASCADE',
    })
    roomId!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    createdBy!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startTime!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    endTime!: Date;

    @BelongsTo(() => Room)
    room!: Room;

    @BelongsTo(() => User, 'createdBy')
    creator!: User;

    @HasMany(() => BookingParticipant, { onDelete: 'CASCADE' })
    bookingParticipants!: BookingParticipant[];

    @BelongsToMany(() => User, () => BookingParticipant)
    participants!: User[];
}