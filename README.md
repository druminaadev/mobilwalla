# 💇‍♀️ SalonBooking — Customer Mobile App

> Premium salon booking experience for **Hair Ahmedabad**  
> Built with **React Native + Expo**, TypeScript, Zustand, and React Navigation.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Running the App](#-running-the-app)
- [Demo Credentials](#-demo-credentials)
- [Navigation Architecture](#-navigation-architecture)
- [Screens Reference](#-screens-reference)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [API Integration](#-api-integration)
- [Build & Deployment](#-build--deployment)
- [Troubleshooting](#-troubleshooting)
- [Scripts Reference](#-scripts-reference)

---

## 🌟 Overview

SalonBooking is a full-featured **customer-facing mobile app** for discovering and booking salon services. Customers can browse nearby salons, pick services, choose a staff member, select a date/time slot, pay online, and manage all their bookings — all from one place.

The app uses **demo data** out of the box so you can run and test it without a backend connection. Swap `src/data/demo.ts` for real API calls when the backend is ready.

---

## ✨ Features

| Area | What's Included |
|------|----------------|
| 🔐 Auth | Phone + OTP login, luxury splash & login screens, biometric-ready |
| 🏠 Home | Salon discovery feed, search, nearby salons, quick filters |
| 💆 Services | Full services catalogue, 7 category filters, search, featured banner, inline Book button |
| 📅 Booking Flow | 4-step wizard — Services → Staff → Date/Time → Summary → Payment |
| 📋 Appointments | Upcoming / Completed / Cancelled tabs, manage, reschedule, review |
| 💳 Wallet | Balance, add money, transaction history, referral program |
| 👤 Profile | Edit profile, addresses, settings, notifications, help |
| 🔔 Notifications | In-app notification centre with unread badge |
| 🎨 UI/UX | Salon-pink accent (#FF5C8A), spring animations, micro-interactions, glassmorphism-style cards |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.81.5 |
| Runtime | Expo | ~54.0.0 |
| Language | TypeScript | ^5.3.3 |
| Navigation | React Navigation (Native Stack + Bottom Tabs) | ^6.x |
| State | Zustand | ^4.5.0 |
| HTTP | Axios | ^1.6.7 |
| Icons | Lucide React Native | ^1.17.0 |
| Gradients | Expo Linear Gradient | ^56.0.4 |
| Storage | AsyncStorage | 2.2.0 |
| Vector Graphics | React Native SVG | 15.12.1 |
| Linting | ESLint + Prettier | ^9.x / ^3.x |

---

## 📁 Project Structure

```
customer-mobile/
├── assets/                      # Static assets
│   ├── images/
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   ├── salon1.jpg
│   ├── salon2.jpg
│   └── salon3.jpg
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── auth/
│   │   │   ├── GlassContainer.tsx   # Glassmorphism card wrapper
│   │   │   ├── LuxuryButton.tsx     # Animated premium button
│   │   │   ├── LuxuryInput.tsx      # Styled text input
│   │   │   └── index.ts
│   │   ├── booking/
│   │   │   └── BookingCard.tsx      # Booking list card
│   │   ├── common/
│   │   │   ├── Button.tsx           # Generic button
│   │   │   ├── Card.tsx             # Generic pressable card
│   │   │   └── Input.tsx            # Generic input
│   │   ├── layout/
│   │   │   └── ScreenHeader.tsx     # Shared screen header
│   │   ├── profile/
│   │   │   ├── MenuButton.tsx       # Profile menu row
│   │   │   ├── ProfileCard.tsx      # User info card
│   │   │   ├── StatsCard.tsx        # Booking stats card
│   │   │   └── index.ts
│   │   └── salon/
│   │       └── SalonCard.tsx        # Salon discovery card
│   │
│   ├── constants/
│   │   ├── colors.ts            # Full color palette
│   │   ├── config.ts            # App-wide config constants
│   │   ├── spacing.ts           # Spacing scale
│   │   └── typography.ts        # Font sizes & weights
│   │
│   ├── data/
│   │   └── demo.ts              # All demo data (salons, services, staff, bookings…)
│   │
│   ├── hooks/
│   │   └── useBooking.ts        # Booking utility hook
│   │
│   ├── navigation/
│   │   ├── index.tsx            # Root navigator (Auth / Main split)
│   │   ├── AuthStack.tsx        # Splash → Login → OTP
│   │   ├── MainStack.tsx        # Bottom tab navigator (5 tabs)
│   │   ├── HomeStack.tsx        # Home + full booking flow
│   │   ├── ServicesStack.tsx    # Services catalogue + booking entry
│   │   ├── BookingsStack.tsx    # Booking list + detail + reschedule + review
│   │   ├── WalletStack.tsx      # Wallet home + add money + history
│   │   ├── ProfileStack.tsx     # Profile + settings + addresses
│   │   └── linking.ts           # Deep linking config
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── OTPScreen.tsx
│   │   ├── booking/             # 4-step booking wizard
│   │   │   ├── ServiceSelectionScreen.tsx
│   │   │   ├── StaffSelectionScreen.tsx
│   │   │   ├── SlotSelectionScreen.tsx
│   │   │   ├── BookingSummaryScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   └── BookingSuccessScreen.tsx
│   │   ├── bookings/            # Appointments management
│   │   │   ├── BookingListScreen.tsx
│   │   │   ├── BookingDetailScreen.tsx
│   │   │   ├── RescheduleScreen.tsx
│   │   │   └── WriteReviewScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── SalonListScreen.tsx
│   │   │   └── SalonDetailScreen.tsx
│   │   ├── services/# 💇‍♀️ SalonBooking — Customer Mobile App

> Premium salon booking experience for **Hair Ahmedabad**  
> Built with **React Native + Expo**, TypeScript, Zustand, and React Navigation.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [Running the App](#-running-the-app)
- [Demo Credentials](#-demo-credentials)
- [Navigation Architecture](#-navigation-architecture)
- [Screens Reference](#-screens-reference)
- [State Management](#-state-management)
- [Design System](#-design-system)
- [API Integration](#-api-integration)
- [Build & Deployment](#-build--deployment)
- [Troubleshooting](#-troubleshooting)
- [Scripts Reference](#-scripts-reference)

---

## 🌟 Overview

SalonBooking is a full-featured **customer-facing mobile app** for discovering and booking salon services. Customers can browse nearby salons, pick services, choose a staff member, select a date/time slot, pay online, and manage all their bookings — all from one place.

The app uses **demo data** out of the box so you can run and test it without a backend connection. Swap `src/data/demo.ts` for real API calls when the backend is ready.

---

## ✨ Features

| Area | What's Included |
|------|----------------|
| 🔐 Auth | Phone + OTP login, luxury splash & login screens, biometric-ready |
| 🏠 Home | Salon discovery feed, search, nearby salons, quick filters |
| 💆 Services | Full services catalogue, 7 category filters, search, featured banner, inline Book button |
| 📅 Booking Flow | 4-step wizard — Services → Staff → Date/Time → Summary → Payment |
| 📋 Appointments | Upcoming / Completed / Cancelled tabs, manage, reschedule, review |
| 💳 Wallet | Balance, add money, transaction history, referral program |
| 👤 Profile | Edit profile, addresses, settings, notifications, help |
| 🔔 Notifications | In-app notification centre with unread badge |
| 🎨 UI/UX | Salon-pink accent (#FF5C8A), spring animations, micro-interactions, glassmorphism-style cards |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.81.5 |
| Runtime | Expo | ~54.0.0 |
| Language | TypeScript | ^5.3.3 |
| Navigation | React Navigation (Native Stack + Bottom Tabs) | ^6.x |
| State | Zustand | ^4.5.0 |
| HTTP | Axios | ^1.6.7 |
| Icons | Lucide React Native | ^1.17.0 |
| Gradients | Expo Linear Gradient | ^56.0.4 |
| Storage | AsyncStorage | 2.2.0 |
| Vector Graphics | React Native SVG | 15.12.1 |
| Linting | ESLint + Prettier | ^9.x / ^3.x |

---

## 📁 Project Structure

```
customer-mobile/
├── assets/                      # Static assets
│   ├── images/
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   ├── salon1.jpg
│   ├── salon2.jpg
│   └── salon3.jpg
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── auth/
│   │   │   ├── GlassContainer.tsx   # Glassmorphism card wrapper
│   │   │   ├── LuxuryButton.tsx     # Animated premium button
│   │   │   ├── LuxuryInput.tsx      # Styled text input
│   │   │   └── index.ts
│   │   ├── booking/
│   │   │   └── BookingCard.tsx      # Booking list card
│   │   ├── common/
│   │   │   ├── Button.tsx           # Generic button
│   │   │   ├── Card.tsx             # Generic pressable card
│   │   │   └── Input.tsx            # Generic input
│   │   ├── layout/
│   │   │   └── ScreenHeader.tsx     # Shared screen header
│   │   ├── profile/
│   │   │   ├── MenuButton.tsx       # Profile menu row
│   │   │   ├── ProfileCard.tsx      # User info card
│   │   │   ├── StatsCard.tsx        # Booking stats card
│   │   │   └── index.ts
│   │   └── salon/
│   │       └── SalonCard.tsx        # Salon discovery card
│   │
│   ├── constants/
│   │   ├── colors.ts            # Full color palette
│   │   ├── config.ts            # App-wide config constants
│   │   ├── spacing.ts           # Spacing scale
│   │   └── typography.ts        # Font sizes & weights
│   │
│   ├── data/
│   │   └── demo.ts              # All demo data (salons, services, staff, bookings…)
│   │
│   ├── hooks/
│   │   └── useBooking.ts        # Booking utility hook
│   │
│   ├── navigation/
│   │   ├── index.tsx            # Root navigator (Auth / Main split)
│   │   ├── AuthStack.tsx        # Splash → Login → OTP
│   │   ├── MainStack.tsx        # Bottom tab navigator (5 tabs)
│   │   ├── HomeStack.tsx        # Home + full booking flow
│   │   ├── ServicesStack.tsx    # Services catalogue + booking entry
│   │   ├── BookingsStack.tsx    # Booking list + detail + reschedule + review
│   │   ├── WalletStack.tsx      # Wallet home + add money + history
│   │   ├── ProfileStack.tsx     # Profile + settings + addresses
│   │   └── linking.ts           # Deep linking config
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── OTPScreen.tsx
│   │   ├── booking/             # 4-step booking wizard
│   │   │   ├── ServiceSelectionScreen.tsx
│   │   │   ├── StaffSelectionScreen.tsx
│   │   │   ├── SlotSelectionScreen.tsx
│   │   │   ├── BookingSummaryScreen.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   └── BookingSuccessScreen.tsx
│   │   ├── bookings/            # Appointments management
│   │   │   ├── BookingListScreen.tsx
│   │   │   ├── BookingDetailScreen.tsx
│   │   │   ├── RescheduleScreen.tsx
│   │   │   └── WriteReviewScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── SalonListScreen.tsx
│   │   │   └── SalonDetailScreen.tsx
│   │   ├── services/
│   │   │   └── ServicesScreen.tsx   # Services catalogue (tab 2)
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── AddressesScreen.tsx
│   │   │   ├── AddAddressScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   └── HelpScreen.tsx
│   │   └── wallet/
│   │       ├── WalletHomeScreen.tsx
│   │       ├── AddMoneyScreen.tsx
│   │       ├── TransactionHistoryScreen.tsx
│   │       └── ReferralScreen.tsx
│   │
│   ├── services/
│   │   └── storage/
│   │       └── index.ts         # AsyncStorage wrapper
│   │
│   ├── store/
│   │   ├── authStore.ts         # Auth state (user, login, logout)
│   │   ├── bookingStore.ts      # Active booking state (services, staff, slot)
│   │   └── notificationStore.ts # Notifications + unread count
│   │
│   ├── theme/
│   │   └── tokens.ts            # Design tokens (gold luxury theme)
│   │
│   ├── types/
│   │   ├── api.ts               # API request/response types
│   │   ├── models.ts            # Domain models (Salon, Booking, User…)
│   │   └── navigation.ts        # All navigation param lists
│   │
│   └── utils/
│       └── device.ts            # Device info utilities
│
├── .env.example                 # Environment variable template
├── .eslintrc.js                 # ESLint config
├── app.json                     # Expo app config
├── babel.config.js              # Babel config with module-resolver
├── index.js                     # App entry point
├── App.tsx                      # Root component
├── package.json
├── tsconfig.json
└── RUN.sh                       # Quick-start helper script
```

---

## ✅ Prerequisites

Make sure the following are installed before running the app:

```bash
# Node.js 18+
node --version   # v18.x.x or higher

# npm 9+
npm --version    # 9.x.x or higher

# Expo CLI
npm install -g expo-cli

# For iOS (macOS only)
# Xcode 14+ from the Mac App Store

# For Android
# Android Studio + Android SDK + emulator configured
```

---

## ⚡ Quick Start

```bash
# 1. Navigate to the app directory
cd "Mobile-App/customer-mobile"

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start the development server
npm start
```

Then in the Expo CLI menu:
- Press `i` — open iOS Simulator
- Press `a` — open Android Emulator
- Scan the QR code with **Expo Go** app on a physical device

---

## 🔧 Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```env
# Backend API
API_URL=http://localhost:5000/api/v1
API_TIMEOUT=30000

# Razorpay (payment gateway)
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx

# Google Maps (salon location)
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase (push notifications)
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:android:xxxxxxxxxxxxx

# Environment
NODE_ENV=development
```

> **Note:** The app runs fully in demo mode without any real API keys. All screens are populated from `src/data/demo.ts`.

---

## 🚀 Running the App

```bash
# Development (Expo Go)
npm start

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web

# Clear Metro cache and restart
npm run clear
```

---

## 🔑 Demo Credentials

The app ships with a built-in demo mode — no backend required.

| Field | Value |
|-------|-------|
| Phone | Any number (e.g. `9876543210`) |
| OTP | `123456` |
| Demo User | Priya Sharma |

> Any phone number works. The OTP is always `123456`.

---

## 🗺 Navigation Architecture

```
RootNavigator
├── AuthStack                    (unauthenticated)
│   ├── SplashScreen
│   ├── LoginScreen
│   └── OTPScreen
│
└── MainStack — Bottom Tabs      (authenticated)
    ├── HomeTab → HomeStack
    │   ├── HomeScreen
    │   ├── SearchScreen
    │   ├── SalonListScreen
    │   ├── SalonDetailScreen
    │   └── Booking Wizard ──────────────────────────────────┐
    │       ├── ServiceSelectionScreen (step 1)               │
    │       ├── StaffSelectionScreen   (step 2)               │
    │       ├── SlotSelectionScreen    (step 3)               │
    │       ├── BookingSummaryScreen   (step 4)               │
    │       ├── PaymentScreen                                  │
    │       └── BookingSuccessScreen                          │
    │                                                          │
    ├── ServicesTab → ServicesStack                           │
    │   ├── ServicesScreen (catalogue)                        │
    │   └── ServiceBooking → ServiceSelectionScreen ──────────┘
    │
    ├── BookingsTab → BookingsStack
    │   ├── BookingListScreen
    │   ├── BookingDetailScreen
    │   ├── RescheduleScreen
    │   └── WriteReviewScreen
    │
    ├── WalletTab → WalletStack
    │   ├── WalletHomeScreen
    │   ├── AddMoneyScreen
    │   ├── TransactionHistoryScreen
    │   └── ReferralScreen
    │
    └── ProfileTab → ProfileStack
        ├── ProfileScreen
        ├── EditProfileScreen
        ├── AddressesScreen
        ├── AddAddressScreen
        ├── SettingsScreen
        ├── NotificationsScreen
        └── HelpScreen
```

### Bottom Tab Bar

5 tabs with salon-pink (`#FF5C8A`) active tint:

| Tab | Icon | Screen |
|-----|------|--------|
| Home | `Home` | Salon discovery feed |
| Services | `LayoutGrid` | Services catalogue |
| Bookings | `Calendar` | Appointments list |
| Wallet | `Wallet` | Wallet & payments |
| Profile | `User` | User profile + settings |

---

## 📱 Screens Reference

### Auth Flow
| Screen | File | Description |
|--------|------|-------------|
| Splash | `auth/SplashScreen.tsx` | Animated luxury splash with logo |
| Login | `auth/LoginScreen.tsx` | Phone number entry, glassmorphism design |
| OTP | `auth/OTPScreen.tsx` | 6-digit OTP verification |

### Home Flow
| Screen | File | Description |
|--------|------|-------------|
| Home | `home/HomeScreen.tsx` | Greeting, featured salons, quick actions |
| Search | `home/SearchScreen.tsx` | Full-text search across salons/services |
| Salon List | `home/SalonListScreen.tsx` | Filtered salon listing |
| Salon Detail | `home/SalonDetailScreen.tsx` | Salon info, services, reviews, gallery |

### Services Flow
| Screen | File | Description |
|--------|------|-------------|
| Services Catalogue | `services/ServicesScreen.tsx` | All services with category filter, search, featured banner, `+ Book New Service` FAB |
| Service Booking | `booking/ServiceSelectionScreen.tsx` | Step 1 of booking wizard |

### Booking Wizard
| Screen | File | Step |
|--------|------|------|
| Service Selection | `booking/ServiceSelectionScreen.tsx` | 1 — Pick services |
| Staff Selection | `booking/StaffSelectionScreen.tsx` | 2 — Pick staff |
| Slot Selection | `booking/SlotSelectionScreen.tsx` | 3 — Pick date & time |
| Booking Summary | `booking/BookingSummaryScreen.tsx` | 4 — Review & confirm |
| Payment | `booking/PaymentScreen.tsx` | Pay via Razorpay / Wallet |
| Booking Success | `booking/BookingSuccessScreen.tsx` | Confirmation screen |

### Appointments Flow
| Screen | File | Description |
|--------|------|-------------|
| Booking List | `bookings/BookingListScreen.tsx` | Upcoming / Completed / Cancelled tabs, `+ Book New Service` FAB |
| Booking Detail | `bookings/BookingDetailScreen.tsx` | Full booking details, cancel, reschedule |
| Reschedule | `bookings/RescheduleScreen.tsx` | Pick new date/time |
| Write Review | `bookings/WriteReviewScreen.tsx` | Star rating + comment |

### Wallet Flow
| Screen | File | Description |
|--------|------|-------------|
| Wallet Home | `wallet/WalletHomeScreen.tsx` | Balance, quick actions |
| Add Money | `wallet/AddMoneyScreen.tsx` | Top-up via UPI / card |
| Transactions | `wallet/TransactionHistoryScreen.tsx` | Full transaction history |
| Referral | `wallet/ReferralScreen.tsx` | Referral code share |

### Profile Flow
| Screen | File | Description |
|--------|------|-------------|
| Profile | `profile/ProfileScreen.tsx` | User info, stats, menu |
| Edit Profile | `profile/EditProfileScreen.tsx` | Name, email, gender, avatar |
| Addresses | `profile/AddressesScreen.tsx` | Saved address list |
| Add Address | `profile/AddAddressScreen.tsx` | Add/edit address |
| Settings | `profile/SettingsScreen.tsx` | Notifications, privacy, app version |
| Notifications | `profile/NotificationsScreen.tsx` | All notifications |
| Help | `profile/HelpScreen.tsx` | FAQs, support contact |

---

## 🗃 State Management

The app uses **Zustand** for lightweight global state. Three stores:

### `authStore.ts`
```ts
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  deviceId: string | null

  login(phone, otp)   // demo: any phone + "123456"
  logout()
  checkAuth()         // hydrates from AsyncStorage on app start
}
```

### `bookingStore.ts`
```ts
{
  salonId: string | null
  selectedServices: SalonService[]
  selectedStaff: Staff | null
  selectedDate: string | null
  selectedSlot: { startTime, endTime } | null

  addService(service)
  removeService(serviceId)
  setSelectedStaff(staff)
  setDateTime(date, slot)
  clearBooking()
  getTotalAmount()     // sum of selected service prices
  getTotalDuration()   // sum of selected service durations
}
```

### `notificationStore.ts`
```ts
{
  notifications: Notification[]
  unreadCount()        // used for Profile tab badge
  markAsRead(id)
  markAllAsRead()
}
```

---

## 🎨 Design System

### Brand Colors
```ts
// Primary accent — Salon Pink
salonPink:      '#FF5C8A'
salonPinkLight: 'rgba(255, 92, 138, 0.10)'
salonPinkGlow:  'rgba(255, 92, 138, 0.35)'

// Neutrals
textPrimary:    '#1A1B2E'
textSecondary:  '#64748B'
border:         '#E2E8F0'
background:     '#F7F8FC'
surface:        '#FFFFFF'

// Semantic
success:  '#10B981'
warning:  '#F59E0B'
error:    '#EF4444'
info:     '#0EA5E9'
```

### Service Category Colors
| Category | Color |
|----------|-------|
| Hair | `#6C63FF` |
| Skin | `#FF9F43` |
| Body | `#26C6DA` |
| Nails | `#FF6B9D` |
| Makeup | `#A29BFE` |
| Spa | `#55EFC4` |

### Typography
```
Heading:  fontWeight 800, letterSpacing -0.5
Subhead:  fontWeight 700
Body:     fontWeight 400–600
Label:    fontSize 11–12, fontWeight 600
```

### Key UI Patterns
- **Spring animations** — `tension: 160, friction: 18` for tab transitions
- **Press feedback** — scale to `0.92–0.97` on `onPressIn`
- **FAB** — pink pill button (`borderRadius: 32`) with shadow and breathing pulse
- **Cards** — `borderRadius: 18`, `elevation: 4`, white background
- **Category pills** — colored border + background, icon + label

---

## 🌐 API Integration

The app is pre-wired for a REST backend at `API_URL` (default: `http://localhost:5000/api/v1`).

Currently all data comes from `src/data/demo.ts`. To switch to live API:

1. Set `API_URL` in your `.env`
2. Replace demo data calls in each screen with Axios calls via `src/lib/api.ts` (or create one following the CRM frontend pattern)
3. Update `authStore.login()` to call `POST /auth/send-otp` and `POST /auth/verify-otp`

### Expected Backend Endpoints
```
POST   /auth/send-otp
POST   /auth/verify-otp
GET    /salons
GET    /salons/:id
GET    /salons/:id/services
GET    /salons/:id/staff
GET    /salons/:id/slots?date=&staffId=
POST   /bookings
GET    /bookings
GET    /bookings/:id
PATCH  /bookings/:id/cancel
PATCH  /bookings/:id/reschedule
POST   /bookings/:id/review
GET    /wallet
POST   /wallet/add
GET    /wallet/transactions
GET    /notifications
PATCH  /notifications/:id/read
GET    /profile
PATCH  /profile
```

---

## 📦 Build & Deployment

### Development Build (Expo Go)
```bash
npm start
```

### EAS Build (Production)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project (first time)
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

### App Store / Play Store Submission
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

### App Config (`app.json`)
| Key | Value |
|-----|-------|
| Bundle ID (iOS) | `com.salonapp.customer` |
| Package (Android) | `com.salonapp.customer` |
| Version | `1.0.0` |
| Orientation | Portrait |
| iOS permissions | Location, Camera, Photos, FaceID |
| Android permissions | Location, Camera, Storage, Biometric |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Module not found` errors | Run `npm run clear` to clear Metro cache |
| Animations are choppy | Test on a real device, not the simulator |
| `ExpoBlurView` warning | Already resolved — `BlurView` replaced with native `View` glassmorphism |
| OTP not working | Use `123456` in demo mode |
| App stuck on splash | Run `npm run clear && npm start` |
| Android build fails | Ensure Android SDK is configured in Android Studio |
| iOS build fails | Ensure Xcode Command Line Tools are installed |
| Type errors after navigation changes | Run `npm run type-check` to see all errors |
| AsyncStorage data stale | Call `logout()` from Profile to clear stored session |

---

## 📝 Scripts Reference

```bash
npm start          # Start Expo dev server
npm run ios        # Open on iOS Simulator (macOS only)
npm run android    # Open on Android Emulator
npm run web        # Open in browser
npm run clear      # Clear Metro cache and restart
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix lint issues
npm run type-check # TypeScript type checking (no emit)
npm test           # Run Jest tests
```

---

## 📄 License

Proprietary — All rights reserved by **Hair Ahmedabad**

---

## 👥 Built For

**Hair Ahmedabad** · Premium Unisex Salon  
📍 12, CG Road, Navrangpura, Ahmedabad, Gujarat, India

---

*For backend setup, see the `Backend-all-in-one/` directory.*  
*For the CRM admin panel, see the `Crm-Frontend/` directory.*  
*For the Instagram booking integration, see the `Instgram-bookings/` directory.*

│   │   │   └── ServicesScreen.tsx   # Services catalogue (tab 2)
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── EditProfileScreen.tsx
│   │   │   ├── AddressesScreen.tsx
│   │   │   ├── AddAddressScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   ├── NotificationsScreen.tsx
│   │   │   └── HelpScreen.tsx
│   │   └── wallet/
│   │       ├── WalletHomeScreen.tsx
│   │       ├── AddMoneyScreen.tsx
│   │       ├── TransactionHistoryScreen.tsx
│   │       └── ReferralScreen.tsx
│   │
│   ├── services/
│   │   └── storage/
│   │       └── index.ts         # AsyncStorage wrapper
│   │
│   ├── store/
│   │   ├── authStore.ts         # Auth state (user, login, logout)
│   │   ├── bookingStore.ts      # Active booking state (services, staff, slot)
│   │   └── notificationStore.ts # Notifications + unread count
│   │
│   ├── theme/
│   │   └── tokens.ts            # Design tokens (gold luxury theme)
│   │
│   ├── types/
│   │   ├── api.ts               # API request/response types
│   │   ├── models.ts            # Domain models (Salon, Booking, User…)
│   │   └── navigation.ts        # All navigation param lists
│   │
│   └── utils/
│       └── device.ts            # Device info utilities
│
├── .env.example                 # Environment variable template
├── .eslintrc.js                 # ESLint config
├── app.json                     # Expo app config
├── babel.config.js              # Babel config with module-resolver
├── index.js                     # App entry point
├── App.tsx                      # Root component
├── package.json
├── tsconfig.json
└── RUN.sh                       # Quick-start helper script
```

---

## ✅ Prerequisites

Make sure the following are installed before running the app:

```bash
# Node.js 18+
node --version   # v18.x.x or higher

# npm 9+
npm --version    # 9.x.x or higher

# Expo CLI
npm install -g expo-cli

# For iOS (macOS only)
# Xcode 14+ from the Mac App Store

# For Android
# Android Studio + Android SDK + emulator configured
```

---

## ⚡ Quick Start

```bash
# 1. Navigate to the app directory
cd "Mobile-App/customer-mobile"

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start the development server
npm start
```

Then in the Expo CLI menu:
- Press `i` — open iOS Simulator
- Press `a` — open Android Emulator
- Scan the QR code with **Expo Go** app on a physical device

---

## 🔧 Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```env
# Backend API
API_URL=http://localhost:5000/api/v1
API_TIMEOUT=30000

# Razorpay (payment gateway)
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx

# Google Maps (salon location)
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase (push notifications)
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:android:xxxxxxxxxxxxx

# Environment
NODE_ENV=development
```

> **Note:** The app runs fully in demo mode without any real API keys. All screens are populated from `src/data/demo.ts`.

---

## 🚀 Running the App

```bash
# Development (Expo Go)
npm start

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web

# Clear Metro cache and restart
npm run clear
```

---

## 🔑 Demo Credentials

The app ships with a built-in demo mode — no backend required.

| Field | Value |
|-------|-------|
| Phone | Any number (e.g. `9876543210`) |
| OTP | `123456` |
| Demo User | Priya Sharma |

> Any phone number works. The OTP is always `123456`.

---

## 🗺 Navigation Architecture

```
RootNavigator
├── AuthStack                    (unauthenticated)
│   ├── SplashScreen
│   ├── LoginScreen
│   └── OTPScreen
│
└── MainStack — Bottom Tabs      (authenticated)
    ├── HomeTab → HomeStack
    │   ├── HomeScreen
    │   ├── SearchScreen
    │   ├── SalonListScreen
    │   ├── SalonDetailScreen
    │   └── Booking Wizard ──────────────────────────────────┐
    │       ├── ServiceSelectionScreen (step 1)               │
    │       ├── StaffSelectionScreen   (step 2)               │
    │       ├── SlotSelectionScreen    (step 3)               │
    │       ├── BookingSummaryScreen   (step 4)               │
    │       ├── PaymentScreen                                  │
    │       └── BookingSuccessScreen                          │
    │                                                          │
    ├── ServicesTab → ServicesStack                           │
    │   ├── ServicesScreen (catalogue)                        │
    │   └── ServiceBooking → ServiceSelectionScreen ──────────┘
    │
    ├── BookingsTab → BookingsStack
    │   ├── BookingListScreen
    │   ├── BookingDetailScreen
    │   ├── RescheduleScreen
    │   └── WriteReviewScreen
    │
    ├── WalletTab → WalletStack
    │   ├── WalletHomeScreen
    │   ├── AddMoneyScreen
    │   ├── TransactionHistoryScreen
    │   └── ReferralScreen
    │
    └── ProfileTab → ProfileStack
        ├── ProfileScreen
        ├── EditProfileScreen
        ├── AddressesScreen
        ├── AddAddressScreen
        ├── SettingsScreen
        ├── NotificationsScreen
        └── HelpScreen
```

### Bottom Tab Bar

5 tabs with salon-pink (`#FF5C8A`) active tint:

| Tab | Icon | Screen |
|-----|------|--------|
| Home | `Home` | Salon discovery feed |
| Services | `LayoutGrid` | Services catalogue |
| Bookings | `Calendar` | Appointments list |
| Wallet | `Wallet` | Wallet & payments |
| Profile | `User` | User profile + settings |

---

## 📱 Screens Reference

### Auth Flow
| Screen | File | Description |
|--------|------|-------------|
| Splash | `auth/SplashScreen.tsx` | Animated luxury splash with logo |
| Login | `auth/LoginScreen.tsx` | Phone number entry, glassmorphism design |
| OTP | `auth/OTPScreen.tsx` | 6-digit OTP verification |

### Home Flow
| Screen | File | Description |
|--------|------|-------------|
| Home | `home/HomeScreen.tsx` | Greeting, featured salons, quick actions |
| Search | `home/SearchScreen.tsx` | Full-text search across salons/services |
| Salon List | `home/SalonListScreen.tsx` | Filtered salon listing |
| Salon Detail | `home/SalonDetailScreen.tsx` | Salon info, services, reviews, gallery |

### Services Flow
| Screen | File | Description |
|--------|------|-------------|
| Services Catalogue | `services/ServicesScreen.tsx` | All services with category filter, search, featured banner, `+ Book New Service` FAB |
| Service Booking | `booking/ServiceSelectionScreen.tsx` | Step 1 of booking wizard |

### Booking Wizard
| Screen | File | Step |
|--------|------|------|
| Service Selection | `booking/ServiceSelectionScreen.tsx` | 1 — Pick services |
| Staff Selection | `booking/StaffSelectionScreen.tsx` | 2 — Pick staff |
| Slot Selection | `booking/SlotSelectionScreen.tsx` | 3 — Pick date & time |
| Booking Summary | `booking/BookingSummaryScreen.tsx` | 4 — Review & confirm |
| Payment | `booking/PaymentScreen.tsx` | Pay via Razorpay / Wallet |
| Booking Success | `booking/BookingSuccessScreen.tsx` | Confirmation screen |

### Appointments Flow
| Screen | File | Description |
|--------|------|-------------|
| Booking List | `bookings/BookingListScreen.tsx` | Upcoming / Completed / Cancelled tabs, `+ Book New Service` FAB |
| Booking Detail | `bookings/BookingDetailScreen.tsx` | Full booking details, cancel, reschedule |
| Reschedule | `bookings/RescheduleScreen.tsx` | Pick new date/time |
| Write Review | `bookings/WriteReviewScreen.tsx` | Star rating + comment |

### Wallet Flow
| Screen | File | Description |
|--------|------|-------------|
| Wallet Home | `wallet/WalletHomeScreen.tsx` | Balance, quick actions |
| Add Money | `wallet/AddMoneyScreen.tsx` | Top-up via UPI / card |
| Transactions | `wallet/TransactionHistoryScreen.tsx` | Full transaction history |
| Referral | `wallet/ReferralScreen.tsx` | Referral code share |

### Profile Flow
| Screen | File | Description |
|--------|------|-------------|
| Profile | `profile/ProfileScreen.tsx` | User info, stats, menu |
| Edit Profile | `profile/EditProfileScreen.tsx` | Name, email, gender, avatar |
| Addresses | `profile/AddressesScreen.tsx` | Saved address list |
| Add Address | `profile/AddAddressScreen.tsx` | Add/edit address |
| Settings | `profile/SettingsScreen.tsx` | Notifications, privacy, app version |
| Notifications | `profile/NotificationsScreen.tsx` | All notifications |
| Help | `profile/HelpScreen.tsx` | FAQs, support contact |

---

## 🗃 State Management

The app uses **Zustand** for lightweight global state. Three stores:

### `authStore.ts`
```ts
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  deviceId: string | null

  login(phone, otp)   // demo: any phone + "123456"
  logout()
  checkAuth()         // hydrates from AsyncStorage on app start
}
```

### `bookingStore.ts`
```ts
{
  salonId: string | null
  selectedServices: SalonService[]
  selectedStaff: Staff | null
  selectedDate: string | null
  selectedSlot: { startTime, endTime } | null

  addService(service)
  removeService(serviceId)
  setSelectedStaff(staff)
  setDateTime(date, slot)
  clearBooking()
  getTotalAmount()     // sum of selected service prices
  getTotalDuration()   // sum of selected service durations
}
```

### `notificationStore.ts`
```ts
{
  notifications: Notification[]
  unreadCount()        // used for Profile tab badge
  markAsRead(id)
  markAllAsRead()
}
```

---

## 🎨 Design System

### Brand Colors
```ts
// Primary accent — Salon Pink
salonPink:      '#FF5C8A'
salonPinkLight: 'rgba(255, 92, 138, 0.10)'
salonPinkGlow:  'rgba(255, 92, 138, 0.35)'

// Neutrals
textPrimary:    '#1A1B2E'
textSecondary:  '#64748B'
border:         '#E2E8F0'
background:     '#F7F8FC'
surface:        '#FFFFFF'

// Semantic
success:  '#10B981'
warning:  '#F59E0B'
error:    '#EF4444'
info:     '#0EA5E9'
```

### Service Category Colors
| Category | Color |
|----------|-------|
| Hair | `#6C63FF` |
| Skin | `#FF9F43` |
| Body | `#26C6DA` |
| Nails | `#FF6B9D` |
| Makeup | `#A29BFE` |
| Spa | `#55EFC4` |

### Typography
```
Heading:  fontWeight 800, letterSpacing -0.5
Subhead:  fontWeight 700
Body:     fontWeight 400–600
Label:    fontSize 11–12, fontWeight 600
```

### Key UI Patterns
- **Spring animations** — `tension: 160, friction: 18` for tab transitions
- **Press feedback** — scale to `0.92–0.97` on `onPressIn`
- **FAB** — pink pill button (`borderRadius: 32`) with shadow and breathing pulse
- **Cards** — `borderRadius: 18`, `elevation: 4`, white background
- **Category pills** — colored border + background, icon + label

---

## 🌐 API Integration

The app is pre-wired for a REST backend at `API_URL` (default: `http://localhost:5000/api/v1`).

Currently all data comes from `src/data/demo.ts`. To switch to live API:

1. Set `API_URL` in your `.env`
2. Replace demo data calls in each screen with Axios calls via `src/lib/api.ts` (or create one following the CRM frontend pattern)
3. Update `authStore.login()` to call `POST /auth/send-otp` and `POST /auth/verify-otp`

### Expected Backend Endpoints
```
POST   /auth/send-otp
POST   /auth/verify-otp
GET    /salons
GET    /salons/:id
GET    /salons/:id/services
GET    /salons/:id/staff
GET    /salons/:id/slots?date=&staffId=
POST   /bookings
GET    /bookings
GET    /bookings/:id
PATCH  /bookings/:id/cancel
PATCH  /bookings/:id/reschedule
POST   /bookings/:id/review
GET    /wallet
POST   /wallet/add
GET    /wallet/transactions
GET    /notifications
PATCH  /notifications/:id/read
GET    /profile
PATCH  /profile
```

---

## 📦 Build & Deployment

### Development Build (Expo Go)
```bash
npm start
```

### EAS Build (Production)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project (first time)
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

### App Store / Play Store Submission
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

### App Config (`app.json`)
| Key | Value |
|-----|-------|
| Bundle ID (iOS) | `com.salonapp.customer` |
| Package (Android) | `com.salonapp.customer` |
| Version | `1.0.0` |
| Orientation | Portrait |
| iOS permissions | Location, Camera, Photos, FaceID |
| Android permissions | Location, Camera, Storage, Biometric |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Module not found` errors | Run `npm run clear` to clear Metro cache |
| Animations are choppy | Test on a real device, not the simulator |
| `ExpoBlurView` warning | Already resolved — `BlurView` replaced with native `View` glassmorphism |
| OTP not working | Use `123456` in demo mode |
| App stuck on splash | Run `npm run clear && npm start` |
| Android build fails | Ensure Android SDK is configured in Android Studio |
| iOS build fails | Ensure Xcode Command Line Tools are installed |
| Type errors after navigation changes | Run `npm run type-check` to see all errors |
| AsyncStorage data stale | Call `logout()` from Profile to clear stored session |

---

## 📝 Scripts Reference

```bash
npm start          # Start Expo dev server
npm run ios        # Open on iOS Simulator (macOS only)
npm run android    # Open on Android Emulator
npm run web        # Open in browser
npm run clear      # Clear Metro cache and restart
npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix lint issues
npm run type-check # TypeScript type checking (no emit)
npm test           # Run Jest tests
```

---

## 📄 License

Proprietary — All rights reserved by **Hair Ahmedabad**

---

## 👥 Built For

**Hair Ahmedabad** · Premium Unisex Salon  
📍 12, CG Road, Navrangpura, Ahmedabad, Gujarat, India

---

*For backend setup, see the `Backend-all-in-one/` directory.*  
*For the CRM admin panel, see the `Crm-Frontend/` directory.*  
*For the Instagram booking integration, see the `Instgram-bookings/` directory.*



#606C5D
#FFF4F4
#F7E6C4
#F1C376


use thsi color as main color use it evary make look nice
add skip button on bording page in upper right side corner
also use this color code
Emerald Green + Gold
#0f465c
#D4AF37
#FAFAFA
#1F2937