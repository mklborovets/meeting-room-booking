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
import { User } from './User';
import { RoomMember } from './RoomMember';
import { Booking } from './Booking';

@Table({
    tableName: 'rooms',
    timestamps: true,
})
export class Room extends Model {
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
        type: DataType.TEXT,
        allowNull: true,
    })
    description!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    createdBy!: string;

    @BelongsTo(() => User, 'createdBy')
    creator!: User;

    @HasMany(() => RoomMember, { onDelete: 'CASCADE' })
    members!: RoomMember[];

    @BelongsToMany(() => User, () => RoomMember)
    users!: User[];

    @HasMany(() => Booking, { onDelete: 'CASCADE' })
    bookings!: Booking[];
}
