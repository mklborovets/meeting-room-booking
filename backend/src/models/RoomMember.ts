import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './User';
import { Room } from './Room';

export enum RoomRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

@Table({
    tableName: 'room_members',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['roomId', 'userId'],
        },
    ],
})
export class RoomMember extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

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
        onDelete: 'CASCADE',
    })
    userId!: string;

    @Column({
        type: DataType.ENUM(...Object.values(RoomRole)),
        allowNull: false,
        defaultValue: RoomRole.USER,
    })
    role!: RoomRole;

    @BelongsTo(() => Room)
    room!: Room;

    @BelongsTo(() => User)
    user!: User;
}