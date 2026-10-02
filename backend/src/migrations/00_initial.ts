import { sequelize as currentSequelize } from '../config/database';

export const up = async ({ context: queryInterface }: { context: any }) => {
    await currentSequelize.sync({ alter: true });

    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS btree_gist;');

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

export const down = async ({ context: queryInterface }: { context: any }) => {
    await queryInterface.dropAllTables();
};
