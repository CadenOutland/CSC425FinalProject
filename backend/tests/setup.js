// backend/tests/setup.js
// Minimal mock test environment (No Mongo, No Postgres)

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

  console.log("🧪 Test environment initialized (Mock Mode)");
});

afterAll(() => {
  console.log("🧹 Test environment cleaned (Mock Mode)");
});

// A simple utility to clear mocks between tests
module.exports.clearMocks = () => {
  jest.clearAllMocks();
};
