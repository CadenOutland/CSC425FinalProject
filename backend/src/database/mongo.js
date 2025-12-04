const mongoose = require('mongoose');
const pino = require('pino');

const logger = pino({ name: 'skillwise-mongo' });

const connect = async (mongoUri) => {
  const uri = mongoUri || process.env.MONGODB_URI;
  if (!uri) {
    logger.warn('No MONGODB_URI provided, skipping MongoDB connection');
    return null;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    logger.info('✅ Connected to MongoDB');

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB runtime error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected');
    });

    return mongoose.connection;
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (err) {
    logger.warn('Error disconnecting MongoDB:', err.message);
  }
};

module.exports = { connect, disconnect, mongoose };
