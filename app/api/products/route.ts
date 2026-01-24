//
//  route.ts
//  
//
//  Created by Şükrü Uyanık on 21.01.26.
//


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Kategoriler ve ürünleri birlikte çek (Include)
    const products = await prisma.category.findMany({
      include: {
        products: {
          orderBy: { name_pa: 'asc' } // Punjabi isme göre sırala
        }
      }
    });

    return NextResponse.json({ success: true, data: products });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Ürünler alınamadı" }, { status: 500 });
  }
}