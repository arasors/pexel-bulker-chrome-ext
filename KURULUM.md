# PexelBulker Kurulum Rehberi

## 🚀 Hızlı Kurulum (3 Adım)

### Adım 1: Icon'ları Oluşturun

1. `generate-icons.html` dosyasını tarayıcınızda açın
2. "Icon'ları Oluştur ve İndir" butonuna tıklayın
3. İndirilen 3 dosyayı (`icon16.png`, `icon48.png`, `icon128.png`) `icons/` klasörüne taşıyın

### Adım 2: Chrome'da Eklentiyi Yükleyin

1. Chrome'da `chrome://extensions/` adresine gidin
2. Sağ üst köşede **"Developer mode"** (Geliştirici modu) açın
3. **"Load unpacked"** (Paketlenmemiş uzantı yükle) butonuna tıklayın
4. `PexelBulker` klasörünü seçin

✅ Eklenti yüklendi!

### Adım 3: Test Edin

1. Şu adrese gidin: https://www.pexels.com/tr-tr/@cottonbro/videos/
2. Chrome toolbar'ında PexelBulker ikonuna tıklayın
3. "URL'yi Tespit Et" butonuna tıklayın
4. İndirmeyi başlatın!

---

## 📖 Detaylı Kullanım

### İlk Kullanım

1. **Pexels kullanıcı sayfasına gidin**
   - Herhangi bir Pexels kullanıcısının video sayfası olabilir
   - Örnek: `https://www.pexels.com/@kullanici-adi/videos/`

2. **Eklentiyi açın**
   - Toolbar'daki PexelBulker ikonuna tıklayın
   - Veya kısayol tuşu (varsa) kullanın

3. **URL'yi tespit edin**
   - "URL'yi Tespit Et" butonuna basın
   - Eklenti otomatik olarak API URL'sini bulacak
   - Toplam sayfa ve video sayısını göreceksiniz

4. **Ayarları yapılandırın**
   
   **Kalite Seçimi:**
   - **UHD**: En yüksek kalite (4K - 3840×2160 ve üzeri)
   - **HD**: Yüksek çözünürlük (1080p/720p)
   - **SD**: Standart çözünürlük (480p ve altı)
   - **Hepsi**: Mevcut en iyi kaliteyi otomatik seç
   
   **Sayfa Aralığı:**
   - "Tüm sayfaları indir" işaretli ise tüm sayfalar taranır
   - İşareti kaldırırsanız belirli sayfa aralığı belirleyebilirsiniz
   - Örnek: Sayfa 1-10 arası indirme

5. **İndirmeyi başlatın**
   - "Tara ve İndir" butonuna tıklayın
   - İşlem günlüğünden ilerlemeyi takip edin
   - Videolar `İndirilenler/PexelBulker/` klasörüne kaydedilir

---

## 🔧 Sorun Giderme

### Eklenti Görünmüyor

**Çözüm:**
- `chrome://extensions/` sayfasında eklentinin aktif olduğundan emin olun
- Sağ üst köşede puzzle 🧩 ikonuna tıklayıp PexelBulker'ı sabitle

### "URL Tespiti Başarısız"

**Sebep:** Sayfanın henüz tam yüklenmemiş olması

**Çözüm:**
1. Sayfayı F5 ile yenileyin
2. Sayfa tamamen yüklenene kadar bekleyin
3. URL'yi tekrar tespit edin

**Alternatif Çözüm:**
1. Chrome DevTools'u açın (F12)
2. Network sekmesine gidin
3. Sayfayı yenileyin
4. `api/v3/users/` içeren bir istek bulun
5. URL'yi kopyalayın ve eklentiye manuel girin

### "API Çağrısı Başarısız"

**Olası Sebepler:**
- İnternet bağlantısı kesildi
- Pexels'te oturum açmamışsınız
- VPN/Proxy sorunları
- Pexels API rate limiting

**Çözüm:**
1. Pexels'e giriş yaptığınızdan emin olun
2. İnternet bağlantınızı kontrol edin
3. VPN kullanıyorsanız kapatın
4. Birkaç dakika bekleyip tekrar deneyin

### İndirmeler Başlamıyor

**Çözüm:**
1. Chrome indirme izinlerini kontrol edin:
   - Ayarlar > Gizlilik ve güvenlik > Site ayarları > İndirmeler
2. Disk alanınızı kontrol edin
3. `chrome://downloads/` sayfasından indirmelerin engellenip engellenmediğini kontrol edin

### Bazı Videolar İndirilmiyor

**Sebep:** Video dosyası artık mevcut değil veya erişim sorunu

**Çözüm:**
- Normal bir durumdur, bazı videolar silinmiş olabilir
- İşlem günlüğünden hangi videoların başarısız olduğunu görebilirsiniz
- Başarısız indirmeleri manuel olarak deneyebilirsiniz

### Rate Limiting Uyarısı

**Sebep:** Çok fazla sayfa çok hızlı taranıyor

**Çözüm:**
1. Daha küçük sayfa aralıkları kullanın (örn: 50 sayfa yerine 20 sayfa)
2. İndirme bitene kadar bekleyin
3. Birkaç dakika ara verin
4. Eklenti zaten otomatik beklemeler ekler, sabırlı olun

---

## ⚙️ Gelişmiş Ayarlar

### Developer Console'da Debug

1. `chrome://extensions/` sayfasına gidin
2. PexelBulker'da "Inspect views: service worker" linkine tıklayın
3. Console sekmesinde detaylı log mesajlarını görebilirsiniz

### Manuel API URL Girişi

Eğer otomatik tespit çalışmazsa:

1. Pexels kullanıcı sayfasında F12 ile DevTools açın
2. Network sekmesine gidin
3. XHR filtresi seçin
4. Sayfayı yenileyin
5. `api/v3/users/[USER_ID]/media/recent` gibi bir istek bulun
6. İsteğin URL'sini sağ tıklayıp "Copy URL" seçin
7. Eklentideki input alanına yapıştırın

### Toplu İndirme İpuçları

**Büyük Koleksiyonlar için:**
- Kalite olarak "HD" veya "SD" seçin (daha hızlı)
- Sayfa aralığını 50-100 ile sınırlayın
- Birden fazla oturumda indirin

**En İyi Performans için:**
- Diğer indirmeleri duraklatın
- Başka sekmeleri kapatın
- İnternet bağlantısının stabil olduğundan emin olun

---

## 📊 Sınırlamalar

- **Chrome İndirme Limitleri**: Aynı anda maksimum indirme sayısı Chrome tarafından sınırlıdır
- **API Rate Limiting**: Pexels API'si dakika başına istek sayısını sınırlar
- **Disk Alanı**: UHD videolar çok yer kaplar (video başına 50-500 MB)

---

## 🎯 En İyi Pratikler

1. ✅ Küçük koleksiyonlarla test edin
2. ✅ İndirme klasörünüzü düzenli kontrol edin
3. ✅ Disk alanınızı takip edin
4. ✅ İndirme tamamlanana kadar bekleyin
5. ⚠️ Aynı anda birden fazla toplu indirme yapmayın
6. ⚠️ Binlerce videoyu tek seferde indirmeyin

---

## 💡 İpuçları

### Hızlı Test
```
Test kullanıcısı: @cottonbro
Test URL: https://www.pexels.com/tr-tr/@cottonbro/videos/
```

### Dosya Adları
İndirilen videolar şu formatta adlandırılır:
```
pexels-[VIDEO_ID]-[kalite]-[genişlik]x[yükseklik].mp4
```
Örnek: `pexels-10667849-uhd-1440x2732.mp4`

### Klasör Yapısı
```
İndirilenler/
└── PexelBulker/
    ├── pexels-10667849-uhd-1440x2732.mp4
    ├── pexels-10667782-uhd-4096x2160.mp4
    └── ...
```

---

## 🆘 Hala Sorun mu Var?

1. **Eklentiyi kaldırıp tekrar yükleyin**
   - chrome://extensions/ sayfasında "Remove" butonuna tıklayın
   - Tarayıcıyı yeniden başlatın
   - Eklentiyi tekrar yükleyin

2. **Chrome'u güncelleyin**
   - chrome://settings/help sayfasına gidin
   - Güncellemeleri kontrol edin

3. **Cache'i temizleyin**
   - Ctrl+Shift+Delete
   - "Önbelleğe alınmış resimler ve dosyalar" seçin
   - "Verileri temizle"

4. **Developer Console'da hata mesajlarını kontrol edin**
   - F12 ile DevTools açın
   - Console sekmesindeki kırmızı hata mesajlarını okuyun

---

## 📞 Destek

Sorunlar devam ederse:
- GitHub Issues açın
- Hata mesajlarını ve ekran görüntülerini ekleyin
- Chrome versiyonunuzu belirtin
- İşletim sisteminizi belirtin

---

**Keyifli indirmeler! 🎬✨**
