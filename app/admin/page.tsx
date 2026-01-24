'use client';

import { useState, useEffect } from 'react';
import { Upload, Save, Languages, Loader2, Package } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function AdminPanel() {
  // Form durumlarını yönetiyoruz
  const [formData, setFormData] = useState({
    name_tr: '',
    name_de: '',
    name_pa: '',
    categoryId: '', // İleride Kategori listesinden gelecek
    unit: 'kg',
    image: ''
  });

  const [isLoadingTrans, setIsLoadingTrans] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Kategorileri veritabanından çek
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.data);
      })
      .catch(error => console.error('Kategoriler yüklenemedi:', error));
  }, []);

  // Otomatik Çeviri Fonksiyonu
  const handleTranslate = async () => {
    if (!formData.name_tr) return;

    setIsLoadingTrans(true);
    try {
      // Önceki adımda yazdığımız çeviri API'sine istek atıyoruz
      const res = await fetch('/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name_tr: formData.name_tr })
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          name_de: data.translation.name_de,
          name_pa: data.translation.name_pa
        }));
      }
    } catch (error) {
      alert("Çeviri hatası oluştu");
    } finally {
      setIsLoadingTrans(false);
    }
  };

  // Ürünü Kaydetme Fonksiyonu
  const handleSave = async () => {
    if (!formData.categoryId || !formData.name_tr) {
      alert("Lütfen ürün adını ve kategoriyi seçiniz.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/products/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Ürün başarıyla kaydedildi!");
        // Formu temizle
        setFormData({ name_tr: '', name_de: '', name_pa: '', categoryId: '', unit: 'kg', image: '' });
      } else {
        alert("Kayıt sırasında hata oluştu.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-full sm:max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">

        {/* Başlık Alanı */}
        <div className="bg-blue-600 p-4 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="sm:w-7 sm:h-7" />
            Ürün Yönetim Paneli
          </h1>
          <p className="text-blue-100 mt-1 text-sm sm:text-base">Yeni ürün ekle ve dilleri ayarla</p>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          
          {/* Kategori Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({...formData, categoryId: cat.id})}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    formData.categoryId === cat.id 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 sm:pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı (Türkçe)</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={formData.name_tr}
                onChange={(e) => setFormData({...formData, name_tr: e.target.value})}
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Örn: Domates"
              />
              <button
                onClick={handleTranslate}
                disabled={isLoadingTrans}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoadingTrans ? <Loader2 className="animate-spin" size={20} /> : <Languages size={20} />}
                <span className="text-sm sm:text-base">{isLoadingTrans ? "Çevriliyor..." : "Çevir"}</span>
              </button>
            </div>
          </div>

          {/* Otomatik Çeviri Sonuçları (Salt Okunur) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Almanca (Önerilen)</label>
              <input
                type="text"
                value={formData.name_de}
                onChange={(e) => setFormData({...formData, name_de: e.target.value})} // İsterseniz manuel düzeltebilirsiniz
                className="w-full border rounded-lg px-4 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Punjabi (Önerilen)</label>
              <input
                type="text"
                value={formData.name_pa}
                onChange={(e) => setFormData({...formData, name_pa: e.target.value})}
                className="w-full border rounded-lg px-4 py-2 bg-gray-50"
              />
            </div>
          </div>

          {/* Birim Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birim</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="adet">Adet</option>
              <option value="litre">Litre</option>
              <option value="paket">Paket</option>
              <option value="demet">Demet</option>
            </select>
          </div>

          {/* Kaydet Butonu */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-green-600 text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>Ürünü Sisteme Kaydet</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
