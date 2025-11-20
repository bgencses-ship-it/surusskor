# 🏍️ SürüşSkor - Motosiklet Hava Durumu ve Rota Planlayıcı

Modern, yapay zeka destekli motosiklet hava durumu analiz ve rota planlama uygulaması.

## ✨ Özellikler

### 🔍 Akıllı Şehir Arama
- **Otomatik Tamamlama**: Yazmaya başladığınızda Türkiye'deki tüm il ve ilçeler önerilir
- **Sürüş Skoru**: 0-100 arası hava durumu uygunluk puanı
- **Detaylı Analiz**: Sıcaklık, rüzgar, yağış ve risk faktörleri
- **Konum Bulucu**: GPS ile otomatik konum tespiti

### 🗺️ Rota Planlama
- **İnteraktif Harita**: Leaflet tabanlı canlı harita görünümü
- **OSRM Routing**: Gerçek yol verileri ile rota hesaplama
- **Mesafe & Süre**: Detaylı seyahat bilgisi
- **Risk Analizi**: Rota boyunca en riskli nokta tespiti

### 🎨 Premium Tasarım
- Modern karanlık tema
- Glassmorphism efektleri
- Akıcı animasyonlar ve geçişler
- Responsive (mobil uyumlu) tasarım

## 🚀 Kullanım

### Yerel Olarak Çalıştırma
1. `index.html` dosyasına **çift tıklayın**
2. Tarayıcınızda otomatik açılacaktır
3. İnternet bağlantınız olduğu sürece tüm özellikler çalışır

### İnternette Yayınlama

#### Netlify (Önerilen - En Kolay)
1. [Netlify Drop](https://app.netlify.com/drop) adresine gidin
2. Proje klasörünü sürükleyip bırakın
3. Hazır! Size bir link verilecek

#### GitHub Pages
1. Dosyaları bir GitHub deposuna yükleyin
2. Repository Settings → Pages
3. Branch: `main` seçip kaydedin
4. Birkaç dakika içinde `https://kullaniciadi.github.io/repo-adi` adresinde yayında!

#### Vercel
```bash
npm i -g vercel
cd proje-klasörü
vercel --prod
```

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **UI Framework**: Tailwind CSS (CDN)
- **Harita**: Leaflet.js
- **İkonlar**: Material Symbols
- **Font**: Space Grotesk (Google Fonts)

### API'ler
- **Hava Durumu**: [Open-Meteo API](https://open-meteo.com/) (Ücretsiz, API key gerektirmez)
- **Geocoding**: Open-Meteo Geocoding API
- **Routing**: [OSRM](http://project-osrm.org/) (Ücretsiz, public instance)

### Tarayıcı Desteği
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Özellik Detayları

### Skor Hesaplama Algoritması
Uygulama aşağıdaki faktörleri değerlendirir:
- **Rüzgar Hızı**: >50 km/s (tehlikeli), 30-50 (şiddetli), 20-30 (rüzgarlı)
- **Sıcaklık**: <0°C (dondurucu), 0-10°C (soğuk), 10-18°C (serin), 18-24°C (ideal), >35°C (aşırı sıcak)
- **Yağış**: Herhangi bir yağış (ıslak zemin riski)

Her faktör puandan düşülür ve final skor gösterilir:
- **90-100**: Mükemmel Koşullar 🟢
- **70-89**: İyi Koşullar 🔵
- **40-69**: Dikkatli Olunmalı 🟡
- **0-39**: Sürüş Önerilmez 🔴

### Klavye Kısayolları
- **Enter**: Arama başlat
- **Escape**: Otomatik tamamlama listesini kapat

## 🔧 Geliştirme

Projeyi geliştirmek için:
```bash
# Basit bir local server başlatın
python -m http.server 8000
# veya
npx serve
```

Sonra `http://localhost:8000` adresine gidin.

## 📄 Lisans
Bu proje açık kaynaklıdır ve eğitim amaçlıdır.

## 🙏 Teşekkürler
- Open-Meteo ekibine ücretsiz hava durumu API'si için
- OSRM projesine routing servisi için
- Leaflet topluluğuna harika harita kütüphanesi için

---

**Not**: Bu uygulama sadece bilgilendirme amaçlıdır. Gerçek sürüş kararlarınızı verirken profesyonel hava tahminlerini ve kendi tecrübenizi kullanın. Güvenli sürüşler! 🏍️💨
