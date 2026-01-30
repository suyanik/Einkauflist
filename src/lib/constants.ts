import type { CategoryInfo, UnitInfo } from '@/types';

// Kategori bilgileri
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'sebze',
    name: 'Sebze',
    color: '#10B981',
    bgColor: 'bg-emerald-100',
  },
  {
    id: 'et',
    name: 'Et',
    color: '#EF4444',
    bgColor: 'bg-red-100',
  },
  {
    id: 'market',
    name: 'Market',
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
  },
  {
    id: 'metro',
    name: 'Metro',
    color: '#3B82F6',
    bgColor: 'bg-blue-100',
  },
  {
    id: 'diger',
    name: 'Diğer',
    color: '#8B5CF6',
    bgColor: 'bg-violet-100',
  },
];

// Birim bilgileri
export const UNITS: UnitInfo[] = [
  { id: 'kg', name: 'Kilogram' },
  { id: 'gr', name: 'Gram' },
  { id: 'lt', name: 'Litre' },
  { id: 'ml', name: 'Mililitre' },
  { id: 'adet', name: 'Adet' },
  { id: 'paket', name: 'Paket' },
  { id: 'koli', name: 'Koli' },
];

// Kategori renklerini getir
export function getCategoryColor(categoryId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return category?.color || '#64748B';
}

// Kategori adını getir
export function getCategoryName(categoryId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return category?.name || categoryId;
}

// Birim adını getir
export function getUnitName(unitId: string): string {
  const unit = UNITS.find((u) => u.id === unitId);
  return unit?.name || unitId;
}

// Kategori arka plan rengini getir
export function getCategoryBgColor(categoryId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return category?.bgColor || 'bg-gray-100';
}
