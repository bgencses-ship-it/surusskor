# 🚀 GitHub Pages ile Yayınlama Rehberi

Uygulamanızı ücretsiz olarak internette yayınlamak için aşağıdaki adımları takip edin.

## 1. GitHub Deposu Oluşturma
1. [GitHub](https://github.com) hesabınıza giriş yapın.
2. Sağ üstteki **+** ikonuna tıklayıp **New repository** seçin.
3. **Repository name**: `surusskor` (veya istediğiniz bir isim).
4. **Public** seçeneğini işaretleyin.
5. **Create repository** butonuna tıklayın.

## 2. Projeyi Yükleme (Terminal ile)
Aşağıdaki komutları sırasıyla Terminal'de çalıştırın:

```bash
# 1. Git'i başlat
git init

# 2. Tüm dosyaları ekle
git add .

# 3. İlk versiyonu kaydet
git commit -m "İlk sürüm: PWA ve iOS hazırlıkları tamam"

# 4. Ana dal ismini ayarla
git branch -M main

# 5. Uzak sunucuyu ekle (KENDİ ADRESİNİZİ YAZIN!)
# GitHub'da oluşturduğunuz deponun adresini kopyalayın (https://github.com/KULLANICI/surusskor.git gibi)
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git

# 6. GitHub'a gönder
git push -u origin main
```

## 3. GitHub Pages'i Aktifleştirme
1. GitHub'daki proje sayfanıza gidin.
2. Üst menüden **Settings** sekmesine tıklayın.
3. Sol menüden **Pages** seçeneğine tıklayın.
4. **Build and deployment** altında:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` seçin ve `Save` deyin.

## 4. Sonuç 🎉
Birkaç dakika içinde sayfanın üst kısmında sitenizin linki belirecektir (örn: `https://kullanici.github.io/surusskor/`).

Bu linki arkadaşlarınıza gönderin!
- **iPhone'da**: Safari ile açıp "Ana Ekrana Ekle" diyerek yükleyebilirler.
- **Android'de**: Chrome ile açıp "Uygulamayı Yükle" diyebilirler.
