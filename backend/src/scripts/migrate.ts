import { connectDB } from '../config/database';

console.log('Running migrations manually...');

connectDB().then(() => {
    console.log('Migration script completed successfully.');
    process.exit(0);
}).catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
});
