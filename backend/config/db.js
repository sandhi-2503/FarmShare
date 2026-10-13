
import mongoose from 'mongoose';

const DATABASE_NAME = 'farmshare';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Stop immediately if the Atlas connection string is missing.
  if (!uri) {
    throw new Error(
      'MONGO_URI is missing. Please configure MongoDB Atlas in your backend .env file.'
    );
  }

  // Prevent accidental use of a local or in-memory database.
  if (!uri.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid MongoDB Atlas URI. Expected a connection string starting with mongodb+srv://'
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: DATABASE_NAME,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    console.log(
      `[MongoDB Atlas] Connected successfully: ${conn.connection.host}/${conn.connection.name}`
    );

    return conn;
  } catch (error) {
    console.error('[MongoDB Atlas] Connection failed.');
    console.error(`[MongoDB Atlas] Reason: ${error.message}`);

    // Do not silently switch to an in-memory or local database.
    throw error;
  }
};

export const closeDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('[MongoDB Atlas] Database connection closed.');
    }
  } catch (error) {
    console.error(
      '[MongoDB Atlas] Error while closing connection:',
      error.message
    );
    throw error;
  }
};
