import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
  },
}));

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully logs in with correct PIN', async () => {
    const { prisma } = await import('@/lib/prisma');

    const mockUser = {
      id: 'user-123',
      name: 'Mutfak Personeli',
      role: 'STAFF',
      phone: '+905001234567',
    };

    vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.user.id).toBe('user-123');
    expect(json.user.name).toBe('Mutfak Personeli');
    expect(json.user.role).toBe('STAFF');

    // Check if cookie was set
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader).toContain('session=');
    expect(setCookieHeader).toContain('HttpOnly');
  });

  it('rejects login with incorrect PIN', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.user.findFirst).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '9999' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.message).toBe('Hatalı PIN');
    expect(response.status).toBe(401);
  });

  it('validates PIN format (must be 4 digits)', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '12' }), // Too short
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.message).toBe('Geçersiz PIN formatı');
    expect(response.status).toBe(400);
  });

  it('handles missing PIN in request', async () => {
    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), // No PIN
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.message).toBe('Geçersiz PIN formatı');
    expect(response.status).toBe(400);
  });

  it('handles database errors', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.user.findFirst).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.message).toBe('Giriş başarısız');
    expect(response.status).toBe(500);
  });
});
