import { Sequelize } from 'sequelize-typescript';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';
import {
    User,
    Room,
    RoomMember,
    Booking,
    BookingParticipant,
} from '../models';
import { env } from './env';

export const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    models: [User, Room, RoomMember, Booking, BookingParticipant],
    dialectOptions: env.DB_SSL ? {
        ssl: {
            require: true,
            rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED,
        },
    } : undefined,
});

export const umzug = new Umzug({
    migrations: { glob: path.join(__dirname, '../migrations/*.{ts,js}').replace(/\\/g, '/') },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL successfully');
        await umzug.up();
        console.log('Database migrations verified');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};