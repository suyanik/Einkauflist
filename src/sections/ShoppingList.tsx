import { Package, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import { AddProductForm } from './AddProductForm';
import { FilterBar } from './FilterBar';
import type { Product, Category, Unit, FilterType } from '@/types';

interface ShoppingListProps {
  pendingProducts: Product[];
  purchasedProducts: Product[];
  stats: {
    total: number;
    pending: number;
    purchased: number;
  };
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | 'all';
  setSelectedCategory: (category: Category | 'all') => void;
  onAddProduct: (product: {
    name: string;
    category: Category;
    quantity: number;
    unit: Unit;
  }) => void;
  onToggleProduct: (id: string) => void;
  onDeleteProduct: (id: string) => void;
  onClearPurchased: () => void;
}

export function ShoppingList({
  pendingProducts,
  purchasedProducts,
  stats,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onAddProduct,
  onToggleProduct,
  onDeleteProduct,
  onClearPurchased,
}: ShoppingListProps) {
  const showPending = filter === 'all' || filter === 'pending';
  const showPurchased = filter === 'all' || filter === 'purchased';

  const hasPendingProducts = pendingProducts.length > 0;
  const hasPurchasedProducts = purchasedProducts.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Ürün Ekleme Formu */}
      <AddProductForm onAdd={onAddProduct} />

      {/* Filtreler */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        stats={stats}
      />

      {/* Liste İçeriği */}
      <div className="space-y-6">
        {/* Bekleyen Ürünler */}
        {showPending && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Alınacaklar
              </h3>
              {hasPendingProducts && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  {pendingProducts.length} ürün
                </Badge>
              )}
            </div>

            {hasPendingProducts ? (
              <div className="space-y-2">
                {pendingProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onToggle={onToggleProduct}
                    onDelete={onDeleteProduct}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Package className="w-8 h-8 text-slate-300" />}
                title="Bekleyen ürün yok"
                description="Yeni ürün eklemek için yukarıdaki formu kullanın"
              />
            )}
          </div>
        )}

        {/* Alınan Ürünler */}
        {showPurchased && hasPurchasedProducts && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Alınanlar
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {purchasedProducts.length} ürün
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearPurchased}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Temizle
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {purchasedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onToggle={onToggleProduct}
                  onDelete={onDeleteProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hiç Ürün Yok */}
        {!hasPendingProducts && !hasPurchasedProducts && (
          <EmptyState
            icon={<Package className="w-12 h-12 text-slate-300" />}
            title="Henüz ürün eklenmemiş"
            description="Alışveriş listenize ürün eklemek için yukarıdaki formu kullanın"
          />
        )}
      </div>
    </div>
  );
}

// Empty State Bileşeni
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}

// Badge importu için
import { Badge } from '@/components/ui/badge';
