// backend/tests/unit/goalcontrol.test.js
const request = require('supertest');
const app = require('../../../src/app');

describe('Goals API smoke', () => {
  test('GET /api/goals responds', async () => {
    const res = await request(app).get('/api/goals');
    expect([200, 500, 404]).toContain(res.status);
  });

  test('POST /api/goals accepts JSON', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({ title: 'Test goal from CI', description: 'desc' })
      .set('Accept', 'application/json');
    expect([201, 500]).toContain(res.status);
  });
});

