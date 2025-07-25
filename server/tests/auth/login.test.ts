import request from 'supertest';
import { app } from '../../app';
import { describe, it, expect } from 'vitest';

const validUser = {
  email: 'ashishghimire092@gmail.com',
  password: 'LoginPass123!'
};

describe('Login User', () => {
  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-user')
      .send({ password: validUser.password });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide email and password');
  });

  it('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-user')
      .send({ email: validUser.email });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please provide email and password');
  });

  it('should return 401 for non-existent user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-user')
      .send({ email: 'nouser@example.com', password: 'AnyPass123!' });
    if (res.status !== 401) console.log('FAILED TEST (non-existent user):', res.body);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should return 401 for incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-user')
      .send({ email: validUser.email, password: 'WrongPass123!' });
    if (res.status !== 401) console.log('FAILED TEST (incorrect password):', res.body);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  it('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-user')
      .send(validUser);
    if (res.status !== 200) console.log('FAILED TEST (correct credentials):', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(validUser.email);
  });
});