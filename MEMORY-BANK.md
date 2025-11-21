# 🧠 SürüşSkor Memory Bank

## 📊 Project Status
**Status**: Live / Maintenance
**Version**: 1.13.0 (Enhanced Animations)
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

### 1. UI / UX
- **Unified Score Design**: 
  - Home & Route tabs share the same score design (Number inside circle, message below).
- **Animations**: 
  - **Intro/Refresh**: Score ring fills to 100% then drops to actual score ("Overshoot" effect).
  - **Refresh Button**: Spins while loading.
  - **Rings**: Animated transitions for all gauges.
- **Localization**: Full Turkish interface.
- **Icons**: Modern Google/Apple Maps icons.
- **Dark Mode**: Fully supported.

### 2. Weather Scoring Algorithm (Python Logic)
- **Base Score (Temp)**: 
  - Ideal Range: **24°C - 38°C** (Score 100).
  - Penalty: 4 points per degree outside this range.
- **Wind Factor**: 
  - Threshold: 15 km/h.
  - Penalty: 2% per km/h above 15.
- **Rain Factor**: 
  - Penalty: 20% per mm.
- **Final Score**: Base Score * Wind Factor * Rain Factor.

### 2. Route Planning
- Fetches route geometry from OSRM.
- Decodes polyline and displays on Leaflet map.
- Calculates distance and duration.

### 3. PWA & Offline Support
- **Service Worker**: Caches core assets (`index.html`, `style.css`, `script.js`, fonts, leaflet).
- **Update Strategy**: `registration.update()` called on load to ensure fresh content.
- **iOS Prompt**: Detects iOS browser user and shows a custom instruction banner to install the app.

### 4. Dynamic Greeting
- **Time-based**: Changes greeting text based on time of day (Günaydın, Tünaydın, İyi Akşamlar, İyi Geceler).
- **Auto-update**: Checks every minute to ensure accuracy.

### 5. GPS Speedometer
- **Real-time Speed**: Uses Geolocation API to track speed.
- **Wake Lock**: Prevents screen from sleeping while GPS mode is active (using Screen Wake Lock API).

### 6. Developer Test Mode
- **Manual Override**: Allows manually setting temperature via slider (-10°C to 50°C).
- **Real-time Scoring**: Instantly recalculates driving score based on slider value without API calls.
- **Toggleable UI**: Hidden by default, activated via checkbox.

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
