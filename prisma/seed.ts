import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// Direkt PostgreSQL bağlantısı kullan (Prisma 7 için adapter gerekli)
const connectionString = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seed verisi oluşturuluyor...');

  // Kategoriler
  const sebze = await prisma.category.upsert({
    where: { slug: 'sebze' },
    update: {},
    create: { name: 'Sebze', slug: 'sebze' }
  });

  const icecek = await prisma.category.upsert({
    where: { slug: 'icecek' },
    update: {},
    create: { name: 'İçecekler', slug: 'icecek' }
  });

  const metro = await prisma.category.upsert({
    where: { slug: 'metro' },
    update: {},
    create: { name: 'Metro', slug: 'metro' }
  });

  const genel = await prisma.category.upsert({
    where: { slug: 'genel' },
    update: {},
    create: { name: 'Genel', slug: 'genel' }
  });

  console.log('✅ 4 kategori oluşturuldu');

  // Admin kullanıcı
  const admin = await prisma.user.upsert({
    where: { phone: '+905001234567' },
    update: {},
    create: {
      name: 'Admin User',
      phone: '+905001234567',
      role: 'ADMIN',
      pin: '0000' // Admin için varsayılan PIN
    }
  });

  // Mutfak personeli
  const staff = await prisma.user.findFirst({
    where: { phone: '+905009876543' }
  });

  if (!staff) {
    await prisma.user.create({
      data: {
        name: 'Mutfak Personeli',
        phone: '+905009876543',
        role: 'STAFF',
        pin: '0000' // Staff için varsayılan PIN
      }
    });
  } else {
    await prisma.user.update({
      where: { phone: '+905009876543' },
      data: { pin: '0000' }
    });
  }

  console.log('✅ 2 kullanıcı oluşturuldu');

  // Örnek ürünler - Sebze kategorisi
  await prisma.product.upsert({
    where: { id: 'prod-domates-001' },
    update: {},
    create: {
      id: 'prod-domates-001',
      name_tr: 'Domates',
      name_de: 'Tomate',
      name_pa: 'ਟਮਾਟਰ',
      categoryId: sebze.id,
      unit: 'kg',
      lastPrice: 3.50,
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300'
    }
  });

  await prisma.product.upsert({
    where: { id: 'prod-sogan-001' },
    update: {},
    create: {
      id: 'prod-sogan-001',
      name_tr: 'Soğan',
      name_de: 'Zwiebel',
      name_pa: 'ਪਿਆਜ',
      categoryId: sebze.id,
      unit: 'kg',
      lastPrice: 2.20,
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300'
    }
  });

  await prisma.product.upsert({
    where: { id: 'prod-biber-001' },
    update: {},
    create: {
      id: 'prod-biber-001',
      name_tr: 'Biber',
      name_de: 'Paprika',
      name_pa: 'ਮਿਰਚ',
      categoryId: sebze.id,
      unit: 'kg',
      lastPrice: 4.00,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300'
    }
  });

  // Örnek ürünler - İçecekler kategorisi
  await prisma.product.upsert({
    where: { id: 'prod-su-001' },
    update: {},
    create: {
      id: 'prod-su-001',
      name_tr: 'Su',
      name_de: 'Wasser',
      name_pa: 'ਪਾਣੀ',
      categoryId: icecek.id,
      unit: 'litre',
      lastPrice: 0.50,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=300'
    }
  });

  await prisma.product.upsert({
    where: { id: 'prod-cay-001' },
    update: {},
    create: {
      id: 'prod-cay-001',
      name_tr: 'Çay',
      name_de: 'Tee',
      name_pa: 'ਚਾਹ',
      categoryId: icecek.id,
      unit: 'paket',
      lastPrice: 5.99,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300'
    }
  });

  console.log('✅ 5 ürün oluşturuldu');
  console.log('\n📋 Giriş Bilgileri:');
  console.log(`👨‍💼 Admin: ${admin.name} (PIN: 0000)`);
  console.log(`👨‍🍳 Staff: ${staff.name} (PIN: 1234)`);
  console.log('\n✨ Seed tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
