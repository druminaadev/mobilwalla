# 📱 Project Overview — SalonBooking Customer App

> **App Name:** SalonBooking (Hair Ahmedabad Customer App)  
> **Platform:** iOS + Android (React Native + Expo)  
> **Version:** 1.0.0  
> **Total Screens:** 43

---

## What This App Does

A full-featured customer-facing mobile app for **Hair Ahmedabad** — a premium unisex salon. Customers can:

- Browse and discover the salon
- Book appointments through a 4-step wizard
- Shop salon products
- Manage their bookings (reschedule, cancel, review)
- Top up and use an in-app wallet
- Track orders in real time
- Manage their profile and addresses

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.81.5 |
| Runtime | Expo | ~54.0.0 |
| Language | TypeScript | ^5.3.3 |
| Navigation | React Navigation v6 | ^6.x |
| State | Zustand | ^4.5.0 |
| HTTP | Axios | ^1.6.7 |
| Icons | Lucide React Native | ^1.17.0 |
| Gradients | Expo Linear Gradient | ^56.0.4 |
| Storage | AsyncStorage | 2.2.0 |
| Safe Area | react-native-safe-area-context | latest |

---

## Running Locally

```bash
cd customer-mobile
npm install
cp .env.example .env
npm start          # Expo dev server
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run clear      # Clear Metro cache and restart
```

**Demo credentials:**  
Phone: any number · OTP: `123456`

---

## Project Entry Points

| File | Purpose |
|------|---------|
| `index.js` | App entry point — registers root component |
| `App.tsx` | Root component — wraps NavigationContainer + SafeAreaProvider |
| `src/navigation/index.tsx` | Root navigator — switches Auth ↔ Main based on auth state |
| `src/store/authStore.ts` | Auth state — `checkAuth()` hydrates from AsyncStorage on start |

---

## Demo Mode

All screens run on demo data from `src/data/demo.ts`. No backend required.  
To connect a real backend, set `API_URL` in `.env` and replace demo data calls with Axios.
