import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in the environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI as string, {});

    console.log('MongoDB connected');

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to', process.env.MONGO_URI);
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    // Handle app termination gracefully
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
