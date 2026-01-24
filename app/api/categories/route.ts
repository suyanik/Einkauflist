//
//  route.ts
//
//
//  Created by Şükrü Uyanık on 24.01.26.
//


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Categories Error:", error);
    return NextResponse.json(
      { success: false, message: "Kategoriler getirilemedi" },
      { status: 500 }
    );
  }
}
