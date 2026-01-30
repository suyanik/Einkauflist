import { useMemo } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Calendar,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getCategoryName, getCategoryColor, CATEGORIES } from '@/lib/constants';
import type { Product, Category } from '@/types';

interface DailyReportProps {
  products: Product[];
}

export function DailyReport({ products }: DailyReportProps) {
  const today = new Date().toISOString().split('T')[0];
  
  // Bugünün ürünlerini filtrele
  const todayProducts = useMemo(() => {
    return products.filter((p) => {
      const productDate = p.createdAt.toISOString().split('T')[0];
      return productDate === today;
    });
  }, [products, today]);

  // İstatistikler
  const stats = useMemo(() => {
    const total = todayProducts.length;
    const purchased = todayProducts.filter((p) => p.status === 'purchased').length;
    const pending = total - purchased;
    const completionRate = total > 0 ? Math.round((purchased / total) * 100) : 0;

    return { total, purchased, pending, completionRate };
  }, [todayProducts]);

  // Kategori dağılımı
  const categoryDistribution = useMemo(() => {
    const distribution: Record<Category, { total: number; purchased: number }> = {
      sebze: { total: 0, purchased: 0 },
      et: { total: 0, purchased: 0 },
      market: { total: 0, purchased: 0 },
      metro: { total: 0, purchased: 0 },
      diger: { total: 0, purchased: 0 },
    };

    todayProducts.forEach((p) => {
      distribution[p.category].total++;
      if (p.status === 'purchased') {
        distribution[p.category].purchased++;
      }
    });

    return distribution;
  }, [todayProducts]);

  // Kategorileri sırala (en çok ürün olan başta)
  const sortedCategories = useMemo(() => {
    return Object.entries(categoryDistribution)
      .filter(([, data]) => data.total > 0)
      .sort(([, a], [, b]) => b.total - a.total);
  }, [categoryDistribution]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Günlük Rapor</h2>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<ShoppingBag className="w-5 h-5 text-indigo-600" />}
          title="Toplam Ürün"
          value={stats.total}
          bgColor="bg-indigo-50"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          title="Alınan"
          value={stats.purchased}
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          title="Bekleyen"
          value={stats.pending}
          bgColor="bg-amber-50"
        />
      </div>

      {/* Tamamlanma Oranı */}
      {stats.total > 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <span className="font-medium text-slate-700">Tamamlanma Oranı</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600">%{stats.completionRate}</span>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-3 bg-slate-100"
            />
            <p className="text-sm text-slate-500 mt-2">
              Bugün eklenen {stats.total} üründen {stats.purchased} tanesi alındı
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kategori Dağılımı */}
      {sortedCategories.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-500" />
              Kategori Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {sortedCategories.map(([categoryId, data]) => {
                const category = CATEGORIES.find((c) => c.id === categoryId);
                if (!category || data.total === 0) return null;

                const percentage = Math.round((data.purchased / data.total) * 100);
                const color = category.color;

                return (
                  <div key={categoryId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium text-slate-700">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">
                          {data.purchased}/{data.total}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: `${color}40`,
                            color: color,
                            backgroundColor: `${color}10`,
                          }}
                        >
                          %{percentage}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ürün Listesi */}
      {todayProducts.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">
              Bugün Eklenen Ürünler
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-slate-100">
              {todayProducts.map((product) => (
                <div
                  key={product.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product.status === 'purchased'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          product.status === 'purchased'
                            ? 'text-slate-400 line-through'
                            : 'text-slate-700'
                        }`}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.quantity} {product.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: `${getCategoryColor(product.category)}40`,
                        color: getCategoryColor(product.category),
                        backgroundColor: `${getCategoryColor(product.category)}10`,
                      }}
                    >
                      {getCategoryName(product.category)}
                    </Badge>
                    {product.status === 'purchased' && product.purchasedAt && (
                      <span className="text-xs text-slate-400">
                        {new Date(product.purchasedAt).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boş Durum */}
      {todayProducts.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              Bugün henüz ürün eklenmemiş
            </h3>
            <p className="text-sm text-slate-500">
              Alışveriş listesine ürün eklediğinizde burada görünecek
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// İstatistik Kartı Bileşeni
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
}

function StatCard({ icon, title, value, bgColor }: StatCardProps) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
