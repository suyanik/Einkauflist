import { useState, useEffect } from 'react';
import { Header } from '@/sections/Header';
import { ShoppingList } from '@/sections/ShoppingList';
import { DailyReport } from '@/sections/DailyReport';
import Auth from '@/sections/Auth';
import { useShoppingList } from '@/hooks/useShoppingList';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Category, Unit } from '@/types';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'report'>('list');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    products,
    pendingProducts,
    purchasedProducts,
    stats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addProduct,
    deleteProduct,
    toggleStatus,
    clearPurchased,
  } = useShoppingList();

  // Ürün ekleme işleyicisi
  const handleAddProduct = (product: {
    name: string;
    category: Category;
    quantity: number;
    unit: Unit;
  }) => {
    addProduct(product);
    toast.success('Ürün eklendi', {
      description: `${product.name} (${product.quantity} ${product.unit})`,
    });
  };

  // Ürün silme işleyicisi
  const handleDeleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      deleteProduct(id);
      toast.success('Ürün silindi', {
        description: product.name,
      });
    }
  };

  // Durum değiştirme işleyicisi
  const handleToggleStatus = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      toggleStatus(id);
      const newStatus = product.status === 'pending' ? 'purchased' : 'pending';
      if (newStatus === 'purchased') {
        toast.success('Ürün alındı olarak işaretlendi', {
          description: product.name,
        });
      } else {
        toast.info('Ürün bekleme durumuna alındı', {
          description: product.name,
        });
      }
    }
  };

  // Alınanları temizleme işleyicisi
  const handleClearPurchased = () => {
    if (confirm('Alınan tüm ürünleri listeden kaldırmak istediğinize emin misiniz?')) {
      clearPurchased();
      toast.success('Alınan ürünler temizlendi');
    }
  };

  if (!session) {
    return (
      <>
        <Auth />
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Ana İçerik */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'list' ? (
          <ShoppingList
            pendingProducts={pendingProducts}
            purchasedProducts={purchasedProducts}
            stats={stats}
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddProduct={handleAddProduct}
            onToggleProduct={handleToggleStatus}
            onDeleteProduct={handleDeleteProduct}
            onClearPurchased={handleClearPurchased}
          />
        ) : (
          <DailyReport products={products} />
        )}
      </main>

      {/* Toast Bildirimleri */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;
