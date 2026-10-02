import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS btree_gist;');

    await queryInterface.createTable('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    await queryInterface.createTable('rooms', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    await queryInterface.createTable('room_members', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'rooms',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        role: {
            type: DataTypes.ENUM('ADMIN', 'USER'),
            allowNull: false,
            defaultValue: 'USER',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    await queryInterface.addIndex('room_members', {
        fields: ['roomId', 'userId'],
        unique: true,
        name: 'room_members_roomId_userId',
    });

    await queryInterface.createTable('bookings', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roomId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'rooms',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    await queryInterface.addIndex('bookings', {
        fields: ['roomId', 'startTime'],
        name: 'bookings_roomId_startTime',
    });

    await queryInterface.createTable('booking_participants', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        bookingId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'bookings',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    await queryInterface.addIndex('booking_participants', {
        fields: ['bookingId', 'userId'],
        unique: true,
        name: 'booking_participants_bookingId_userId',
    });

    const [results] = await queryInterface.sequelize.query(`
        SELECT conname 
        FROM pg_constraint 
        WHERE conname = 'no_overlap'
    `);

    if ((results as any[]).length === 0) {
        await queryInterface.sequelize.query(`
            ALTER TABLE bookings ADD CONSTRAINT no_overlap
            EXCLUDE USING gist ("roomId" WITH =, tstzrange("startTime", "endTime") WITH &&);
        `);
    }
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable('booking_participants');
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('room_members');
    await queryInterface.dropTable('rooms');
    await queryInterface.dropTable('users');

    await queryInterface.sequelize.query(`
        DROP TYPE IF EXISTS "enum_room_members_role";
    `);
};
