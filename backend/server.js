#!/usr/bin/env node
// TODO: Server entry point with graceful shutdown and error handling

const app = require('./src/app');
const logger = app.get('logger');
const mongo = require('./src/database/mongo');

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 SkillWise API Server running on port ${PORT}`);
  logger.info(`📊 Health check available at http://localhost:${PORT}/healthz`);
  logger.info(`🌐 API endpoints available at http://localhost:${PORT}/api`);
  logger.info(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  // Connect to MongoDB if configured
  (async () => {
    try {
      await mongo.connect(process.env.MONGODB_URI);
    } catch (err) {
      logger.warn('MongoDB connect on startup failed:', err.message);
    }
  })();
});

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  logger.info(`📴 Received ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      logger.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }

    logger.info('✅ Server closed successfully');

    // Close database connections, cleanup resources, etc.
    (async () => {
      try {
        await mongo.disconnect();
      } catch (e) {
        /* eslint-disable-line no-empty */
      }
      process.exit(0);
    })();

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('⏰ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = server;
