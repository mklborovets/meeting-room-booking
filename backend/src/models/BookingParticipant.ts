import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Booking } from './Booking';
import { User } from './User';

@Table({
    tableName: 'booking_participants',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['bookingId', 'userId'],
        },
    ],
})
export class BookingParticipant extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @ForeignKey(() => Booking)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        onDelete: 'CASCADE',
    })
    bookingId!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        onDelete: 'CASCADE',
    })
    userId!: string;

    @BelongsTo(() => Booking)
    booking!: Booking;

    @BelongsTo(() => User)
    user!: User;
}
