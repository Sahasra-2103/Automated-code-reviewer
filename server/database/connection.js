const mongoose = require('mongoose');
const { mongodbUri } = require('../config');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongodbUri) {
    const error = new Error('MONGODB_URI is not configured. Please set MONGODB_URI environment variable in Vercel project settings.');
    error.status = 500;
    throw error;
  }

  try {
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    const connectionError = new Error(`Database connection failed: ${error.message}`);
    connectionError.status = 503;
    throw connectionError;
  }
};

module.exports = connectDB;
