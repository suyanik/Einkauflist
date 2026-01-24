import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const {
      name_tr,
      name_de,
      name_pa,
      categoryId,
      unit,
      image
    } = await req.json();

    // Gerekli alanları kontrol et
    if (!name_tr || !categoryId) {
      return NextResponse.json({ success: false, message: "Eksik bilgi" }, { status: 400 });
    }

    // Veritabanına ürün ekle
    const newProduct = await prisma.product.create({
      data: {
        name_tr,
        name_de: name_de || "", // Çeviri boşsa boş kaydet
        name_pa: name_pa || "",
        categoryId,
        unit: unit || "Adet",
        image: image || "https://via.placeholder.com/150" // Fotoğraf yoksa varsayılan resim
      }
    });

    return NextResponse.json({ success: true, product: newProduct });

  } catch (error) {
    console.error("Kayıt Hatası:", error);
    return NextResponse.json({ success: false, message: "Veritabanı hatası" }, { status: 500 });
  }
}
