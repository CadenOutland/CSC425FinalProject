const request = require('supertest');
const app = require('../../src/app');

describe('Authentication Integration', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser+${Date.now()}@example.com`,
    password: 'Password123',
  };

  let agent = request.agent(app);

  test('POST /api/auth/register should create a new user and set refresh cookie', async () => {
    const res = await agent
      .post('/api/auth/register')
      .send({
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        password: testUser.password,
        confirmPassword: testUser.password,
      })
      .expect(201);

    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('accessToken');

    // Refresh token cookie should be set
    const cookies = res.headers['set-cookie'] || [];
    const hasRefreshCookie = cookies.some((c) => c.includes('refreshToken'));
    expect(hasRefreshCookie).toBe(true);
  });

  test('POST /api/auth/login should authenticate and return access token', async () => {
    const res = await agent
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('accessToken');

    // Cookie should be set on login too
    const cookies = res.headers['set-cookie'] || [];
    const hasRefreshCookie = cookies.some((c) => c.includes('refreshToken'));
    expect(hasRefreshCookie).toBe(true);
  });

  test('POST /api/auth/refresh should rotate refresh token and return new access token', async () => {
    // Call refresh using cookie stored in agent
    const res = await agent.post('/api/auth/refresh').send({}).expect(200);

    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('accessToken');

    const cookies = res.headers['set-cookie'] || [];
    const hasRefreshCookie = cookies.some((c) => c.includes('refreshToken'));
    expect(hasRefreshCookie).toBe(true);
  });
});
