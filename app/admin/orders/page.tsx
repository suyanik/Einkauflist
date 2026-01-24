//
//  page.tsx
//  
//
//  Created by Şükrü Uyanık on 21.01.26.
//


'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Euro, Package } from 'lucide-react';

type OrderItem = {
  id: string;
  quantity: number;
  product: {
    name_tr: string;
    name_de: string;
    unit: string;
  };
  price?: number;
};

type Order = {
  id: string;
  createdAt: string;
  creator: { name: string; role: string };
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [prices, setPrices] = useState<{[key: string]: string}>({}); // Input value management
  const [loading, setLoading] = useState(false);

  // Verileri Çek
  useEffect(() => {
    fetch('/api/orders/pending')
      .then(res => res.json())
      .then(json => {
        if (json.success) setOrders(json.data);
      });
  }, []);

  const handlePriceChange = (itemId: string, value: string) => {
    setPrices(prev => ({ ...prev, [itemId]: value }));
  };

  // Siparişi Tamamla ve Kaydet
  const completeOrder = async () => {
    if (!selectedOrder) return;

    setLoading(true);
    const itemsUpdates = selectedOrder.items.map(item => ({
      itemId: item.id,
      price: parseFloat(prices[item.id]) || 0
    }));

    const res = await fetch('/api/orders/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: selectedOrder.id, itemsUpdates })
    });

    if (res.ok) {
      alert('Sipariş kapatıldı ve fiş kaydedildi!');
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      setPrices({});
    } else {
      alert('Hata oluştu.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        {/* Sol Panel: Bekleyen Siparişler */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Package size={24} className="sm:w-7 sm:h-7" /> Bekleyen Siparişler
          </h2>
          <div className="space-y-4">
            {orders.length === 0 && <p className="text-gray-500">Bekleyen sipariş yok.</p>}
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedOrder?.id === order.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {order.items.length} Ürün
                  </span>
                </div>
                <p className="text-sm text-gray-500">Personel: <strong>{order.creator.name}</strong></p>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Panel: Fiyat Girişi Formu */}
        {selectedOrder && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg md:sticky md:top-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800">Fiş Detayları (€)</h2>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedOrder.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-3 gap-2">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{item.product.name_tr}</div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {item.product.name_de} | {item.quantity} {item.product.unit}
                    </div>
                  </div>
                  <div className="relative w-full sm:w-32">
                    <Euro size={16} className="absolute left-3 top-3 text-gray-400"/>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={prices[item.id] || item.price || ''}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className="w-full sm:w-32 pl-8 p-2 border rounded-lg text-right font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={completeOrder}
              disabled={loading}
              className="w-full mt-4 sm:mt-6 bg-green-600 text-white py-3 sm:py-4 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <CheckCircle2 size={20} />
              <span>{loading ? "Kaydediliyor..." : "Siparişi Kapat ve Kaydet"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}