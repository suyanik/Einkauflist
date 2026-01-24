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
    const { cartItems, createdByUserId } = await req.json();

    // 1. Yeni Liste Oluştur
    const newList = await prisma.shoppingList.create({
      data: {
        createdBy: createdByUserId, // Hangi personel oluşturdu?
        status: 'PENDING',
        items: {
          create: cartItems // Map edilen ürünleri listeye ekle
        }
      }
    });

    // --- PUSH NOTIFICATION VEYA E-POSTA MANTIĞI BURAYA GELECEK ---
    // Örn: await sendNotification("Yeni Sipariş Var!");
    console.log(`Yeni sipariş oluşturuldu: ${newList.id}. Bildirim gönderiliyor...`);
    // --------------------------------------------------------

    return NextResponse.json({ success: true, orderId: newList.id });

  } catch (error) {
    console.error("Sipariş Hatası:", error);
    return NextResponse.json({ success: false, message: "Sipariş oluşturulamadı" }, { status: 500 });
  }
}