# 🧠 SürüşSkor Memory Bank

## 📊 Project Status
**Status**: Live / Maintenance
**Version**: 1.0.0 (PWA Enabled)
**Last Updated**: 2025-11-21

## 🎯 Core Objectives
- Provide motorcycle riders with accurate "Ride Suitability Score" based on weather.
- Plan routes with weather risk analysis.
- Calculate fuel costs for trips.
- **[NEW]** Provide a seamless mobile experience via PWA (Progressive Web App).

## 🏗️ Architecture

### Frontend
- **Framework**: Vanilla JS + HTML5
- **Styling**: Tailwind CSS (CDN)
- **Map Engine**: Leaflet.js + OpenStreetMap
- **Routing**: OSRM (Open Source Routing Machine)
- **Weather**: Open-Meteo API

### Mobile / PWA
- **Manifest**: `manifest.json` configured for standalone mode.
- **Service Worker**: `service-worker.js` for offline caching (Cache Strategy: Cache First).
- **iOS Support**: Custom "Add to Home Screen" prompt implemented in `script.js` & `index.html`.
- **Native Wrapper**: Capacitor (iOS/Android) installed but primary distribution is PWA.

### Deployment
- **Platform**: GitHub Pages
- **URL**: `https://bgencses-ship-it.github.io/surusskor/`
- **Branch**: `main`

## 🧩 Key Features Implementation

### 1. Weather Scoring Algorithm
- **Wind**: >50km/h (Critical), >30km/h (Warning).
- **Temp**: <0°C (Critical), <10°C (Warning), >35°C (Warning).
- **Rain**: Any rain reduces score significantly.

### 2. Route Planning
- Fetches route geometry from OSRM.
- Decodes polyline and displays on Leaflet map.
- Calculates distance and duration.

### 3. PWA & Offline Support
- **Service Worker**: Caches core assets (`index.html`, `style.css`, `script.js`, fonts, leaflet).
- **Update Strategy**: `registration.update()` called on load to ensure fresh content.
- **iOS Prompt**: Detects iOS browser user and shows a custom instruction banner to install the app.

## 📂 File Structure
```
/
├── index.html          # Main entry point (includes UI & PWA prompt)
├── script.js           # App logic (Weather, Map, PWA detection)
├── style.css           # Custom styles & Tailwind overrides
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline caching logic
├── README.md           # Project documentation
└── ios/                # Capacitor iOS project (Native)
```

## 🔄 Workflows

### Updating the App
1. Make changes to code.
2. Increment `CACHE_NAME` in `service-worker.js` (e.g., v3 -> v4).
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
4. Users will see the update after refreshing or reopening the app.

### Native Build (Optional)
To build for App Store / Play Store:
```bash
npx cap sync
npx cap open ios      # Xcode
npx cap open android  # Android Studio
```
