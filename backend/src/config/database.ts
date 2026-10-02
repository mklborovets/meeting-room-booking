import { Sequelize } from 'sequelize-typescript';
import { Umzug, SequelizeStorage } from 'umzug';
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
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED,
        },
    },
});

export const umzug = new Umzug({
    migrations: { glob: 'src/migrations/*.ts' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to Neon PostgreSQL successfully');
        await umzug.up();
        console.log('Database migrations verified');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};