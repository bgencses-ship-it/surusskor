# Walkthrough - Dynamic Score & Wake Lock

## Changes
### 1. Dynamic Driving Score
- Replaced static score buckets with a dynamic formula in `script.js`.
- **Ideal Range**: 20°C - 26°C (Score 100).
- **Cold Penalty**: Linear deduction below 20°C.
- **Hot Penalty**: Linear deduction above 26°C.
- Updated `MEMORY-BANK.md` to reflect the new algorithm.

### 2. GPS Screen Wake Lock
- Integrated **Screen Wake Lock API** into the GPS Speedometer feature.
- The screen will now stay awake while the GPS tracking is active (`startGpsBtn` click).
- The lock is released when GPS is stopped (`stopGpsBtn` click).

## Verification Results

### Automated Tests
- **Syntax Check**: `script.js` updated successfully.

### Manual Verification Steps
1. **Dynamic Score**:
   - Search for cities with different temperatures (e.g., Erzurum for cold, Antalya for hot).
   - Observe that the score is not just 30, 60, or 100, but a specific number like 72, 45, etc.
   - Check the "Deductions" list to see the calculated point loss.

2. **Wake Lock**:
   - Open the app on a mobile device (or laptop with battery saver on).
   - Go to "GPS Hız" tab.
   - Click "Başlat".
   - Wait for the screen timeout duration (usually 30s - 1min).
   - **Expected**: The screen should remain on.
   - Click "Durdur".
   - **Expected**: The screen should eventually dim/turn off as per system settings.
