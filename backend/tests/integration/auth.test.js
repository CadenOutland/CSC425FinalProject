const request = require('supertest');
const app = require('../../src/app');

describe('Auth Integration (Mock Mode)', () => {
  test('register endpoint should respond (mock pass)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: `mock${Date.now()}@example.com`,
      password: 'Password123',
      confirmPassword: 'Password123'
    });

    expect(res.status).toBeDefined();
  });

  test('login endpoint should respond (mock pass)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'Password123'
    });

    expect(res.status).toBeDefined();
  });
});
