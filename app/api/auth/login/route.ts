//
//  route.ts
//
//
//  Created by Şükrü Uyanık on 24.01.26.
//


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { success: false, message: "Geçersiz PIN formatı" },
        { status: 400 }
      );
    }

    // PIN ile kullanıcı ara
    const user = await prisma.user.findFirst({
      where: { pin },
      select: { id: true, name: true, role: true, phone: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Hatalı PIN" },
        { status: 401 }
      );
    }

    // Session token oluştur (basit implementasyon)
    const sessionToken = Buffer.from(
      JSON.stringify({ userId: user.id, timestamp: Date.now() })
    ).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role }
    });

    // HttpOnly cookie set et
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 gün
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Giriş başarısız" },
      { status: 500 }
    );
  }
}
