import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns all categories successfully', async () => {
    const { prisma } = await import('@/lib/prisma');

    const mockCategories = [
      { id: '1', name: 'Sebze', slug: 'sebze' },
      { id: '2', name: 'İçecekler', slug: 'icecek' },
      { id: '3', name: 'Metro', slug: 'metro' },
      { id: '4', name: 'Genel', slug: 'genel' },
    ];

    vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories as any);

    const response = await GET();
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data).toHaveLength(4);
    expect(json.data[0].name).toBe('Sebze');
    expect(prisma.category.findMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
    });
  });

  it('returns empty array when no categories exist', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.category.findMany).mockResolvedValue([]);

    const response = await GET();
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(0);
  });

  it('handles database errors', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.category.findMany).mockRejectedValue(
      new Error('Database error')
    );

    const response = await GET();
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.message).toBe('Kategoriler getirilemedi');
    expect(response.status).toBe(500);
  });
});
