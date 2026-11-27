import { describe, it, expect, beforeAll } from 'vitest';
import { requireAuth, signToken } from './auth';

describe('Auth Middleware Helper (requireAuth)', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'vitest_jwt_secret_for_testing_1234567890';
  });

  it('returns 401 when no token is provided', async () => {
    const req = new Request('http://localhost:3000/api/leads');
    const result = await requireAuth(req, ['admin', 'broker']);
    expect(result.response).toBeDefined();
    expect(result.response?.status).toBe(401);

    const body = await result.response?.json();
    expect(body.error).toContain('Unauthorized');
  });

  it('returns 401 when token is invalid', async () => {
    const req = new Request('http://localhost:3000/api/leads', {
      headers: { cookie: 'token=invalid.token.here' }
    });
    const result = await requireAuth(req, ['admin', 'broker']);
    expect(result.response).toBeDefined();
    expect(result.response?.status).toBe(401);
  });

  it('returns 403 when user has wrong role', async () => {
    const customerToken = await signToken({
      id: 'cust-123',
      name: 'John Customer',
      email: 'john@example.com',
      role: 'customer'
    });

    const req = new Request('http://localhost:3000/api/leads', {
      headers: { cookie: `token=${customerToken}` }
    });
    const result = await requireAuth(req, ['admin', 'broker']);
    expect(result.response).toBeDefined();
    expect(result.response?.status).toBe(403);

    const body = await result.response?.json();
    expect(body.error).toContain('Forbidden');
  });

  it('passes when user has allowed role (admin)', async () => {
    const adminToken = await signToken({
      id: 'admin-123',
      name: 'Admin User',
      email: 'admin@prospera.ai',
      role: 'admin'
    });

    const req = new Request('http://localhost:3000/api/leads', {
      headers: { cookie: `token=${adminToken}` }
    });
    const result = await requireAuth(req, ['admin', 'broker']);
    expect(result.response).toBeUndefined();
    expect(result.user).toBeDefined();
    expect(result.user?.role).toBe('admin');
    expect(result.user?.name).toBe('Admin User');
  });

  it('passes when customer accesses customer-allowed endpoint', async () => {
    const customerToken = await signToken({
      id: 'cust-456',
      name: 'Jane Customer',
      email: 'jane@example.com',
      role: 'customer'
    });

    const req = new Request('http://localhost:3000/api/customer/applications', {
      headers: { cookie: `token=${customerToken}` }
    });
    const result = await requireAuth(req, ['customer', 'admin']);
    expect(result.response).toBeUndefined();
    expect(result.user).toBeDefined();
    expect(result.user?.role).toBe('customer');
    expect(result.user?.name).toBe('Jane Customer');
  });

  it('supports Authorization Bearer header as alternative to cookie', async () => {
    const adminToken = await signToken({
      id: 'admin-789',
      name: 'API Admin',
      email: 'api@prospera.ai',
      role: 'admin'
    });

    const req = new Request('http://localhost:3000/api/leads', {
      headers: { authorization: `Bearer ${adminToken}` }
    });
    const result = await requireAuth(req, ['admin']);
    expect(result.response).toBeUndefined();
    expect(result.user?.role).toBe('admin');
  });
});
