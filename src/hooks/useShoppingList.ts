import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Product, Category, FilterType, DailyReport } from '@/types';

export function useShoppingList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Verileri Supabase'den çek
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedProducts: Product[] = (data || []).map((p) => ({
        ...p,
        createdAt: new Date(p.created_at),
        purchasedAt: p.purchased_at ? new Date(p.purchased_at) : undefined,
      }));

      setProducts(formattedProducts);
    } catch (error: any) {
      console.error('Veri çekme hatası:', error.message);
      toast.error('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  // İlk yükleme ve Realtime abonelik
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (_payload) => {
          // Değişiklik olunca listeyi yeniden çek
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);

  // Filtre state
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // Supabase'e ürün ekle
  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Oturum açmanız gerekiyor');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productData.name,
            category: productData.category,
            quantity: productData.quantity,
            unit: productData.unit,
            status: 'pending',
            user_id: user.id
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      toast.error('Ürün eklenirken hata: ' + error.message);
    }
  }, []);

  // Supabase'den ürün sil
  const deleteProduct = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      toast.error('Silme hatası: ' + error.message);
    }
  }, []);

  // Supabase'de güncelle (Henüz kullanılmıyor ama interface gereği burada)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateProduct = useCallback(async (_id: string, _updates: Partial<Product>) => {
    // Gelecekte implemente edilecek
  }, []);

  // Durum değiştir
  const toggleStatus = useCallback(async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = product.status === 'pending' ? 'purchased' : 'pending';
    const updates = {
      status: newStatus,
      purchased_at: newStatus === 'purchased' ? new Date().toISOString() : null
    };

    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      toast.error('Güncelleme hatası: ' + error.message);
    }
  }, [products]);


  // Tümünü temizle
  const clearAll = useCallback(async () => {
    if (confirm('Tüm ürünleri silmek istediğinize emin misiniz?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Hepsini sil

        if (error) throw error;
      } catch (error: any) {
        toast.error('Temizleme hatası: ' + error.message);
      }
    }
  }, []);

  // Alınanları temizle
  const clearPurchased = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('status', 'purchased');

      if (error) throw error;
    } catch (error: any) {
      toast.error('Temizleme hatası: ' + error.message);
    }
  }, []);

  // Bekleyen ürünler (arama ve kategori filtresi uygulanmış)
  // useMemo'ları basitleştirdim çünkü realtime ile veri çekiyoruz
  const filteredBySearchAndCategory = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query);
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const pendingProducts = useMemo(
    () => filteredBySearchAndCategory.filter((p) => p.status === 'pending'),
    [filteredBySearchAndCategory]
  );

  const purchasedProducts = useMemo(
    () => filteredBySearchAndCategory.filter((p) => p.status === 'purchased'),
    [filteredBySearchAndCategory]
  );

  const filteredProducts = useMemo(() => {
    return filteredBySearchAndCategory.filter((product) => {
      if (filter === 'pending' && product.status !== 'pending') return false;
      if (filter === 'purchased' && product.status !== 'purchased') return false;
      return true;
    });
  }, [filteredBySearchAndCategory, filter]);

  const stats = useMemo(
    () => ({
      total: products.length,
      pending: products.filter((p) => p.status === 'pending').length,
      purchased: products.filter((p) => p.status === 'purchased').length,
    }),
    [products]
  );

  const generateDailyReport = useCallback((): DailyReport => {
    const today = new Date().toISOString().split('T')[0];
    const todayProducts = products.filter((p) => {
      const productDate = p.createdAt.toISOString().split('T')[0];
      return productDate === today;
    });

    const categoryDistribution: Record<Category, number> = {
      sebze: 0,
      et: 0,
      market: 0,
      metro: 0,
      diger: 0,
    };

    todayProducts.forEach((p) => {
      categoryDistribution[p.category]++;
    });

    return {
      date: today,
      totalProducts: todayProducts.length,
      purchasedProducts: todayProducts.filter((p) => p.status === 'purchased').length,
      pendingProducts: todayProducts.filter((p) => p.status === 'pending').length,
      categoryDistribution,
      products: todayProducts,
    };
  }, [products]);

  return {
    products,
    filteredProducts,
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
    updateProduct,
    toggleStatus,
    clearAll,
    clearPurchased,
    generateDailyReport,
    loading, // loading state'i dışarı açtık ki unused variable hatası vermesin
  };
}
