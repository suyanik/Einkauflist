import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES, UNITS } from '@/lib/constants';
import type { Category, Unit } from '@/types';

interface AddProductFormProps {
  onAdd: (product: {
    name: string;
    category: Category;
    quantity: number;
    unit: Unit;
  }) => void;
}

export function AddProductForm({ onAdd }: AddProductFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('sebze');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<Unit>('kg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      category,
      quantity: parseFloat(quantity) || 1,
      unit,
    });

    // Formu temizle
    setName('');
    setQuantity('1');
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Ürün Adı */}
            <div className="sm:col-span-4">
              <Label htmlFor="product-name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                Ürün Adı
              </Label>
              <Input
                id="product-name"
                placeholder="Ürün adı girin..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Kategori */}
            <div className="sm:col-span-3">
              <Label htmlFor="category" className="text-sm font-medium text-slate-700 mb-1.5 block">
                Kategori
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger id="category" className="h-11 border-slate-300">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
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

            {/* Miktar */}
            <div className="sm:col-span-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-slate-700 mb-1.5 block">
                Miktar
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Birim */}
            <div className="sm:col-span-2">
              <Label htmlFor="unit" className="text-sm font-medium text-slate-700 mb-1.5 block">
                Birim
              </Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                <SelectTrigger id="unit" className="h-11 border-slate-300">
                  <SelectValue placeholder="Birim" />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ekle Butonu */}
            <div className="sm:col-span-1 flex items-end">
              <Button
                type="submit"
                className="w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
