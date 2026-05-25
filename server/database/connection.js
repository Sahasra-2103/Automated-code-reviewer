const mongoose = require('mongoose');
const { mongodbUri } = require('../config');

const connectDB = async () => {
  if (!mongodbUri) {
    console.error('MONGODB_URI is not configured.');
    return;
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
  }
};

module.exports = connectDB;
