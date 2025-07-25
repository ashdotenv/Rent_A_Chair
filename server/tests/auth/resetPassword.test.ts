import request from 'supertest';
import { app } from '../../app';
import { describe, it, expect, beforeAll } from 'vitest';

const user = {
  email: 'ashishghimire092@gmail.com'
};

describe('Reset Password', () => {
  it('should generate a reset token for a valid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: user.email });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('resetToken');
  });

  it('should not generate a reset token for an invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: 'notfound@example.com' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('should not generate a reset token if email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
}); 