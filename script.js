// ===== BOTTOM NAVIGATION =====
document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabs = {
        'home': document.getElementById('home-tab'),
        'routes': document.getElementById('routes-tab'),
        'gps-speed': document.getElementById('gps-speed-tab'),
        'fuel-calc': document.getElementById('fuel-calc-tab')
    };

    // Tab switching
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;

            // Update nav buttons
            navBtns.forEach(b => {
                b.classList.remove('text-primary');
                b.classList.add('text-zinc-400', 'dark:text-zinc-500');
            });
            btn.classList.remove('text-zinc-400', 'dark:text-zinc-500');
            btn.classList.add('text-primary');

            // Update tab content
            Object.keys(tabs).forEach(key => {
                if (tabs[key]) {
                    if (key === tabName) {
                        tabs[key].classList.remove('hidden');
                    } else {
                        tabs[key].classList.add('hidden');
                    }
                }
            });

            // Handle map initialization for routes tab
            if (tabName === 'routes' && map) {
                setTimeout(() => map.invalidateSize(), 100);
            }
        });
    });

    // Auto-load weather on page load
    autoLoadWeather();
});

// ===== HOME TAB - WEATHER SEARCH =====
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const errorMsg = document.getElementById('error-msg');
const loading = document.getElementById('loading');
const scoreSection = document.getElementById('score-section');
const weatherSection = document.getElementById('weather-section');
const scoreNumber = document.getElementById('score-number');
const scoreRing = document.getElementById('score-ring');
const autocompleteDropdown = document.getElementById('city-autocomplete');

let autocompleteTimeout = null;

// Autocomplete
cityInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (autocompleteTimeout) clearTimeout(autocompleteTimeout);

    if (query.length < 2) {
        autocompleteDropdown.classList.add('hidden');
        return;
    }

    autocompleteDropdown.innerHTML = '<div class="p-3 text-center text-zinc-500">Aranıyor...</div>';
    autocompleteDropdown.classList.remove('hidden');

    autocompleteTimeout = setTimeout(async () => {
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=tr&format=json`;
            const res = await fetch(url);
            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                autocompleteDropdown.innerHTML = '<div class="p-3 text-center text-zinc-500">Sonuç bulunamadı</div>';
                return;
            }

            autocompleteDropdown.innerHTML = '';
            data.results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border-b border-zinc-200 dark:border-zinc-800 last:border-0';
                item.innerHTML = `
                    <div class="font-medium text-zinc-800 dark:text-white">${result.name}</div>
                    <div class="text-xs text-zinc-500">${[result.admin1, result.country].filter(Boolean).join(', ')}</div>
                `;
                item.addEventListener('click', () => {
                    cityInput.value = result.name;
                    autocompleteDropdown.classList.add('hidden');
                });
                autocompleteDropdown.appendChild(item);
            });
        } catch (error) {
            autocompleteDropdown.innerHTML = '<div class="p-3 text-center text-red-500">Hata oluştu</div>';
        }
    }, 300);
});

// Close autocomplete on click outside
document.addEventListener('click', (e) => {
    if (!cityInput?.contains(e.target) && !autocompleteDropdown?.contains(e.target)) {
        autocompleteDropdown?.classList.add('hidden');
    }
});

searchBtn?.addEventListener('click', handleSearch);
locationBtn?.addEventListener('click', handleLocation);
cityInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Refresh button
const refreshBtn = document.getElementById('refresh-btn');
refreshBtn?.addEventListener('click', () => {
    autoLoadWeather();
});


async function handleSearch() {
    const query = cityInput.value.trim();
    if (!query) return;

    showLoading(true);
    hideError();
    weatherSection.classList.add('hidden');

    try {
        const location = await fetchLocation(query);
        if (!location) throw new Error('Şehir bulunamadı');

        const weather = await fetchWeather(location.latitude, location.longitude);
        const analysis = analyzeWeather(weather);

        updateHomeUI(analysis, weather);
        weatherSection.classList.remove('hidden');
    } catch (err) {
        showError(err.message);
    } finally {
        showLoading(false);
    }
}

function handleLocation() {
    if (!navigator.geolocation) {
        showError("Tarayıcınız konum özelliğini desteklemiyor.");
        return;
    }

    showLoading(true);
    hideError();
    weatherSection.classList.add('hidden');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const cityName = await fetchCityName(lat, lon);
                if (cityName) cityInput.value = cityName;

                const weather = await fetchWeather(lat, lon);
                const analysis = analyzeWeather(weather);

                updateHomeUI(analysis, weather);
                weatherSection.classList.remove('hidden');
            } catch (err) {
                showError(err.message);
            } finally {
                showLoading(false);
            }
        },
        (err) => {
            showLoading(false);
            showError("Konum alınamadı. Lütfen konum izni verin.");
        }
    );
}

// Auto-load weather on page load
function autoLoadWeather() {
    if (!navigator.geolocation) {
        showError("Tarayıcınız konum özelliğini desteklemiyor.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const weather = await fetchWeather(lat, lon);
                const analysis = analyzeWeather(weather);

                updateHomeUI(analysis, weather);
                weatherSection.classList.remove('hidden');
                showLoading(false);
            } catch (err) {
                showError("Hava durumu yüklenemedi: " + err.message);
                showLoading(false);
            }
        },
        (err) => {
            showLoading(false);
            showError("Konum alınamadı. Lütfen konum izni verin.");
        }
    );
}

async function fetchLocation(query) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=tr&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results?.[0] || null;
}

async function fetchCityName(lat, lon) {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=tr&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        const result = data.results?.[0];
        return result?.admin2 || result?.admin1 || result?.name || null;
    } catch (e) {
        return null;
    }
}

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,rain,showers,weather_code,wind_speed_10m,wind_gusts_10m&wind_speed_unit=kmh`;
    const res = await fetch(url);
    return await res.json();
}

function analyzeWeather(data) {
    const current = data.current;
    let score = 100;
    let deductions = [];

    const windSpeed = current.wind_speed_10m;
    if (windSpeed > 50) {
        score -= 100;
        deductions.push("Tehlikeli Rüzgar");
    } else if (windSpeed > 30) {
        score -= 40;
        deductions.push("Şiddetli Rüzgar");
    } else if (windSpeed > 20) {
        score -= 15;
        deductions.push("Rüzgarlı");
    }

    const temp = current.temperature_2m;
    if (temp < 0) {
        score -= 100;
        deductions.push("Dondurucu Soğuk");
    } else if (temp < 10) {
        score -= 70;
        deductions.push("Çok Soğuk");
    } else if (temp < 18) {
        score -= 40;
        deductions.push("Serin");
    } else if (temp > 35) {
        score -= 50;
        deductions.push("Aşırı Sıcak");
    }

    const precip = current.precipitation;
    if (precip > 0) {
        score -= 50;
        deductions.push("Yağmur/Islak Zemin");
    }

    score = Math.max(0, Math.min(100, Math.round(score)));

    return { score, deductions, temp, windSpeed, precip };
}

function updateHomeUI(analysis, rawData) {
    const { score } = analysis;
    const current = rawData.current;

    // Update score
    scoreNumber.textContent = score;
    const offset = 100 - score;
    scoreRing.setAttribute('stroke-dashoffset', offset);

    // Update color based on score
    if (score >= 85) {
        scoreRing.classList.remove('text-yellow-500', 'text-red-500');
        scoreRing.classList.add('text-green-500');
    } else if (score >= 60) {
        scoreRing.classList.remove('text-green-500', 'text-red-500');
        scoreRing.classList.add('text-yellow-500');
    } else {
        scoreRing.classList.remove('text-green-500', 'text-yellow-500');
        scoreRing.classList.add('text-red-500');
    }

    // Update weather cards
    document.getElementById('temp-value').textContent = `${current.temperature_2m}°C`;
    document.getElementById('wind-value').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('rain-value').textContent = `${current.precipitation} mm`;
    document.getElementById('feel-value').textContent = `${current.apparent_temperature}°C`;
}

function showLoading(show) {
    if (show) {
        loading?.classList.remove('hidden');
    } else {
        loading?.classList.add('hidden');
    }
}

function showError(msg) {
    if (errorMsg) {
        errorMsg.querySelector('p').textContent = msg;
        errorMsg.classList.remove('hidden');
    }
}

function hideError() {
    errorMsg?.classList.add('hidden');
}

// ===== ROUTES TAB =====
const startInput = document.getElementById('start-input');
const endInput = document.getElementById('end-input');
const routeBtn = document.getElementById('route-btn');
const btnOpenGoogle = document.getElementById('btn-open-google');
const btnOpenApple = document.getElementById('btn-open-apple');
const routeResults = document.getElementById('route-results');
const routeScoreNumber = document.getElementById('route-score-number');
const routeScoreRing = document.getElementById('route-score-ring');

let routeStartLocation = null;
let routeEndLocation = null;

routeBtn?.addEventListener('click', handleRoute);

async function handleRoute() {
    const start = startInput.value.trim();
    const end = endInput.value.trim();

    if (!start || !end) {
        alert("Lütfen başlangıç ve varış noktalarını girin");
        return;
    }

    routeResults.classList.add('hidden');

    try {
        // For "Mevcut Konum", use geolocation
        if (start === "Mevcut Konum") {
            if (!navigator.geolocation) {
                alert("Konum desteklenmiyor");
                return;
            }

            navigator.geolocation.getCurrentPosition(async (position) => {
                routeStartLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    name: "Mevcut Konum"
                };

                const endLoc = await fetchLocation(end);
                if (!endLoc) {
                    alert("Varış konumu bulunamadı");
                    return;
                }

                routeEndLocation = {
                    lat: endLoc.latitude,
                    lon: endLoc.longitude,
                    name: end
                };

                // Fetch weather at destination
                const weather = await fetchWeather(endLoc.latitude, endLoc.longitude);
                const analysis = analyzeWeather(weather);

                // Update UI
                updateRouteUI(analysis, weather);
                routeResults.classList.remove('hidden');
            }, () => {
                alert("Konum alınamadı");
            });
        } else {
            const startLoc = await fetchLocation(start);
            const endLoc = await fetchLocation(end);

            if (!startLoc || !endLoc) {
                alert("Konumlar bulunamadı");
                return;
            }

            routeStartLocation = {
                lat: startLoc.latitude,
                lon: startLoc.longitude,
                name: start
            };

            routeEndLocation = {
                lat: endLoc.latitude,
                lon: endLoc.longitude,
                name: end
            };

            // Fetch weather at destination
            const weather = await fetchWeather(endLoc.latitude, endLoc.longitude);
            const analysis = analyzeWeather(weather);

            // Update UI
            updateRouteUI(analysis, weather);
            routeResults.classList.remove('hidden');
        }
    } catch (err) {
        alert(err.message);
    }
}

function updateRouteUI(analysis, rawData) {
    const { score } = analysis;
    const current = rawData.current;

    // Update score
    routeScoreNumber.textContent = score;
    const offset = 100 - score;
    routeScoreRing.setAttribute('stroke-dashoffset', offset);

    // Update color based on score
    if (score >= 85) {
        routeScoreRing.classList.remove('text-yellow-500', 'text-red-500');
        routeScoreRing.classList.add('text-green-500');
    } else if (score >= 60) {
        routeScoreRing.classList.remove('text-green-500', 'text-red-500');
        routeScoreRing.classList.add('text-yellow-500');
    } else {
        routeScoreRing.classList.remove('text-green-500', 'text-yellow-500');
        routeScoreRing.classList.add('text-red-500');
    }

    // Update weather cards
    document.getElementById('route-temp-value').textContent = `${current.temperature_2m}°C`;
    document.getElementById('route-wind-value').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('route-rain-value').textContent = `${current.precipitation} mm`;
    document.getElementById('route-feel-value').textContent = `${current.apparent_temperature}°C`;
}

// External Map Handlers
btnOpenGoogle?.addEventListener('click', () => {
    if (!routeStartLocation || !routeEndLocation) {
        alert("Önce rota hesaplayın");
        return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${routeStartLocation.lat},${routeStartLocation.lon}&destination=${routeEndLocation.lat},${routeEndLocation.lon}&travelmode=driving`;
    window.open(url, '_blank');
});

btnOpenApple?.addEventListener('click', () => {
    if (!routeStartLocation || !routeEndLocation) {
        alert("Önce rota hesaplayın");
        return;
    }

    const url = `http://maps.apple.com/?saddr=${routeStartLocation.lat},${routeStartLocation.lon}&daddr=${routeEndLocation.lat},${routeEndLocation.lon}&dirflg=d`;
    window.open(url, '_blank');
});

// ===== GPS SPEED TAB =====
const currentSpeedEl = document.getElementById('current-speed');
const maxSpeedEl = document.getElementById('max-speed');
const gpsStatusIndicator = document.getElementById('gps-status-indicator');
const gpsStatusText = document.getElementById('gps-status-text');
const startGpsBtn = document.getElementById('start-gps-btn');
const stopGpsBtn = document.getElementById('stop-gps-btn');
const speedArc = document.getElementById('speed-arc');

let watchId = null;
let maxSpeed = 0;
const MAX_DISPLAY_SPEED = 200; // Maximum speed to display on gauge (km/h)

startGpsBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('GPS desteklenmiyor');
        return;
    }

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const speed = position.coords.speed;
            const speedKmh = speed !== null ? Math.round((speed * 3.6) * 10) / 10 : 0;

            currentSpeedEl.textContent = Math.round(speedKmh);

            // Update speedometer arc
            const percentage = Math.min((speedKmh / MAX_DISPLAY_SPEED) * 100, 100);
            speedArc.setAttribute('stroke-dasharray', `${percentage} 100`);

            if (speedKmh > maxSpeed) {
                maxSpeed = speedKmh;
                maxSpeedEl.textContent = Math.round(maxSpeed);
            }

            gpsStatusIndicator.className = 'w-2 h-2 rounded-full bg-green-500';
            gpsStatusText.textContent = 'GPS aktif';
        },
        (error) => {
            gpsStatusIndicator.className = 'w-2 h-2 rounded-full bg-red-500';
            gpsStatusText.textContent = 'GPS hatası: ' + error.message;
        },
        { enableHighAccuracy: true, maximumAge: 0 }
    );

    startGpsBtn.classList.add('hidden');
    stopGpsBtn.classList.remove('hidden');
});

stopGpsBtn?.addEventListener('click', () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    gpsStatusIndicator.className = 'w-2 h-2 rounded-full bg-gray-500';
    gpsStatusText.textContent = 'GPS durduruldu';

    startGpsBtn.classList.remove('hidden');
    stopGpsBtn.classList.add('hidden');
});

// ===== FUEL CALC TAB =====
const fuelCostInput = document.getElementById('fuel-cost');
const fuelDistanceInput = document.getElementById('fuel-distance');
const fuelResult = document.getElementById('fuel-result');
const fuelArc = document.getElementById('fuel-arc');

function calculateFuel() {
    const cost = parseFloat(fuelCostInput?.value) || 0;
    const distance = parseFloat(fuelDistanceInput?.value) || 0;

    if (distance > 0 && cost > 0) {
        const costPerKm = cost / distance;
        fuelResult.textContent = `${costPerKm.toFixed(2)}₺`;

        // Update arc based on cost (0-10 TL/km scale)
        const maxCost = 10;
        const percentage = Math.min((costPerKm / maxCost) * 100, 100);
        const offset = 282.74 - (282.74 * percentage / 100);
        fuelArc?.setAttribute('stroke-dashoffset', offset);
    } else {
        fuelResult.textContent = '0.00₺';
        fuelArc?.setAttribute('stroke-dashoffset', '282.74');
    }
}

fuelCostInput?.addEventListener('input', calculateFuel);
fuelDistanceInput?.addEventListener('input', calculateFuel);

// Initial calculation
calculateFuel();

// PWA Install Prompt Logic
// Run immediately since script is at end of body
(function () {
    // DEBUG BUTTON LOGIC
    document.getElementById('debug-btn')?.addEventListener('click', () => {
        const prompt = document.getElementById('ios-install-prompt');
        alert('Debug Clicked!\nPrompt Element: ' + (prompt ? 'FOUND' : 'MISSING'));
        if (prompt) {
            prompt.classList.remove('hidden');
            prompt.style.display = 'block';
            prompt.classList.remove('translate-y-full', 'opacity-0');
            prompt.style.transform = 'translateY(0)';
            prompt.style.opacity = '1';
        }
    });

    // DEBUG: Alert to prove script is running
    // alert('Script loaded! Checking install prompt...'); 

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const promptShown = localStorage.getItem('iosInstallPromptShown');

    // DEBUG: Force show for testing (remove 'true ||' and '!promptShown' check later)
    // Original: if (isIOS && !isStandalone && !promptShown)
    if (true || (isIOS && !isStandalone && !promptShown)) {
        const prompt = document.getElementById('ios-install-prompt');
        const closeBtn = document.getElementById('close-install-prompt');

        if (prompt && closeBtn) {
            console.log('Showing install prompt...'); // Debug log
            // Show prompt after 2 seconds
            setTimeout(() => {
                // Force remove hidden and set display block
                prompt.classList.remove('hidden');
                prompt.style.display = 'block'; // Fallback

                // Small delay for animation
                setTimeout(() => {
                    prompt.classList.remove('translate-y-full', 'opacity-0');
                    prompt.style.transform = 'translateY(0)'; // Fallback
                    prompt.style.opacity = '1'; // Fallback
                }, 100);
            }, 2000);

            // Close handler
            closeBtn.addEventListener('click', () => {
                prompt.classList.add('translate-y-full', 'opacity-0');
                setTimeout(() => {
                    prompt.classList.add('hidden');
                }, 300);
                localStorage.setItem('iosInstallPromptShown', 'true');
            });
        }
    }
})();
