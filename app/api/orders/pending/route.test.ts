import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    shoppingList: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/orders/pending', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns pending orders successfully', async () => {
    const { prisma } = await import('@/lib/prisma');

    // Mock data
    const mockOrders = [
      {
        id: 'order-1',
        createdAt: new Date('2026-01-24'),
        creator: { name: 'Test User', role: 'STAFF' },
        items: [
          {
            id: 'item-1',
            product: {
              name_tr: 'Domates',
              name_de: 'Tomate',
              unit: 'kg',
            },
            quantity: 5,
          },
        ],
      },
    ];

    vi.mocked(prisma.shoppingList.findMany).mockResolvedValue(mockOrders as any);

    const response = await GET();
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].id).toBe('order-1');
    expect(json.data[0].creator.name).toBe('Test User');
  });

  it('returns empty array when no pending orders', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.shoppingList.findMany).mockResolvedValue([]);

    const response = await GET();
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data).toHaveLength(0);
  });

  it('handles database errors gracefully', async () => {
    const { prisma } = await import('@/lib/prisma');

    vi.mocked(prisma.shoppingList.findMany).mockRejectedValue(
      new Error('Database connection failed')
    );

    const response = await GET();
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.message).toBe('Siparişler getirilemedi');
    expect(response.status).toBe(500);
  });
});
