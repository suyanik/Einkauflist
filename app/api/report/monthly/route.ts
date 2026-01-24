//
//  route.ts
//  
//
//  Created by Şükrü Uyanık on 21.01.26.
//


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const yearParam = searchParams.get('year');
  const monthParam = searchParams.get('month'); // 1-12 arası

  if (!yearParam || !monthParam) {
    return NextResponse.json({ success: false, message: "Yıl ve Ay parametreleri gerekli" }, { status: 400 });
  }

  const year = parseInt(yearParam);
  const month = parseInt(monthParam);

  // Tarih aralığını oluştur (Örn: 2023-10-01 00:00:00 - 2023-10-31 23:59:59)
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59); // Ayın son günü

  try {
    // Tamamlanmış listeleri ve kalemleri getir
    const completedLists = await prisma.shoppingList.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });

    // Veriyi İşle: Kategorilere göre grupla ve topla
    const categoryTotals: { [key: string]: number } = {};
    let grandTotal = 0;

    completedLists.forEach(list => {
      list.items.forEach(item => {
        const price = Number(item.price) || 0; // Veritabanından Decimal olarak gelir, Number'a çeviriyoruz
        const categoryName = item.product.category.name; // Örn: "Metro"

        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = 0;
        }
        categoryTotals[categoryName] += price;
        grandTotal += price;
      });
    });

    // Sonucu Dizilere Dönüştür
    const breakdown = Object.entries(categoryTotals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total); // En çok harcama en üstte

    return NextResponse.json({
      success: true,
      year,
      month,
      grandTotal,
      breakdown
    });

  } catch (error) {
    console.error("Raporlama Hatası:", error);
    return NextResponse.json({ success: false, message: "Rapor alınamadı" }, { status: 500 });
  }
}