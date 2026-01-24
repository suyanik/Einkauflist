//
//  page.tsx
//  
//
//  Created by Şükrü Uyanık on 21.01.26.
//


'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Lock, Check, ChevronLeft, Send } from 'lucide-react';

// Tip tanımları
type Product = {
  id: string;
  name_pa: string; // Punjabi
  name_tr: string;
  image: string;
  unit: string;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

export default function StaffApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<{id: string; name: string} | null>(null);

  // Sepet yapısı: { productId: quantity }
  const [cart, setCart] = useState<{[key: string]: number}>({});

  // 1. PIN Girişi (API ile)
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        setLoggedInUser(data.user);
        fetchProducts();
      } else {
        alert(data.message || 'Hatalı PIN');
      }
    } catch (error) {
      alert('Giriş başarısız');
    }
  };

  // 2. Ürünleri Getir
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (error) {
      console.error("Veri hatası");
    }
  };

  // 3. Sepete Ekle/Çıkar
  const updateQuantity = (productId: string, change: number) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) + change;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  // 4. Siparişi Gönder
  const submitOrder = async () => {
    if (Object.keys(cart).length === 0) return;

    const cartItems = Object.entries(cart).map(([id, qty]) => ({
      productId: id,
      quantity: qty
    }));

    try {
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          createdByUserId: loggedInUser?.id // Gerçek kullanıcı ID'si
        })
      });
      
      alert('Sipariş gönderildi! 🥘');
      setCart({});
    } catch (error) {
      alert('Hata oluştu');
    }
  };

  // Giriş Ekranı
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm text-center">
          <div className="bg-gray-700 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Lock size={40} className="text-blue-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Giriş Yap</h2>
          <p className="text-gray-400 text-sm mb-6">Lütfen PIN kodunuzu giriniz</p>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-4 text-center text-2xl rounded-lg mb-4 bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
            maxLength={4}
            placeholder="****"
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg active:bg-blue-700"
          >
            GİRİŞ
          </button>
        </div>
      </div>
    );
  }

  // Ana Uygulama Ekranı
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans pb-24">
      
      {/* Üst Başlık */}
      <header className="bg-orange-500 text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="text-lg sm:text-xl font-bold text-center">ਦੁਕਾਨ ਦੀ ਸੂਚੀ (Sipariş Listesi)</h1>
      </header>

      {/* Kategori Sekmeleri (Yatay Kaydırma) */}
      <div className="flex overflow-x-auto bg-white shadow-sm p-2 space-x-2 no-scrollbar">
        {categories.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(idx)}
            className={`px-3 sm:px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap ${
              activeTab === idx ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Ürün Izgarası */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {categories[activeTab]?.products.map(product => {
          const qty = cart[product.id] || 0;
          
          return (
            <div key={product.id} className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${qty > 0 ? 'border-orange-500' : 'border-transparent'}`}>
              
              {/* Ürün Resmi */}
              <div className="h-32 bg-gray-200 relative">
                <img 
                  src={product.image || 'https://via.placeholder.com/150'} 
                  alt={product.name_tr} 
                  className="w-full h-full object-cover"
                />
                {qty > 0 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {qty}
                  </div>
                )}
              </div>

              {/* Ürün Bilgisi (Punjabi Odaklı) */}
              <div className="p-3">
                <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight">
                  {product.name_pa}
                </h3>
                <p className="text-xs text-gray-400 mb-3">{product.name_tr} ({product.unit})</p>

                {/* Kontrol Butonları */}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className={`flex-1 py-3 sm:py-2 rounded-lg font-bold ${qty > 0 ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-300'}`}
                  >
                  -
                  </button>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="flex-1 bg-green-500 text-white py-3 sm:py-2 rounded-lg font-bold hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Sabit Buton (Floating Action) */}
      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 pb-6 shadow-2xl">
          <button
            onClick={submitOrder}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <Send size={24} />
            Siparişi Gönder
          </button>
        </div>
      )}

    </div>
  );
}