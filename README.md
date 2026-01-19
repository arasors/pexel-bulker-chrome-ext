# 🎬 PexelBulker

Pexels'den toplu video indirme için Chrome eklentisi.

## Özellikler

✅ Pexels kullanıcı sayfalarından tüm videoları toplu indirme
✅ Otomatik sayfa tarama ve pagination yönetimi
✅ Kalite seçenekleri (UHD, HD, SD)
✅ Sayfa aralığı belirleme
✅ İlerleme takibi ve detaylı log
✅ Pexels cookie'leri ve header'ları ile güvenli indirme
✅ Rate limiting ile API koruma

## Kurulum

### 1. Chrome'da Developer Mode'u Aktifleştirin

1. Chrome'da `chrome://extensions/` adresine gidin
2. Sağ üst köşedeki "Developer mode" (Geliştirici modu) açın

### 2. Eklentiyi Yükleyin

1. "Load unpacked" (Paketlenmemiş uzantı yükle) butonuna tıklayın
2. `PexelBulker` klasörünü seçin
3. Eklenti yüklendi!

### 3. İkonları Ekleyin (Opsiyonel)

Eklenti çalışacak ancak ikonları görmek için `icons` klasörüne aşağıdaki boyutlarda PNG dosyaları ekleyebilirsiniz:
- `icon16.png` (16x16 px)
- `icon48.png` (48x48 px)
- `icon128.png` (128x128 px)

## Kullanım

1. **Pexels Kullanıcı Sayfasına Gidin**
   - Örnek: `https://www.pexels.com/tr-tr/@cottonbro/videos/`
   - Kullanıcının video sayfasında olmanız gerekiyor

2. **Eklentiyi Açın**
   - Chrome toolbar'ında PexelBulker ikonuna tıklayın

3. **URL'yi Tespit Edin**
   - "URL'yi Tespit Et" butonuna tıklayın
   - Eklenti otomatik olarak API URL'sini bulacak ve sayfa bilgilerini çekecek

4. **Ayarları Yapın**
   - **Kalite Seçin**: UHD, HD, SD veya Hepsi
   - **Sayfa Aralığı**: Tüm sayfalar veya belirli aralık
   
5. **İndirmeyi Başlatın**
   - "Tara ve İndir" butonuna tıklayın
   - İndirmeler `İndirilenler/PexelBulker/` klasörüne kaydedilir

## Özellikler Detaylı

### Kalite Seçenekleri

- **UHD**: En yüksek kalite (4K)
- **HD**: Yüksek çözünürlük (1080p/720p)
- **SD**: Standart çözünürlük
- **Hepsi**: Mevcut en iyi kaliteyi otomatik seç

### Sayfa Yönetimi

- Toplam sayfa sayısı otomatik tespit edilir
- İstediğiniz aralıkta sayfa tarayabilirsiniz
- Her sayfada 80'e kadar video taranır

### İndirme Yönetimi

- Videolar otomatik olarak sırayla indirilir
- Dosya isimleri: `pexels-[ID]-[kalite]-[genişlik]x[yükseklik].mp4`
- Aynı isimli dosyalar varsa otomatik olarak benzersiz isim verilir
- Rate limiting ile Pexels API'sine zarar verilmez

## Teknik Detaylar

### Gereksinimler

- Chrome Browser v88+
- Manifest V3 desteği

### İzinler

- `downloads`: Video indirme için
- `storage`: Ayarları kaydetme için
- `cookies`: Pexels cookie'lerini okuma için
- `activeTab`: Aktif sekmeyle etkileşim için
- `host_permissions`: Pexels domain'lerine erişim için

### Dosya Yapısı

```
PexelBulker/
├── manifest.json          # Eklenti manifest dosyası
├── popup.html            # Ana UI
├── popup.js              # Popup JavaScript logic
├── content.js            # Sayfa içi script
├── background.js         # Background service worker
├── styles.css            # CSS stilleri
├── icons/                # Eklenti ikonları
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Sorun Giderme

### "URL tespiti başarısız"
- Pexels kullanıcı sayfasında olduğunuzdan emin olun
- Sayfayı yenileyin ve tekrar deneyin
- Developer Console'da hata mesajlarını kontrol edin

### "API çağrısı başarısız"
- İnternet bağlantınızı kontrol edin
- Pexels'e giriş yapmış olduğunuzdan emin olun
- VPN kullanıyorsanız kapatıp deneyin

### İndirmeler başlamıyor
- Chrome indirme izinlerini kontrol edin
- İndirme klasörünüz için yeterli disk alanı olduğundan emin olun
- `chrome://downloads/` adresinden indirme durumunu kontrol edin

### Rate Limiting / Çok fazla istek hatası
- Eklenti otomatik olarak istekler arası bekleme ekler
- Çok fazla sayfa tarama yapıyorsanız, sayfa aralığını küçültün
- Bir süre bekleyip tekrar deneyin

## Geliştirme

### Debug Modu

1. `chrome://extensions/` sayfasında eklentiyi bulun
2. "Inspect views: service worker" linkine tıklayın
3. Console'da log mesajlarını görebilirsiniz

### Test

1. Pexels test kullanıcısı: `@cottonbro`
2. Test URL: `https://www.pexels.com/tr-tr/@cottonbro/videos/`

## Lisans

Bu proje eğitim amaçlıdır. Pexels'in kullanım koşullarına uygun şekilde kullanın.

## Uyarılar

⚠️ **Önemli**: 
- Bu eklenti Pexels'in resmi bir ürünü değildir
- Pexels API kullanım limitlerini aşmayın
- İndirdiğiniz içerikleri Pexels lisans koşullarına uygun kullanın
- Ticari kullanım için Pexels lisans şartlarını okuyun

## İletişim

Sorun bildirimi veya öneriler için GitHub Issues kullanabilirsiniz.

---

Made with ❤️ for efficient Pexels downloading
