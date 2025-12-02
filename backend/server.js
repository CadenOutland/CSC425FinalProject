#!/usr/bin/env node
require('dotenv').config({ path: './.env' });

const app = require('./src/app');
const logger = app.get('logger');
const mongo = require('./src/database/mongo');

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 SkillWise API running on port ${PORT}`);
  logger.info(`📊 Health: http://localhost:${PORT}/healthz`);
  logger.info(`🌐 API: http://localhost:${PORT}/api`);
  logger.info(`🔒 Env: ${process.env.NODE_ENV || 'development'}`);

  // OPTIONAL: Connect Mongo only if MONGODB_URI exists
  (async () => {
    try {
      if (process.env.MONGODB_URI) {
        await mongo.connect(process.env.MONGODB_URI);
        logger.info("🟢 Mongo connected");
      } else {
        logger.info("🟡 No MONGODB_URI provided — Mongo skipped");
      }
    } catch (err) {
      logger.warn('🟠 MongoDB connect failed:', err.message);
    }
  })();
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`📴 Received ${signal}. Shutting down...`);
  
  server.close(async (err) => {
    if (err) {
      logger.error('❌ Shutdown error:', err);
      process.exit(1);
    }

    logger.info('✅ Server closed');

    try {
      if (process.env.MONGODB_URI) await mongo.disconnect();
    } catch (e) {}

    process.exit(0);
  });

  setTimeout(() => {
    logger.error('⏰ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

module.exports = server;
