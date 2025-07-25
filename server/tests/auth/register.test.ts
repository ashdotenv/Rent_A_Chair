import request from 'supertest';
import { app } from '../../app';
import { describe, it, expect } from 'vitest';

const validUser = {
  fullName: 'Test User',
  email: 'ashishghimire092@gmail.com',
  password: 'TestPass123!',
  phone: '1234567890',
  address: '123 Test St',
};

describe('Register User', () => {
  it('should register a user with valid data', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-user')
      .send(validUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(validUser.email);
  });

  it('should not register a user with missing required fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-user')
      .send({ email: 'missing@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should not register a user with duplicate email', async () => {
    await request(app)
      .post('/api/v1/auth/register-user')
      .send(validUser);
    const res = await request(app)
      .post('/api/v1/auth/register-user')
      .send(validUser);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should not register a user with invalid referral code', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-user')
      .send({ ...validUser, email: 'referral@example.com', referralCode: 'INVALIDCODE' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
}); 