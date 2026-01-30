// Kategori tipleri
export type Category = 
  | 'sebze' 
  | 'et' 
  | 'market' 
  | 'metro' 
  | 'diger';

// Birim tipleri
export type Unit = 
  | 'kg' 
  | 'gr' 
  | 'lt' 
  | 'ml' 
  | 'adet' 
  | 'paket' 
  | 'koli';

// Ürün durumu
export type ProductStatus = 'pending' | 'purchased';

// Ürün arayüzü
export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  status: ProductStatus;
  createdAt: Date;
  purchasedAt?: Date;
}

// Kategori bilgisi
export interface CategoryInfo {
  id: Category;
  name: string;
  color: string;
  bgColor: string;
}

// Birim bilgisi
export interface UnitInfo {
  id: Unit;
  name: string;
}

// Günlük rapor
export interface DailyReport {
  date: string;
  totalProducts: number;
  purchasedProducts: number;
  pendingProducts: number;
  categoryDistribution: Record<Category, number>;
  products: Product[];
}

// Filtre seçenekleri
export type FilterType = 'all' | 'pending' | 'purchased';

// Sıralama seçenekleri
export type SortType = 'date' | 'name' | 'category';
