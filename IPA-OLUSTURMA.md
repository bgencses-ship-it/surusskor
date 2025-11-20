# 🍎 Native iOS Uygulaması (IPA) Oluşturma Rehberi

Bu rehber, mevcut web uygulamamızı **Capacitor** kullanarak native iOS uygulamasına dönüştürmek için adım adım talimatlar içerir.

## 📋 Gereksinimler

- ✅ **Mac** (macOS 12.0 veya üzeri)
- ✅ **Xcode 14+** (App Store'dan ücretsiz)
- ✅ **Node.js 16+** (nodejs.org'dan indir)
- ⚠️ **Apple Developer Hesabı** (TestFlight/App Store için - $99/yıl)
  - Sadece kendi cihazında test için ücretsiz hesap yeterli

## 🚀 Adım 1: Xcode ve Command Line Tools Kurulumu

### 1.1 Xcode Yükle
```bash
# App Store'dan Xcode indir ve yükle
# Açtıktan sonra additional components'i yükle
```

### 1.2 Command Line Tools Yükle
```bash
xcode-select --install
```

### 1.3 Kontrol Et
```bash
xcode-select -p
# Çıktı: /Applications/Xcode.app/Contents/Developer
```

## 📦 Adım 2: Capacitor Kurulumu

Terminal'i aç ve proje klasörüne git:

```bash
cd "/Users/safakdll/Desktop/adsız klasör"
```

### 2.1 Node.js ve npm Kontrol
    ```bash
    node --version  # v16.x.x veya üzeri olmalı
npm --version   # 8.x.x veya üzeri olmalı
```

Eğer yüklü değilse: [nodejs.org](https://nodejs.org) → LTS sürümü indir

### 2.2 Capacitor Paketlerini Yükle
```bash
npm install
```

### 2.3 iOS Platformunu Ekle
```bash
npx cap add ios
```

Bu komut `ios/` klasörü oluşturacak ve gerekli Xcode proje dosyalarını ekleyecek.

### 2.4 Web Varlıklarını Kopyala
```bash
npx cap sync ios
```

## 🎨 Adım 3: App Icon ve Splash Screen Ayarları

### 3.1 App Icon Oluştur

**Hızlı Yöntem:**
1. [AppIcon Generator](https://www.appicon.co/) sitesine git
2. 1024x1024 px bir logo yükle
3. iOS seçili olsun, "Generate" tıkla
4. `AppIcon.appiconset` klasörünü indir

**Manuel Yerleştirme:**
```bash
# İndirilen AppIcon.appiconset klasörünü şuraya taşı:
# ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### 3.2 Splash Screen (Opsiyonel)
Varsayılan splash screen otomatik oluşturulur. Özelleştirmek için:
```bash
# ios/App/App/Assets.xcassets/Splash.imageset/ klasöründeki
# splash.png dosyasını değiştir (2732x2732 px)
```

## 🔨 Adım 4: Xcode'da Build

### 4.1 Xcode'u Aç
```bash
npx cap open ios
```

Bu komut Xcode projesini açacak.

### 4.2 Proje Ayarları (Xcode'da)

1. **Sol panelden** `App` klasörünü seç
2. **General** sekmesine git
3. Ayarları yap:
   - **Display Name**: `SürüşSkor`
   - **Bundle Identifier**: `com.surusskor.app` (benzersiz olmalı)
   - **Version**: `1.0.0`
   - **Build**: `1`
   - **Deployment Target**: `iOS 14.0` veya üzeri

### 4.3 Signing & Capabilities

**A) Kendi cihazın için (Ücretsiz):**
1. **Signing & Capabilities** sekmesi
2. **Team**: Kendi Apple ID'ni seç (Add Account... ile ekle)
3. **Automatically manage signing**: ✅ işaretle
4. Bundle Identifier'ı benzersiz yap (örn: `com.isim.surusskor`)

**B) TestFlight/App Store için:**
1. Apple Developer hesabı gerekli ($99/yıl)
2. Team olarak Developer hesabını seç
3. Provisioning Profile otomatik oluşacak

### 4.4 Build ve Run

**Simulator'de Test:**
1. Üstteki cihaz seçiciden **Simulator** seç (örn: iPhone 14 Pro)
2. ▶️ **Play** butonuna bas
3. Simulator açılacak ve uygulama çalışacak

**Gerçek iPhone'da Test:**
1. iPhone'u Mac'e USB ile bağla
2. iPhone'da **Settings → General → VPN & Device Management** → Sertifikana güven
3. Xcode'da **cihazını seç**
4. ▶️ **Play** butonuna bas

## 📱 Adım 5: IPA Dosyası Oluşturma

### 5.1 Archive Oluştur

1. Xcode menüsünden **Product → Destination → Any iOS Device (arm64)** seç
2. **Product → Archive** tıkla
3. Archive tamamlanana kadar bekle (2-5 dk)

### 5.2 IPA Export

Archive tamamlanınca **Organizer** penceresi açılacak:

**A) Development (Test için):**
1. **Distribute App** tıkla
2. **Development** seç → Next
3. **Signing** ayarlarını kontrol → Next
4. **Export** tıkla
5. Kaydetmek istediğin klasörü seç
6. ✅ **IPA dosyası oluşturuldu!**

**B) Ad Hoc (Sideload için):**
- **Ad Hoc** seçeneği ile de export edebilirsin
- Birden fazla cihaza yüklemek için uygun

### 5.3 IPA'yı Yükle

**Kendi cihazına:**
```bash
# Finder'da iPhone'u seç
# IPA dosyasını sürükle bırak
```

**Başkalarına:**
- TestFlight kullan (Apple Developer hesabı gerekli)
- Veya AltStore, Sideloadly gibi araçlar

## 🔄 Güncelleme ve Yeniden Build

Kodda değişiklik yaptıkça:

```bash
# 1. Web dosyalarını kopyala
npx cap sync ios

# 2. Xcode'u aç ve build et
npx cap open ios
```

## ⚡ Hızlı Komutlar Özeti

```bash
# İlk kurulum
npm install
npx cap add ios
npx cap sync ios

# Kod güncellemelerinde
npx cap sync ios
npx cap open ios

# Xcode'u doğrudan aç
npx cap open ios
```

## ⚠️ Yaygın Sorunlar ve Çözümler

### "Command Line Tools not found"
```bash
sudo xcode-select --reset
xcode-select --install
```

### "Signing for requires a development team"
- Xcode → Preferences → Accounts → Apple ID ekle
- Proje Settings → Signing → Team seç

### "Unable to install app on device"
- iPhone Settings → General → VPN & Device Management
- Developer App sertifikasına güven

### "Archive grayed out"
- Product → Destination → Any iOS Device seç
- Simulator değil, gerçek cihaz veya "Generic iOS Device" olmalı

## 🎯 Sonraki Adımlar

### TestFlight ile Beta Test
1. Apple Developer hesabı al ($99/yıl)
2. App Store Connect'e gir
3. Yeni app oluştur
4. Archive → Upload to App Store
5. TestFlight'a beta tester ekle

### App Store Yayını
1. TestFlight'ta test et
2. Screenshot'lar hazırla
3. App Store Connect'te app detaylarını doldur
4. İncelemeye gönder
5. Onay sonrası yayında! (genelde 1-3 gün)

## 💡 İpuçları

- **İlk build 5-10 dk sürebilir**, sabırlı ol
- **Simulator** gerçek performansı yansıtmaz, gerçek cihazda test et
- **Bundle ID** benzersiz olmalı ve değişmemeli
- **Version number** her güncelleme için artar (1.0.0 → 1.0.1)
- **Build number** her build'de artar (1 → 2 → 3)

## 🆘 Yardım

Sorun yaşarsan:
1. Hata mesajını kopyala
2. Google'da ara: "capacitor ios [hata mesajı]"
3. [Capacitor Docs](https://capacitorjs.com/docs/ios)
4. Bana sor! 😊

---

**Başarılar!** 🚀 Herhangi bir adımda takılırsan haber ver!
