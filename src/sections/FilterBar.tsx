import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/lib/constants';
import type { FilterType, Category } from '@/types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  stats: {
    total: number;
    pending: number;
    purchased: number;
  };
}

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'pending', label: 'Bekleyen' },
  { value: 'purchased', label: 'Alınan' },
];

export function FilterBar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  stats,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onFilterChange('all');
  };

  return (
    <div className="space-y-4">
      {/* Üst Satır: Arama ve Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Arama Inputu */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Kategori Filtresi */}
        <div className="sm:w-48">
          <Select value={selectedCategory} onValueChange={(v) => onCategoryChange(v as Category | 'all')}>
            <SelectTrigger className="h-11 border-slate-300">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Temizle */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="h-11 border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-4 h-4 mr-2" />
            Temizle
          </Button>
        )}
      </div>

      {/* Alt Satır: Durum Filtreleri ve İstatistikler */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Durum Filtreleri */}
        <div className="flex items-center gap-2">
          {filterOptions.map((option) => {
            const count =
              option.value === 'all'
                ? stats.total
                : option.value === 'pending'
                ? stats.pending
                : stats.purchased;

            return (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    filter === option.value
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }
                `}
              >
                {option.label}
                <Badge
                  variant={filter === option.value ? 'secondary' : 'outline'}
                  className={`
                    text-xs px-1.5 py-0
                    ${filter === option.value ? 'bg-white/20 text-white' : 'text-slate-500'}
                  `}
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Özet İstatistik */}
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {stats.purchased} alındı
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {stats.pending} bekliyor
          </span>
        </div>
      </div>
    </div>
  );
}
