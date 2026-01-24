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
    const pendingOrders = await prisma.shoppingList.findMany({
      where: { status: 'PENDING' },
      include: {
        creator: {
          select: { name: true, role: true }
        },
        items: {
          include: {
            product: {
              select: {
                name_tr: true,
                name_de: true,
                unit: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: pendingOrders });
  } catch (error) {
    console.error("Pending Orders Error:", error);
    return NextResponse.json(
      { success: false, message: "Siparişler getirilemedi" },
      { status: 500 }
    );
  }
}
