import request from 'supertest';
import { app } from '../../app';
import { describe, it, expect, beforeAll } from 'vitest';

const user = {
  email: 'changepassuser@example.com',
  password: 'OldPassword123!'
};

let resetToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzZTQyNmEzLTZkNWQtNDE4NC04ZTIyLWQ4MmFlNjg1NmRmZCIsImVtYWlsIjoiYXNoaXNoZ2hpbWlyZTA5MkBnbWFpbC5jb20iLCJyZXNldENvZGVIYXNoIjoiYjgyMWY5YmVkMjNhMjQxZCIsImlhdCI6MTc1MjQ4ODEzNywiZXhwIjoxNzUyNDg4NDM3fQ.Yre1RvqZdBQth5dSueU2CeSWw0adV4ek8ktqZ7GCPK8";
let resetCode: string = "7262"; 


describe('Change Password (reset flow)', () => {

  it('should fail to change password with invalid reset code', async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({ token: resetToken, resetCode: 'wrong', newPassword: 'NewPassword123!' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should fail to change password if required fields are missing', async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should change password with correct token and reset code', async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({ token: resetToken, resetCode: resetCode, newPassword: 'NewPassword123!' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should fail to change password if newPassword is missing', async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({ token: resetToken, resetCode: resetCode });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail to change password if newPassword is empty', async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({ token: resetToken, resetCode: resetCode, newPassword: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail to change password if token is missing', async () => {
    const res = await request(app)
      .put('/api/v1/auth/change-password')
      .send({ resetCode: resetCode, newPassword: 'NewPassword123!' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

}); 