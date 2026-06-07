# 📱 Screens Reference — SalonBooking Customer App

> **Project:** `salon-customer-app` · React Native `0.81.5` · Expo `~54.0.0` · TypeScript  
> **Total Screens:** 43  
> **Bottom Tabs:** Home · Services · Bookings · Shop · Profile

---

## Table of Contents

- [Auth Flow](#-auth-flow--4-screens)
- [Home Flow](#-home-flow--4-screens)
- [Booking Wizard](#-booking-wizard--6-screens)
- [Appointments Flow](#-appointments-flow--4-screens)
- [Services Flow](#-services-flow--2-screens)
- [Shop Flow](#-shop-flow--6-screens)
- [Profile Flow](#-profile-flow--7-screens)
- [Wallet Flow](#-wallet-flow--4-screens)
- [Gallery Flow](#-gallery-flow--2-screens)
- [Reviews Flow](#-reviews-flow--1-screen)
- [Team Flow](#-team-flow--2-screens)
- [Location Flow](#-location-flow--1-screen)
- [Navigation Architecture](#-navigation-architecture)
- [Screen Count Summary](#-screen-count-summary)
- [Design System](#-design-system-quick-reference)
- [Demo Credentials](#-demo-credentials)

---

## 🔐 Auth Flow — 4 screens

> Stack: `AuthStack` · Unauthenticated users only

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 1 | **Splash** | `Splash` | `src/screens/auth/SplashScreen.tsx` | Animated logo splash, auto-navigates after 2s |
| 2 | **Onboarding** | `Onboarding` | `src/screens/auth/OnboardingScreen.tsx` | 3-slide feature carousel for first-time users |
| 3 | **Login** | `Login` | `src/screens/auth/LoginScreen.tsx` | Phone number entry with glassmorphism design |
| 4 | **OTP Verification** | `OTPVerification` | `src/screens/auth/OTPScreen.tsx` | 6-digit OTP input · demo OTP: `123456` |

---

## 🏠 Home Flow — 4 screens

> Stack: `HomeStack` · Tab: **Home** (`HomeTab`)

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 5 | **Home** | `Home` | `src/screens/home/HomeScreen.tsx` | Greeting, flash sale timer, loyalty points chip, quick actions row, offers carousel, Meet Our Stylists section, trending services, nearby & top-rated salons, animated FAB |
| 6 | **Search** | `Search` | `src/screens/home/SearchScreen.tsx` | Full-text search across salons and services |
| 7 | **Salon List** | `SalonList` | `src/screens/home/SalonListScreen.tsx` | Filtered list of all salons with distance sorting |
| 8 | **Salon Detail** | `SalonDetail` | `src/screens/home/SalonDetailScreen.tsx` | Salon info, services tab, staff tab, reviews tab, gallery, location button |

---

## 💆 Booking Wizard — 6 screens

> Stack: `HomeStack` (nested) · Entered from Salon Detail or Services tab  
> Shared step indicator: `src/components/booking/BookingProgress.tsx`

| # | Screen | Route Name | File Path | Step | Description |
|---|--------|------------|-----------|------|-------------|
| 9  | **Service Selection** | `ServiceSelection` | `src/screens/booking/ServiceSelectionScreen.tsx` | 1 / 4 | Category pills, search, multi-select with toggle, live price & duration tray, selected chips |
| 10 | **Staff Selection**   | `StaffSelection`   | `src/screens/booking/StaffSelectionScreen.tsx`   | 2 / 4 | "Any Available" card, real avatar photos, rating, client count, availability badge, skip button |
| 11 | **Slot Selection**    | `SlotSelection`    | `src/screens/booking/SlotSelectionScreen.tsx`    | 3 / 4 | 14-day date strip, Morning / Afternoon / Evening time groups, booked slots strikethrough, stylist context card |
| 12 | **Booking Summary**   | `BookingSummary`   | `src/screens/booking/BookingSummaryScreen.tsx`   | 4 / 4 | Appointment detail grid, services list, promo codes (SAVE10 · WEEKEND20 · FLAT100), GST breakdown, cancellation policy |
| 13 | **Payment**           | `Payment`          | `src/screens/booking/PaymentScreen.tsx`          | Pay   | UPI / Card / Wallet / Net Banking, live wallet balance check, processing spinner, Razorpay-ready |
| 14 | **Booking Success**   | `BookingSuccess`   | `src/screens/booking/BookingSuccessScreen.tsx`   | Done  | Spring-animated check, booking ID chip, full appointment summary, info chips, navigates to Bookings tab |

---

## 📋 Appointments Flow — 4 screens

> Stack: `BookingsStack` · Tab: **Bookings** (`BookingsTab`)

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 15 | **Booking List**   | `BookingList`   | `src/screens/bookings/BookingListScreen.tsx`   | Upcoming / Completed / Cancelled tabs, `+ Book New Service` FAB |
| 16 | **Booking Detail** | `BookingDetail` | `src/screens/bookings/BookingDetailScreen.tsx` | Full booking info, cancel action, reschedule button |
| 17 | **Reschedule**     | `Reschedule`    | `src/screens/bookings/RescheduleScreen.tsx`    | Pick new date and time slot for an existing booking |
| 18 | **Write Review**   | `WriteReview`   | `src/screens/bookings/WriteReviewScreen.tsx`   | 5-star rating picker + comment textarea for completed bookings |

---

## 💄 Services Flow — 2 screens

> Stack: `ServicesStack` · Tab: **Services** (`ServicesTab`)

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 19 | **Services Catalogue** | `ServicesCatalogue` | `src/screens/services/ServicesScreen.tsx`      | Category pills, search, featured banner, service cards with inline Book button |
| 20 | **Service Detail**     | `ServiceDetail`     | `src/screens/services/ServiceDetailScreen.tsx` | Full service info, duration, price, related salon, Book CTA |

---

## 🛍️ Shop Flow — 6 screens

> Stack: `ShopStack` · Tab: **Shop** (`ShopTab`)

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 21 | **Product List**    | `ProductList`    | `src/screens/shop/ProductListScreen.tsx`    | Hero banner carousel, category filter, search, sort options, 2-col product grid with wishlist & add-to-cart, press-scale animation |
| 22 | **Product Detail**  | `ProductDetail`  | `src/screens/shop/ProductDetailScreen.tsx`  | Image hero with scroll-fade header, size picker, quantity stepper, perks row, collapsible description, reviews, sticky Buy Now footer |
| 23 | **Cart**            | `Cart`           | `src/screens/shop/CartScreen.tsx`           | Cart items with quantity controls, coupon input, order summary breakdown |
| 24 | **Checkout**        | `Checkout`       | `src/screens/shop/CheckoutScreen.tsx`       | Delivery address selector, payment method picker, collapsible order summary |
| 25 | **Order Confirmed** | `OrderConfirmed` | `src/screens/shop/OrderConfirmedScreen.tsx` | Animated check, order summary card, step progress preview, Track Your Order button |
| 26 | **Order Tracking**  | `OrderTracking`  | `src/screens/shop/OrderTrackingScreen.tsx`  | Pink gradient header with ETA, map placeholder, delivery partner card (call/message), animated 5-step timeline, address card, items + bill, help actions |

---

## 👤 Profile Flow — 7 screens

> Stack: `ProfileStack` · Tab: **Profile** (`ProfileTab`) · Shows unread notification badge

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 27 | **Profile**       | `Profile`       | `src/screens/profile/ProfileScreen.tsx`       | User info card, booking stats, full settings menu |
| 28 | **Edit Profile**  | `EditProfile`   | `src/screens/profile/EditProfileScreen.tsx`   | Edit name, email, gender, avatar |
| 29 | **Addresses**     | `Addresses`     | `src/screens/profile/AddressesScreen.tsx`     | Saved address list with default indicator |
| 30 | **Add Address**   | `AddAddress`    | `src/screens/profile/AddAddressScreen.tsx`    | Add or edit a delivery / salon address |
| 31 | **Settings**      | `Settings`      | `src/screens/profile/SettingsScreen.tsx`      | Notification preferences, privacy, app version |
| 32 | **Notifications** | `Notifications` | `src/screens/profile/NotificationsScreen.tsx` | All in-app notifications with read / unread state |
| 33 | **Help**          | `Help`          | `src/screens/profile/HelpScreen.tsx`          | FAQs accordion, contact support links |

---

## 💳 Wallet Flow — 4 screens

> Stack: `WalletStack` · Accessible via Profile menu (removed from bottom tab bar)

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 34 | **Wallet Home**         | `WalletHome`         | `src/screens/wallet/WalletHomeScreen.tsx`         | Balance display, loyalty points, quick add-money & history actions |
| 35 | **Add Money**           | `AddMoney`           | `src/screens/wallet/AddMoneyScreen.tsx`           | Top-up via UPI / credit card / net banking |
| 36 | **Transaction History** | `TransactionHistory` | `src/screens/wallet/TransactionHistoryScreen.tsx` | Full credit / debit transaction log |
| 37 | **Referral**            | `Referral`           | `src/screens/wallet/ReferralScreen.tsx`           | Referral code share, referral history, ₹100 per referral |

---

## 🖼️ Gallery Flow — 2 screens

> Stack: `HomeStack` · Accessed from Salon Detail

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 38 | **Gallery**      | `Gallery`     | `src/screens/gallery/GalleryScreen.tsx`     | Masonry photo grid of salon images |
| 39 | **Image Viewer** | `ImageViewer` | `src/screens/gallery/ImageViewerScreen.tsx` | Full-screen pinch-to-zoom image viewer |

---

## ⭐ Reviews Flow — 1 screen

> Stack: `HomeStack` · Accessed from Salon Detail

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 40 | **Reviews** | `Reviews` | `src/screens/reviews/ReviewsScreen.tsx` | All reviews for a salon with aggregate rating and star breakdown |

---

## 👥 Team Flow — 2 screens

> Stack: `HomeStack` · Accessed from Home "Our Team" quick action or Salon Detail

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 41 | **Team**           | `Team`          | `src/screens/team/TeamScreen.tsx`          | Horizontal paged carousel of all salon stylists with real photos |
| 42 | **Artist Profile** | `ArtistProfile` | `src/screens/team/ArtistProfileScreen.tsx` | Stylist bio, specialties, rating, client count, Book button |

---

## 📍 Location Flow — 1 screen

> Stack: `HomeStack` · Accessed from Salon Detail

| # | Screen | Route Name | File Path | Description |
|---|--------|------------|-----------|-------------|
| 43 | **Location** | `Location` | `src/screens/location/LocationScreen.tsx` | Map view of salon location with directions CTA |

---

## 🗺 Navigation Architecture

```
RootNavigator
├── AuthStack                              (unauthenticated)
│   ├── Splash
│   ├── Onboarding
│   ├── Login
│   └── OTPVerification
│
└── MainStack ── Bottom Tabs               (authenticated)
    │
    ├── 🏠 HomeTab → HomeStack
    │   ├── Home
    │   ├── Search
    │   ├── SalonList
    │   ├── SalonDetail
    │   ├── Reviews
    │   ├── Gallery
    │   │   └── ImageViewer
    │   ├── Team
    │   │   └── ArtistProfile
    │   ├── Location
    │   └── Booking Wizard
    │       ├── ServiceSelection  (step 1)
    │       ├── StaffSelection    (step 2)
    │       ├── SlotSelection     (step 3)
    │       ├── BookingSummary    (step 4)
    │       ├── Payment
    │       └── BookingSuccess
    │
    ├── 💄 ServicesTab → ServicesStack
    │   ├── ServicesCatalogue
    │   ├── ServiceDetail
    │   └── ServiceBooking → (Booking Wizard)
    │
    ├── 📋 BookingsTab → BookingsStack
    │   ├── BookingList
    │   ├── BookingDetail
    │   ├── Reschedule
    │   └── WriteReview
    │
    ├── 🛍️ ShopTab → ShopStack
    │   ├── ProductList
    │   ├── ProductDetail
    │   ├── Cart
    │   ├── Checkout
    │   ├── OrderConfirmed
    │   └── OrderTracking
    │
    └── 👤 ProfileTab → ProfileStack
        ├── Profile
        ├── EditProfile
        ├── Addresses
        │   └── AddAddress
        ├── Settings
        ├── Notifications
        ├── Help
        └── → WalletStack  (via Profile menu)
            ├── WalletHome
            ├── AddMoney
            ├── TransactionHistory
            └── Referral
```

---

## 📊 Screen Count Summary

| Flow | Screens |
|------|:-------:|
| 🔐 Auth | 4 |
| 🏠 Home | 4 |
| 💆 Booking Wizard | 6 |
| 📋 Appointments | 4 |
| 💄 Services | 2 |
| 🛍️ Shop | 6 |
| 👤 Profile | 7 |
| 💳 Wallet | 4 |
| 🖼️ Gallery | 2 |
| ⭐ Reviews | 1 |
| 👥 Team | 2 |
| 📍 Location | 1 |
| **Total** | **43** |

---

## 🎨 Design System Quick Reference

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Salon Pink | `#FF5C8A` | Primary accent, CTAs, active states |
| Salon Pink Dark | `#FF3366` | Gradient end, pressed state |
| Salon Pink Light | `#FFF0F5` | Tinted backgrounds, chips |
| Success | `#10B981` | Confirmed, available, done steps |
| Warning | `#F59E0B` | Ratings, morning slots |
| Error | `#EF4444` | Cancel, busy, insufficient balance |
| Info | `#3B82F6` | Card payment, info badges |
| Background | `#F7F8FC` | Screen background |
| Surface | `#FFFFFF` | Cards, sheets |
| Text Primary | `#0F172A` | Headings, labels |
| Text Secondary | `#64748B` | Subtext, descriptions |
| Text Tertiary | `#94A3B8` | Placeholders, meta |
| Border | `#E2E8F0` | Dividers, card borders |

### Service Category Colors

| Category | Color |
|----------|-------|
| Hair | `#8B5CF6` |
| Skin / Facial | `#EC4899` |
| Body / Spa | `#14B8A6` |
| Nails | `#F59E0B` |
| Makeup | `#EF4444` |
| Massage | `#10B981` |

### Typography Scale

| Role | Size | Weight |
|------|------|--------|
| Screen Title | 26–28px | 800 |
| Section Title | 17–18px | 800 |
| Card Title | 15–16px | 700–800 |
| Body | 14–15px | 400–600 |
| Label / Meta | 11–13px | 500–700 |
| Badge / Tag | 10–12px | 700–800 |

### Key UI Patterns

| Pattern | Spec |
|---------|------|
| Card border radius | `18–22px` |
| Button border radius | `14–20px` |
| Card shadow | `elevation: 2–4`, `shadowOpacity: 0.04–0.08` |
| FAB shadow | `shadowColor: #FF5C8A`, `shadowOpacity: 0.4` |
| Press feedback | `scale: 0.96` spring animation |
| FAB pulse | `Animated.loop` scale `1 → 1.08 → 1`, 900ms |
| Success check | `Animated.spring` scale `0 → 1`, tension 55 |
| Booking timeline | Staggered `fadeIn + slideUp` with 120ms delay per step |

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Phone | Any number (e.g. `9876543210`) |
| OTP | `123456` |
| Demo User | Priya Sharma |
| Wallet Balance | ₹984 |
| Loyalty Points | 250 pts |
| Promo Codes | `SAVE10` · `WEEKEND20` · `FLAT100` |

---

## 🧩 Shared Components

| Component | Path | Used In |
|-----------|------|---------|
| `BookingProgress` | `src/components/booking/BookingProgress.tsx` | All 4 booking wizard steps |
| `BookingCard` | `src/components/booking/BookingCard.tsx` | Booking list items |
| `SalonCard` | `src/components/salon/SalonCard.tsx` | Home, Salon List |
| `ScreenHeader` | `src/components/layout/ScreenHeader.tsx` | Various screens |
| `Button` | `src/components/common/Button.tsx` | Generic CTA button |
| `Card` | `src/components/common/Card.tsx` | Generic pressable card |
| `Input` | `src/components/common/Input.tsx` | Generic text input |
| `GlassContainer` | `src/components/auth/GlassContainer.tsx` | Auth screens |
| `LuxuryButton` | `src/components/auth/LuxuryButton.tsx` | Auth screens |
| `LuxuryInput` | `src/components/auth/LuxuryInput.tsx` | Auth screens |
| `ProfileCard` | `src/components/profile/ProfileCard.tsx` | Profile screen |
| `StatsCard` | `src/components/profile/StatsCard.tsx` | Profile screen |
| `MenuButton` | `src/components/profile/MenuButton.tsx` | Profile screen |

---

## 📦 State Management (Zustand)

| Store | Path | Manages |
|-------|------|---------|
| `authStore` | `src/store/authStore.ts` | User session, login, logout, checkAuth |
| `bookingStore` | `src/store/bookingStore.ts` | Active booking — services, staff, date, slot |
| `notificationStore` | `src/store/notificationStore.ts` | Notifications list, unread count, mark read |

---

## 🔌 Expected API Endpoints

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
GET    /products
GET    /products/:id
POST   /orders
GET    /orders/:id/track
```

---

*Last updated: June 2025*  
*Built for **Hair Ahmedabad** · Premium Unisex Salon · 12, CG Road, Navrangpura, Ahmedabad, Gujarat*
