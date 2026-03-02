import mongoose from 'mongoose';

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('No URI found');
    console.log('Attempting to connect to:', uri.substring(0, 40) + '...');

    try {
        await mongoose.connect(uri);
        console.log('SUCCESS: Connected to MongoDB Database successfully!');
        process.exit(0);
    } catch (error) {
        console.error('FAILED TO CONNECT:', error);
        process.exit(1);
    }
}

testConnection();
