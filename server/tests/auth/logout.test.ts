import request from 'supertest';
import { app } from '../../app';
import { describe, it, expect, beforeAll } from 'vitest';

const user = {
  email: 'ashishghimire092@gmail.com',
  password: 'LoginPass123!'
};


let authToken: string;

describe('Logout User', () => {
  beforeAll(async () => {
    // Register user
    await request(app).post('/api/v1/auth/register-user').send(user);
    // Login to get token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    authToken = loginRes.body.token;
  });

  it('should logout successfully when logged in', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', [`token=${authToken}`]);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/logged out/i);
  });

  it('should logout successfully even if not logged in', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/logged out/i);
  });
}); 