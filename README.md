# Kitchen Shoplist 🍴

Çok dilli (Türkçe, Almanca, Pencapça) mutfak alışveriş listesi yönetim sistemi.

## Özellikler

- ✅ **Çok Dilli Destek**: Türkçe, Almanca ve Pencapça arayüz
- 🤖 **AI Çeviri**: Google Gemini ile otomatik ürün çevirisi
- 👨‍🍳 **Personel Paneli**: PIN ile giriş, kolay sipariş oluşturma
- 👨‍💼 **Admin Paneli**: Ürün yönetimi, sipariş takibi, finansal raporlar
- 📊 **Raporlama**: Aylık harcama raporları ve kategori analizi
- 🔐 **Kimlik Doğrulama**: PIN bazlı güvenli giriş sistemi

## Teknolojiler

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM 7)
- **AI**: Google Gemini 1.5 Flash
- **Icons**: Lucide React

## Kurulum

### 1. Gereksinimler

- Node.js 20+
- npm veya yarn

### 2. Projeyi Klonlayın

```bash
git clone <repo-url>
cd kitchen-shoplist
```

### 3. Bağımlılıkları Yükleyin

```bash
npm install
```

### 4. Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env
```

#### Gerekli Environment Variables:

| Variable | Açıklama | Nereden Alınır |
|----------|----------|----------------|
| `DATABASE_URL` | Prisma Postgres proxy URL | `npx prisma dev` komutu ile otomatik oluşturulur |
| `DIRECT_DATABASE_URL` | Direkt PostgreSQL bağlantısı | Prisma Postgres API key'inden çıkarılır |
| `GEMINI_API_KEY` | Ürün çevirisi için Google Gemini API anahtarı | https://aistudio.google.com/app/apikey |
| `NODE_ENV` | Uygulama ortamı | `development` veya `production` |

**Not**: `GEMINI_API_KEY` olmadan ürün çeviri özelliği çalışmaz, ancak uygulama çalışmaya devam eder. Gemini API ücretsiz tier'da günde 1500 istek hakkı sunar.

### 5. Veritabanını Başlatın

```bash
# Prisma Postgres sunucusunu başlat (yeni terminalde)
npx prisma dev

# Migration çalıştır
npm run db:migrate

# Seed data ekle
npm run db:seed
```

Seed tamamlandığında giriş bilgileri:
- **Admin**: PIN `0000`
- **Staff**: PIN `1234`

### 6. Development Server Başlatın

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde açılacak.

## Kullanım

### Personel (Staff) Paneli
**URL**: http://localhost:3000/staff

1. PIN ile giriş yapın (varsayılan: `1234`)
2. Kategorilerden ürünleri seçin
3. Sepete ekleyin (+/- butonları)
4. "Siparişi Gönder" butonuna basın

### Admin Paneli

#### Ürün Yönetimi
**URL**: http://localhost:3000/admin

1. Kategori seçin
2. Türkçe ürün adı girin
3. "Çevir" butonuna basarak AI çeviri alın
4. Gerekirse manuel düzenleyin
5. "Ürünü Sisteme Kaydet" butonuna basın

#### Sipariş Takibi
**URL**: http://localhost:3000/admin/orders

1. Bekleyen siparişleri görün
2. Bir siparişe tıklayın
3. Her ürün için fiyat girin (€)
4. "Siparişi Kapat ve Kaydet" butonuna basın

#### Finansal Raporlar
**URL**: http://localhost:3000/admin/reports

1. Yıl ve ay seçin
2. "Rapor Getir" butonuna basın
3. Kategori bazlı harcamaları görün

## Veritabanı Yönetimi

### Prisma Studio (Görsel Veritabanı Editörü)

```bash
npm run db:studio
```

http://localhost:5555 adresinde açılır.

### Migration

```bash
# Yeni migration oluştur
npm run db:migrate

# Seed data yeniden ekle
npm run db:seed
```

## Proje Yapısı

```
kitchen-shoplist/
├── app/
│   ├── admin/          # Admin paneli sayfaları
│   ├── staff/          # Personel paneli
│   ├── api/            # API routes
│   │   ├── auth/       # Kimlik doğrulama
│   │   ├── orders/     # Sipariş yönetimi
│   │   ├── products/   # Ürün işlemleri
│   │   ├── categories/ # Kategori listesi
│   │   └── report/     # Raporlama
│   └── layout.tsx      # Ana layout
├── prisma/
│   ├── schema.prisma   # Veritabanı şeması
│   └── seed.ts         # Başlangıç verisi
├── lib/
│   ├── prisma.ts       # Prisma client singleton
│   └── auth.ts         # Auth utilities
└── public/             # Static dosyalar
```

## API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/login` | PIN ile giriş |
| POST | `/api/auth/logout` | Çıkış |
| GET | `/api/products` | Tüm ürünleri getir |
| POST | `/api/products/add` | AI ile çeviri al |
| POST | `/api/products/save` | Ürün kaydet |
| GET | `/api/categories` | Kategorileri listele |
| GET | `/api/orders/pending` | Bekleyen siparişler |
| POST | `/api/orders/create` | Yeni sipariş oluştur |
| POST | `/api/orders/complete` | Siparişi tamamla |
| GET | `/api/report/monthly` | Aylık rapor |

## Veritabanı Şeması

### Models

- **User**: Kullanıcılar (Admin & Staff)
- **Category**: Ürün kategorileri
- **Product**: Ürünler (çok dilli)
- **ShoppingList**: Alışveriş listeleri
- **ListItem**: Liste kalemleri

Detaylı şema için `prisma/schema.prisma` dosyasına bakın.

## Güvenlik

⚠️ **Geliştirme Notları**:
- PIN'ler şu anda plain text olarak saklanıyor (production için bcrypt kullanın)
- Session yönetimi basit base64 encoding kullanıyor (production için JWT tercih edin)
- API rate limiting yok (production için ekleyin)

## Deployment (Production)

### Vercel ile Deploy (Önerilen)

#### Otomatik Deploy (GitHub Integration)

1. **Vercel'e Git**: https://vercel.com/new
2. **GitHub'ı bağlayın** ve `suyanik/Einkauflist` repo'sunu import edin
3. **Environment Variables** ekleyin:
   ```
   DATABASE_URL=your-production-database-url
   DIRECT_DATABASE_URL=your-direct-database-url
   GEMINI_API_KEY=your-gemini-api-key
   NODE_ENV=production
   ```
4. **Deploy** butonuna basın

**Avantajlar**:
- Her `git push` otomatik deploy tetikler
- Preview deployments her PR için
- Automatic HTTPS ve global CDN
- Zero-config Next.js support

#### Manuel Deploy (CLI)

```bash
# 1. Vercel CLI'a giriş yapın
vercel login

# 2. İlk deploy
vercel

# 3. Production deploy
vercel --prod
```

### Production Database Seçenekleri

Local Prisma Postgres yerine production için:

1. **Vercel Postgres** (önerilen)
   ```bash
   vercel postgres create
   ```

2. **Supabase**
   - https://supabase.com
   - PostgreSQL + real-time + storage

3. **Railway**
   - https://railway.app
   - Kolay PostgreSQL setup

4. **Neon**
   - https://neon.tech
   - Serverless PostgreSQL

### Post-Deployment Checklist

- [ ] Environment variables doğru ayarlandı
- [ ] Database migration çalıştırıldı (`npx prisma migrate deploy`)
- [ ] Seed data eklendi (opsiyonel)
- [ ] GEMINI_API_KEY test edildi
- [ ] Admin ve Staff PIN'leri değiştirildi (güvenlik)

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT License

## İletişim

Sorularınız için issue açabilirsiniz.

---

**Built with ❤️ using Next.js 16 and Prisma 7**
