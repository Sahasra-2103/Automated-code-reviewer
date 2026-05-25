const mongoose = require('mongoose');
const { mongodbUri } = require('../config');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongodbUri) {
    const error = new Error('MONGODB_URI is not configured in the deployment environment.');
    error.status = 500;
    throw error;
  }

  try {
    await mongoose.connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    error.status = 500;
    throw error;
  }
};

module.exports = connectDB;
