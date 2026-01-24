//
//  route.ts
//  
//
//  Created by Şükrü Uyanık on 21.01.26.
//


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderId, itemsUpdates } = await req.json();
    // itemsUpdates formatı: [{ itemId: "id", price: 3.50 }, ...]

    if (!orderId || !itemsUpdates) throw new Error("Eksik veri");

    // 1. Her bir ürün için fiyatı güncelle
    await Promise.all(
      itemsUpdates.map((item: { itemId: string; price: number }) =>
        prisma.listItem.update({
          where: { id: item.itemId },
          data: { price: item.price }
        })
      )
    );

    // 2. Sipariş durumunu "Tamamlandı" olarak değiştir
    const updatedList = await prisma.shoppingList.update({
      where: { id: orderId },
      data: { status: 'COMPLETED' }
    });

    // 3. Raporlama tetikleyicisi (Opsiyonel)
    // await sendMonthlyReport(); // Bu işi cron job yapar daha iyi ama şimdilik es geçelim.

    return NextResponse.json({ success: true, data: updatedList });

  } catch (error) {
    console.error("Tamamlama Hatası:", error);
    return NextResponse.json({ success: false, message: "Sipariş tamamlanamadı" }, { status: 500 });
  }
}