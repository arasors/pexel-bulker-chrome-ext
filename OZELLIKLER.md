# 🎬 PexelBulker - Özellikler ve Teknik Detaylar

## 🌟 Ana Özellikler

### 1. Otomatik URL Tespiti
- Pexels kullanıcı sayfalarından otomatik API URL'si çıkarma
- User ID'yi otomatik tespit etme
- Locale desteği (tr-tr, en-us, vb.)

### 2. Akıllı Pagination Yönetimi
- API'den toplam sayfa sayısını otomatik okuma
- Toplam video sayısını gösterme
- Kullanıcı tanımlı sayfa aralığı seçimi
- Tek seferde tüm sayfaları tarama

### 3. Çoklu Kalite Seçenekleri
```
📹 UHD (Ultra HD)  - 4K ve üzeri (3840×2160+)
📹 HD (High Def)   - 1080p/720p
📹 SD (Standard)   - 480p ve altı
📹 AUTO (Otomatik) - Mevcut en iyi kalite
```

### 4. Gelişmiş İndirme Yönetimi
- Chrome Downloads API entegrasyonu
- Otomatik dosya adlandırma
- Klasör organizasyonu (`İndirilenler/PexelBulker/`)
- Çakışma durumunda otomatik yeniden adlandırma
- İndirme durumu takibi

### 5. Rate Limiting & API Koruma
- İstekler arası otomatik bekleme (500ms)
- İndirmeler arası delay (1000ms)
- API rate limit'ini aşmamak için koruma
- Hata durumunda graceful handling

### 6. Kullanıcı Dostu Arayüz
- Modern gradient tasarım
- Real-time progress tracking
- Detaylı işlem günlüğü
- Başarı/hata renkli bildirimleri
- Responsive design

### 7. Güvenlik ve Gizlilik
- Pexels cookie'lerini kullanma
- Sayfanın mevcut session'ını kullanma
- Header'ları otomatik taşıma
- Credentials: 'include' ile güvenli istekler

## 🏗️ Teknik Mimari

### Manifest V3
- Modern Chrome extension standardı
- Service Worker tabanlı background script
- Content Security Policy uyumlu

### Dosya Yapısı
```
PexelBulker/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup.html            # Popup UI (450px width)
├── popup.js              # Popup logic & event handlers
├── content.js            # Content script (page interaction)
├── background.js         # Service worker (download management)
├── styles.css            # Modern gradient styling
├── generate-icons.html   # Icon generator tool
├── package-extension.sh  # Packaging script
├── README.md             # Main documentation
├── KURULUM.md           # Installation guide
├── OZELLIKLER.md        # This file
├── LICENSE              # MIT License
├── .gitignore           # Git ignore rules
└── icons/               # Extension icons
    ├── icon16.png       # Toolbar icon
    ├── icon48.png       # Extension management
    ├── icon128.png      # Chrome Web Store
    └── README.md        # Icon instructions
```

### İletişim Akışı
```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Popup     │ ◄────► │   Content    │ ◄────► │   Pexels    │
│  (popup.js) │  MSG   │ (content.js) │  FETCH │   API       │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │ MSG                    │
      ▼                        ▼
┌─────────────┐         ┌──────────────┐
│ Background  │ ◄────► │   Chrome     │
│(background) │  API   │  Downloads   │
└─────────────┘         └──────────────┘
```

## 📊 API Entegrasyonu

### Pexels API Endpoint
```
https://www.pexels.com/{locale}/api/v3/users/{userId}/media/recent
```

### Query Parameters
- `type=videos` - Sadece video medyası
- `page={pageNum}` - Sayfa numarası
- `per_page={count}` - Sayfa başına sonuç (max 80)
- `seo_tags=true` - SEO tag'lerini dahil et

### Response Structure
```javascript
{
  "data": [
    {
      "id": "10667849",
      "type": "video",
      "attributes": {
        "video": {
          "video_files": [
            {
              "file_type": "video/mp4",
              "quality": "uhd|hd|sd",
              "width": 1440,
              "height": 2732,
              "fps": 25.0,
              "link": "https://videos.pexels.com/...",
              "download_link": "https://www.pexels.com/..."
            }
          ]
        }
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3075,
    "total_results": 36889
  }
}
```

## 🔐 İzinler (Permissions)

### manifest.json İzinleri
```json
{
  "permissions": [
    "downloads",      // Video indirme
    "storage",        // Ayarları kaydetme
    "cookies",        // Pexels cookies okuma
    "activeTab"       // Aktif sekme ile etkileşim
  ],
  "host_permissions": [
    "https://www.pexels.com/*",       // Ana site
    "https://videos.pexels.com/*",    // Video CDN
    "https://images.pexels.com/*"     // Thumbnail'ler
  ]
}
```

## 💡 Algoritma Akışı

### 1. URL Tespiti
```
Kullanıcı "URL'yi Tespit Et" tıklar
    ↓
Content script sayfa URL'sini kontrol eder
    ↓
User ID'yi sayfadan çıkarır (performance API veya DOM)
    ↓
API URL'sini oluşturur
    ↓
İlk sayfayı fetch eder
    ↓
Pagination bilgisini gösterir
```

### 2. Tarama Süreci
```
Kullanıcı "Tara ve İndir" tıklar
    ↓
Background script'e mesaj gönderir
    ↓
FOR her sayfa:
    Content script üzerinden API fetch
    Video files'ları parse et
    Kalite seçimine göre filtrele
    Download queue'ya ekle
    500ms bekle (rate limiting)
    ↓
Tarama tamamlandı!
```

### 3. İndirme Süreci
```
Download queue hazır
    ↓
FOR her video:
    chrome.downloads.download() çağır
    İndirme listener ekle
    Durum değişikliklerini takip et
    İlerlemeyi güncelle
    1000ms bekle (rate limiting)
    ↓
Tüm indirmeler tamamlandı!
```

## 🎨 UI/UX Özellikleri

### Renkler ve Tema
```css
Primary Gradient: #667eea → #764ba2
Success: #48bb78
Error: #f56565
Info: #4299e1
Background: #f9f9f9
```

### Responsive Design
- Fixed width: 450px
- Max height: 600px
- Auto scroll bar
- Custom scrollbar styling

### İlerleme Göstergesi
```
[████████░░░░░░░░░░░░] 40%
Sayfa 20/50 tarandı
15/150 video indiriliyor
```

### Log Renkleri
- 🔵 INFO: Mavi border
- 🟢 SUCCESS: Yeşil border
- 🔴 ERROR: Kırmızı border

## ⚙️ Konfigurasyon

### Varsayılan Ayarlar
```javascript
{
  quality: 'uhd',           // Kalite tercihi
  allPages: true,           // Tüm sayfalar
  startPage: 1,             // Başlangıç sayfası
  endPage: totalPages,      // Bitiş sayfası
  perPage: 80,              // Sayfa başı sonuç
  scanDelay: 500,           // Tarama delay (ms)
  downloadDelay: 1000       // İndirme delay (ms)
}
```

### Özelleştirilebilir Değerler
- Kalite seçimi (UHD/HD/SD/AUTO)
- Sayfa aralığı (başlangıç-bitiş)
- İndirme klasörü (default: PexelBulker/)

## 📈 Performans

### Optimizasyonlar
- Lazy loading: Sadece görünen elemanlar render edilir
- Efficient DOM manipulation
- Minimal memory footprint
- Batch API requests
- Sequential download (Chrome limitleri)

### Hız Metrikleri
```
Sayfa tarama: ~500-1000ms per page
Video indirme: Bağlantı hızına bağlı
UHD video: ~50-500 MB
HD video: ~20-100 MB
SD video: ~5-20 MB
```

## 🔄 Gelecek Özellikler (Roadmap)

### v1.1
- [ ] Foto indirme desteği
- [ ] Duraklat/Devam et butonu
- [ ] İndirme hızı gösterimi

### v1.2
- [ ] Playlist desteği
- [ ] Favori kullanıcılar
- [ ] Zamanlanmış indirme

### v1.3
- [ ] Metadata export (JSON/CSV)
- [ ] Duplicate detection
- [ ] Video preview

## 🐛 Bilinen Limitasyonlar

1. **Chrome İndirme Limiti**: Aynı anda çok sayıda indirme Chrome tarafından throttle edilebilir
2. **API Rate Limiting**: Çok hızlı istek gönderme Pexels tarafından engellenebilir
3. **Memory Usage**: Binlerce video listesi bellekte tutulabilir
4. **Disk Space**: UHD videolar çok yer kaplar
5. **Network**: Yavaş bağlantılarda timeout olabilir

## 📜 Versiyonlama

### Semantic Versioning
```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └─── Bug fixes
  │     └───────── Yeni özellikler (backward compatible)
  └─────────────── Breaking changes
```

### Mevcut Versiyon
```
v1.0.0 (Initial Release)
```

## 🤝 Katkıda Bulunma

### Geliştirme Ortamı
```bash
# Projeyi klonla
git clone [repository-url]

# Icon'ları oluştur
open generate-icons.html

# Chrome'da yükle
chrome://extensions/
```

### Test Etme
1. Test kullanıcısı: @cottonbro
2. Test URL: https://www.pexels.com/tr-tr/@cottonbro/videos/
3. Developer Console'da hata kontrolü

### Pull Request
1. Feature branch oluştur
2. Değişiklikleri commit et
3. PR aç ve açıklama ekle

---

**Made with ❤️ for efficient Pexels downloading**
