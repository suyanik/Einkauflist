//
//  page.tsx
//  
//
//  Created by Şükrü Uyanık on 21.01.26.
//


'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, DollarSign, ArrowLeft } from 'lucide-react';

type ReportData = {
  year: number;
  month: number;
  grandTotal: number;
  breakdown: { category: string; total: number }[];
};

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  // Raporu Çek
  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report/monthly?year=${selectedYear}&month=${selectedMonth}`);
      const json = await res.json();
      if (json.success) {
        setReport(json);
      } else {
        alert("Rapor alınamadı");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa ilk açıldığında varsayılan ayın raporunu getir
  useEffect(() => {
    fetchReport();
  }, []);

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Başlık */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={28} />
            Finansal Raporlar
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Aylık harcama analizleri ve kategori dağılımları.</p>
        </div>

        {/* Kontrol Paneli */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border mb-6 sm:mb-8 flex flex-col md:flex-row gap-4 items-end">
          
          {/* Yıl Seçimi */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Yıl</label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg bg-gray-50"
            >
              {[2022, 2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Ay Seçimi */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ay</label>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full p-2 border rounded-lg bg-gray-50"
            >
              {monthNames.map((name, idx) => (
                <option key={idx} value={idx + 1}>{name}</option>
              ))}
            </select>
          </div>

          {/* Getir Butonu */}
          <button 
            onClick={fetchReport}
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Calendar size={20} />
            Rapor Getir
          </button>
        </div>

        {/* Rapor Sonuçları */}
        {report && !loading && (
          <div className="space-y-6">
            
            {/* Toplam Kartı */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 sm:p-8 text-white shadow-lg flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium uppercase tracking-wider">
                  {monthNames[report.month - 1]} {report.year} Toplam Harcama
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2">
                  €{report.grandTotal.toFixed(2)}
                </h2>
              </div>
              <div className="bg-white/20 p-3 sm:p-4 rounded-full">
                <DollarSign size={32} className="sm:w-12 sm:h-12" />
              </div>
            </div>

            {/* Kategori Dağılımı */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 sm:p-6 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Kategori Bazlı Detay</h3>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {report.breakdown.length} Kategori
                </span>
              </div>
              
              <div className="divide-y">
                {report.breakdown.map((item, idx) => {
                  const percentage = (item.total / report.grandTotal) * 100;
                  return (
                    <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm sm:text-base">{item.category}</p>
                          <div className="w-full sm:max-w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="font-bold text-base sm:text-lg text-gray-900">€{item.total.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">%{percentage.toFixed(1)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Yıl Sonu Notu */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
              <TrendingUp className="text-yellow-600 mt-1" size={20} />
              <div>
                <h4 className="font-bold text-yellow-800">Yıl Sonu Bilançosu</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Farklı ayları seçerek karşılaştırma yapabilir ve yıl sonu toplam giderlerinizi hesaplayabilirsiniz.
                  Veriler otomatik olarak alışveriş onayı (Fiyat Girişi) anında güncellenir.
                </p>
              </div>
            </div>

          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-500">
            Veriler hesaplanıyor...
          </div>
        )}

      </div>
    </div>
  );
}