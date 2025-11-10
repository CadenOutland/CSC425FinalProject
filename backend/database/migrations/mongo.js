// backend/src/database/mongo.js
const mongoose = require('mongoose');
const debug = require('debug')('skillwise:mongo');

async function connect(uri) {
  const mongoUri = uri || process.env.MONGODB_URI || process.env.TEST_MONGODB_URI;
  if (!mongoUri) {
    debug('No MONGODB_URI provided, cannot connect to MongoDB');
    throw new Error('MONGODB_URI not set in environment');
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  debug('Connected to MongoDB');
  return mongoose.connection;
}

async function disconnect() {
  try {
    await mongoose.disconnect();
    debug('Disconnected from MongoDB');
  } catch (err) {
    debug('Error disconnecting', err);
  }
}

module.exports = { connect, disconnect, mongoose };


