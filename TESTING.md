# Testing Documentation

## Test Altyapısı

Proje **Vitest** ve **React Testing Library** kullanarak test edilmektedir.

### Kurulum

Test bağımlılıkları zaten yüklü. Eğer yeniden yüklemeniz gerekirse:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

## Test Komutları

```bash
# Testleri watch modunda çalıştır (geliştirme için)
npm test

# Testleri bir kez çalıştır (CI/CD için)
npm run test:run

# Test UI'ını aç (görsel test yönetimi)
npm run test:ui

# Test coverage raporu oluştur
npm run test:coverage
```

## Test Yapısı

### Mevcut Test Dosyaları

#### 1. **API Orders Pending** (`app/api/orders/pending/route.test.ts`)
**Test Edilen**: `GET /api/orders/pending`
- ✅ Bekleyen siparişleri başarıyla döndürme
- ✅ Boş liste döndürme
- ✅ Veritabanı hatalarını yakalama

**Test Sayısı**: 3

#### 2. **API Categories** (`app/api/categories/route.test.ts`)
**Test Edilen**: `GET /api/categories`
- ✅ Tüm kategorileri başarıyla döndürme
- ✅ Boş liste döndürme
- ✅ Alfabetik sıralama kontrolü
- ✅ Veritabanı hatalarını yakalama

**Test Sayısı**: 3

#### 3. **API Auth Login** (`app/api/auth/login/route.test.ts`)
**Test Edilen**: `POST /api/auth/login`
- ✅ Doğru PIN ile başarılı giriş
- ✅ HttpOnly cookie ayarlama
- ✅ Yanlış PIN ile reddedilme (401)
- ✅ Geçersiz PIN formatı validasyonu (400)
- ✅ Eksik PIN kontrolü
- ✅ Veritabanı hatalarını yakalama

**Test Sayısı**: 5

## Test Sonuçları

```
Test Files  3 passed (3)
     Tests  11 passed (11)
  Start at  17:22:42
  Duration  5.93s
```

**Başarı Oranı**: %100 ✅

## Mock Stratejisi

### Prisma Mock
Tüm testlerde Prisma client mock'lanmıştır:

```typescript
vi.mock('@/lib/prisma', () => ({
  prisma: {
    shoppingList: { findMany: vi.fn() },
    category: { findMany: vi.fn() },
    user: { findFirst: vi.fn() },
  },
}));
```

Bu sayede:
- Testler gerçek veritabanına bağlanmaz
- Hızlı çalışır
- İzole edilmiştir

## Test Yazma Rehberi

### Yeni API Endpoint Testi Ekleme

1. Test dosyasını endpoint'in yanına oluşturun:
   ```
   app/api/your-endpoint/route.test.ts
   ```

2. Temel yapı:
   ```typescript
   import { describe, it, expect, vi, beforeEach } from 'vitest';
   import { GET } from './route';

   vi.mock('@/lib/prisma', () => ({
     prisma: {
       // Mock your Prisma calls
     },
   }));

   describe('GET /api/your-endpoint', () => {
     beforeEach(() => {
       vi.clearAllMocks();
     });

     it('should do something', async () => {
       // Arrange
       const { prisma } = await import('@/lib/prisma');
       vi.mocked(prisma.model.method).mockResolvedValue(mockData);

       // Act
       const response = await GET();
       const json = await response.json();

       // Assert
       expect(json.success).toBe(true);
     });
   });
   ```

3. Testleri çalıştırın:
   ```bash
   npm test
   ```

### Component Testi Ekleme

Component testleri için örnek:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Test İsimlendirme
- Açıklayıcı olun: "should return 200 when user is authenticated"
- Türkçe veya İngilizce tutarlı kullanın
- "it" bloğu bir cümle olmalı

### 2. Arrange-Act-Assert Pattern
```typescript
it('example test', () => {
  // Arrange - Hazırlık
  const input = 'test';

  // Act - İşlem
  const result = doSomething(input);

  // Assert - Doğrulama
  expect(result).toBe('expected');
});
```

### 3. Mock Cleanup
Her testten önce mock'ları temizleyin:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 4. Error Cases
Başarılı senaryolar kadar hata senaryolarını da test edin:
- 400 Bad Request
- 401 Unauthorized
- 500 Internal Server Error
- Network errors
- Database errors

## CI/CD Entegrasyonu

### GitHub Actions Örneği

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:run
```

## Coverage Hedefleri

**Mevcut Coverage**: Başlangıç (API katmanı)

**Hedefler**:
- [ ] API Routes: %80
- [ ] Components: %70
- [ ] Utilities: %90
- [ ] Integration Tests: En az 5 temel workflow

## Gelecek Testler

### Öncelikli
- [ ] `/api/products` endpoint testleri
- [ ] `/api/orders/create` endpoint testleri
- [ ] `/api/orders/complete` endpoint testleri
- [ ] `/api/report/monthly` endpoint testleri

### İkincil
- [ ] Staff page component testleri
- [ ] Admin panel component testleri
- [ ] Authentication hook testleri
- [ ] Prisma utilities testleri

### Integration Tests
- [ ] Complete order workflow (staff → admin)
- [ ] Product translation flow (Gemini API)
- [ ] Report generation end-to-end

## Debugging

### Test Başarısız Olduğunda

1. **Hata Mesajını Okuyun**
   ```bash
   npm test -- --reporter=verbose
   ```

2. **Tek Bir Test Çalıştırın**
   ```bash
   npm test -- route.test.ts
   ```

3. **Debug Mode**
   ```bash
   node --inspect-brk ./node_modules/.bin/vitest
   ```

4. **Console.log Ekleyin**
   ```typescript
   it('test', async () => {
     const result = await someFunction();
     console.log('Result:', result);
     expect(result).toBe(expected);
   });
   ```

## Sorun Giderme

### "Cannot find module '@/lib/prisma'"
- `vitest.config.ts` dosyasında path alias ayarlandığından emin olun
- `tsconfig.json` ile tutarlı olmalı

### "ReferenceError: Request is not defined"
- `environment: 'jsdom'` vitest.config.ts'de ayarlı olmalı
- Next.js Request/Response için polyfill gerekebilir

### Mock Çalışmıyor
- `vi.mock()` çağrısı import'lardan önce olmalı
- Mock path'i doğru yazdığınızdan emin olun
- `beforeEach` bloğunda `vi.clearAllMocks()` kullanın

## Kaynaklar

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Son Güncelleme**: 2026-01-24
**Test Framework**: Vitest 4.0.18
**Toplam Test**: 11 ✅
