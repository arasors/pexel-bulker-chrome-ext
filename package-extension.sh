#!/bin/bash

# PexelBulker Chrome Extension Paketleme Script'i

echo "🎬 PexelBulker Chrome Eklentisi Paketleniyor..."
echo ""

# Icon kontrolü
if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
    echo "⚠️  Uyarı: Icon dosyaları bulunamadı!"
    echo "📝 generate-icons.html dosyasını açarak icon'ları oluşturun."
    echo ""
    read -p "Icon'lar olmadan devam etmek istiyor musunuz? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Paketleme iptal edildi."
        exit 1
    fi
fi

# Geçici dizin oluştur
TEMP_DIR="pexelbulker-package-temp"
VERSION="1.3.1"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "📦 Dosyalar kopyalanıyor..."

# Gerekli dosyaları kopyala
cp manifest.json "$TEMP_DIR/"
cp popup.html "$TEMP_DIR/"
cp popup.js "$TEMP_DIR/"
cp content.js "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"
cp README.md "$TEMP_DIR/"
cp LICENSE "$TEMP_DIR/"

# Icon'ları kopyala (varsa)
if [ -d "icons" ] && [ "$(ls -A icons/*.png 2>/dev/null)" ]; then
    cp -r icons "$TEMP_DIR/"
    echo "✅ Icon'lar kopyalandı"
else
    mkdir -p "$TEMP_DIR/icons"
    echo "⚠️  Icon'lar atlandı"
fi

# ZIP oluştur
PACKAGE_NAME="pexelbulker-v$VERSION-multilanguage.zip"
echo ""
echo "🗜️  ZIP dosyası oluşturuluyor..."

cd "$TEMP_DIR"
zip -r "../$PACKAGE_NAME" . -x "*.DS_Store" "*/\.*"
cd ..

# Temizlik
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Paketleme tamamlandı!"
echo "📦 Dosya: $PACKAGE_NAME"
echo ""
echo "📋 Sonraki adımlar:"
echo "   1. Chrome'da chrome://extensions/ adresine gidin"
echo "   2. 'Developer mode' açın"
echo "   3. 'Load unpacked' ile klasörü yükleyin"
echo "   veya"
echo "   4. ZIP dosyasını Chrome Web Store'a yükleyin"
echo ""
echo "🎉 Başarılar!"
