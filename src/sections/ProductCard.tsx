import { Check, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getCategoryName, getCategoryColor } from '@/lib/constants';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onToggle, onDelete }: ProductCardProps) {
  const isPurchased = product.status === 'purchased';
  const categoryColor = getCategoryColor(product.category);
  const categoryName = getCategoryName(product.category);

  return (
    <div
      className={`
        group relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
        ${
          isPurchased
            ? 'bg-slate-50 border-slate-200 opacity-75'
            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
        }
      `}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        <Checkbox
          checked={isPurchased}
          onCheckedChange={() => onToggle(product.id)}
          className={`
            w-6 h-6 rounded-lg border-2 transition-all duration-200
            ${
              isPurchased
                ? 'bg-emerald-500 border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500'
                : 'border-slate-300 hover:border-indigo-400'
            }
          `}
        />
      </div>

      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ürün Adı */}
          <span
            className={`
              font-medium text-base transition-all duration-300
              ${isPurchased ? 'text-slate-400 line-through' : 'text-slate-800'}
            `}
          >
            {product.name}
          </span>

          {/* Kategori Badge */}
          <Badge
            variant="secondary"
            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            {categoryName}
          </Badge>
        </div>

        {/* Miktar Bilgisi */}
        <div className="mt-1">
          <span
            className={`
              text-sm transition-all duration-300
              ${isPurchased ? 'text-slate-400' : 'text-slate-500'}
            `}
          >
            {product.quantity} {product.unit}
          </span>
        </div>
      </div>

      {/* Saat Bilgisi (Alındıysa) */}
      {isPurchased && product.purchasedAt && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
          <Check className="w-3 h-3" />
          {new Date(product.purchasedAt).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}

      {/* Silme Butonu */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(product.id)}
        className={`
          flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200
          ${isPurchased ? 'opacity-100' : ''}
          text-slate-400 hover:text-red-500 hover:bg-red-50
        `}
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Geri Al Butonu (Alındıysa) */}
      {isPurchased && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggle(product.id)}
          className="flex-shrink-0 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
