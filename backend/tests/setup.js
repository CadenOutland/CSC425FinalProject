// TODO: Test environment setup and configuration
const { Pool } = require('pg');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongo = require('../src/database/mongo');

// Test database configuration
const testDbConfig = {
  connectionString: process.env.TEST_DATABASE_URL || 
    'postgresql://skillwise_user:skillwise_pass@localhost:5432/skillwise_test_db',
  // Reduce connections for test environment
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 1000,
};

const testPool = new Pool(testDbConfig);

let mongoServer;

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-for-testing-only';
  
  // Start in-memory MongoDB for tests (used by auth tests)
  try {
    if (!process.env.TEST_MONGODB_URI) {
      mongoServer = await MongoMemoryServer.create();
      process.env.TEST_MONGODB_URI = mongoServer.getUri();
    }

    await mongo.connect(process.env.TEST_MONGODB_URI);
    console.log('✅ In-memory MongoDB started for tests');
  } catch (err) {
    console.error('❌ In-memory MongoDB failed to start:', err.message);
    throw err;
  }

  // Optionally skip Postgres connection for unit tests to avoid requirement of Postgres in local test runs
  const skipPg = process.env.SKIP_PG_TESTS === 'true' || process.env.SKIP_PG_TESTS === undefined;
  if (!skipPg) {
    // Test Postgres database connection
    try {
      await testPool.query('SELECT 1');
      console.log('✅ Test Postgres database connected');
    } catch (err) {
      console.error('❌ Test Postgres database connection failed:', err.message);
      throw err;
    }
  } else {
    console.log('ℹ️ Skipping Postgres test connection (SKIP_PG_TESTS)');
  }
});

// Global test cleanup
afterAll(async () => {
  try {
    // Close Postgres pool if used
    try { await testPool.end(); } catch (e) {}

    // Stop in-memory mongo
    try { await mongo.disconnect(); } catch (e) {}
    if (mongoServer) await mongoServer.stop();

    console.log('✅ Test database cleanup completed');
  } catch (err) {
    console.error('❌ Test cleanup failed:', err.message);
  }
});

// Helper function to clear test data between tests
const clearTestData = async () => {
  const tables = [
    'user_achievements',
    'achievements', 
    'leaderboard',
    'progress_events',
    'peer_reviews',
    'ai_feedback',
    'submissions',
    'challenges',
    'goals',
    'refresh_tokens',
    'users'
  ];

  for (const table of tables) {
    try {
      await testPool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    } catch (err) {
      // Table might not exist, continue
      console.warn(`Warning: Could not truncate table ${table}:`, err.message);
    }
  }
};

// Export test utilities
module.exports = {
  testPool,
  clearTestData
};