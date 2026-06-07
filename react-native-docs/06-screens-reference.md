# 📱 Screens Reference — All 43 Screens

---

## 🔐 Auth Flow (4 screens) — `AuthStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 1 | `Splash` | `auth/SplashScreen.tsx` | Animated logo splash, auto-navigates after 2s |
| 2 | `Onboarding` | `auth/OnboardingScreen.tsx` | 3-slide feature carousel for first-time users |
| 3 | `Login` | `auth/LoginScreen.tsx` | Phone number entry with glassmorphism design |
| 4 | `OTPVerification` | `auth/OTPScreen.tsx` | 6-digit OTP input — demo OTP: `123456` |

---

## 🏠 Home Flow (4 screens) — `HomeStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 5 | `Home` | `home/HomeScreen.tsx` | Greeting, offers carousel, stylists section, FAB |
| 6 | `Search` | `home/SearchScreen.tsx` | Full-text search across salons and services |
| 7 | `SalonList` | `home/SalonListScreen.tsx` | Filtered salon listing with distance sorting |
| 8 | `SalonDetail` | `home/SalonDetailScreen.tsx` | Salon info, services, staff, reviews, gallery tabs |

---

## 💆 Booking Wizard (6 screens) — `HomeStack` (nested)

> Step indicator component: `src/components/booking/BookingProgress.tsx`

| # | Route | File | Step | Description |
|---|-------|------|------|-------------|
| 9  | `ServiceSelection` | `booking/ServiceSelectionScreen.tsx` | 1/4 | Category filter, multi-select, price tray |
| 10 | `StaffSelection`   | `booking/StaffSelectionScreen.tsx`   | 2/4 | Avatar cards, rating, "Any Available" option |
| 11 | `SlotSelection`    | `booking/SlotSelectionScreen.tsx`    | 3/4 | 14-day strip, time groups, booked slots |
| 12 | `BookingSummary`   | `booking/BookingSummaryScreen.tsx`   | 4/4 | Summary, promo codes, GST, cancellation policy |
| 13 | `Payment`          | `booking/PaymentScreen.tsx`          | Pay  | UPI / Card / Wallet / Net Banking |
| 14 | `BookingSuccess`   | `booking/BookingSuccessScreen.tsx`   | Done | Animated check, booking ID, summary, resets stack |

**Wizard data flow:** All wizard state lives in `bookingStore`. `clearBooking()` is called on `BookingSuccess` mount.

---

## 📋 Appointments Flow (4 screens) — `BookingsStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 15 | `BookingList`   | `bookings/BookingListScreen.tsx`   | Upcoming / Completed / Cancelled tabs + FAB |
| 16 | `BookingDetail` | `bookings/BookingDetailScreen.tsx` | Full booking info, cancel, reschedule, review |
| 17 | `Reschedule`    | `bookings/RescheduleScreen.tsx`    | Pick new date and time slot |
| 18 | `WriteReview`   | `bookings/WriteReviewScreen.tsx`   | 5-star overall + aspect ratings + comment |

---

## 💄 Services Flow (2 screens) — `ServicesStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 19 | `ServicesCatalogue` | `services/ServicesScreen.tsx`       | Category pills, search, featured banner |
| 20 | `ServiceDetail`     | `services/ServiceDetailScreen.tsx`  | Full service info, duration, Book CTA |

---

## 🛍️ Shop Flow (6 screens) — `ShopStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 21 | `ProductList`    | `shop/ProductListScreen.tsx`    | Hero carousel, 2-col grid, wishlist + cart |
| 22 | `ProductDetail`  | `shop/ProductDetailScreen.tsx`  | Image hero, size picker, quantity, reviews |
| 23 | `Cart`           | `shop/CartScreen.tsx`           | Cart items, quantity controls, coupon, summary |
| 24 | `Checkout`       | `shop/CheckoutScreen.tsx`       | Address selector, payment method picker |
| 25 | `OrderConfirmed` | `shop/OrderConfirmedScreen.tsx` | Animated check, order summary, Track button |
| 26 | `OrderTracking`  | `shop/OrderTrackingScreen.tsx`  | Gradient header, map, timeline, delivery partner |

---

## 👤 Profile Flow (7 screens) — `ProfileStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 27 | `Profile`       | `profile/ProfileScreen.tsx`       | User card, booking stats, settings menu |
| 28 | `EditProfile`   | `profile/EditProfileScreen.tsx`   | Name, email, gender, avatar |
| 29 | `Addresses`     | `profile/AddressesScreen.tsx`     | Saved addresses, default indicator |
| 30 | `AddAddress`    | `profile/AddAddressScreen.tsx`    | Add/edit address with type + default toggle |
| 31 | `Settings`      | `profile/SettingsScreen.tsx`      | Notifications, privacy, app version |
| 32 | `Notifications` | `profile/NotificationsScreen.tsx` | In-app notifications with read/unread + filter |
| 33 | `Help`          | `profile/HelpScreen.tsx`          | FAQs accordion, contact cards (call/email/chat) |

---

## 💳 Wallet Flow (4 screens) — `WalletStack`

> Accessed from Profile screen menu → "My Wallet"

| # | Route | File | Description |
|---|-------|------|-------------|
| 34 | `WalletHome`         | `wallet/WalletHomeScreen.tsx`         | Balance, loyalty points, quick actions |
| 35 | `AddMoney`           | `wallet/AddMoneyScreen.tsx`           | Quick chips, custom amount, payment method |
| 36 | `TransactionHistory` | `wallet/TransactionHistoryScreen.tsx` | Credit/Debit tabs, monthly groups |
| 37 | `Referral`           | `wallet/ReferralScreen.tsx`           | Referral code, share, stats, how it works |

---

## 🖼️ Gallery Flow (2 screens) — `HomeStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 38 | `Gallery`     | `gallery/GalleryScreen.tsx`     | Masonry photo grid of salon images |
| 39 | `ImageViewer` | `gallery/ImageViewerScreen.tsx` | Full-screen pinch-to-zoom viewer |

---

## ⭐ Reviews Flow (1 screen) — `HomeStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 40 | `Reviews` | `reviews/ReviewsScreen.tsx` | Aggregate rating, star breakdown, review list |

---

## 👥 Team Flow (2 screens) — `HomeStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 41 | `Team`          | `team/TeamScreen.tsx`          | Paged carousel of all stylists |
| 42 | `ArtistProfile` | `team/ArtistProfileScreen.tsx` | Stylist bio, specialties, portfolio, Book button |

---

## 📍 Location Flow (1 screen) — `HomeStack`

| # | Route | File | Description |
|---|-------|------|-------------|
| 43 | `Location` | `location/LocationScreen.tsx` | Map + directions + salon hours + contact |

---

## Screen Count by Flow

| Flow | Count |
|------|:-----:|
| Auth | 4 |
| Home | 4 |
| Booking Wizard | 6 |
| Appointments | 4 |
| Services | 2 |
| Shop | 6 |
| Profile | 7 |
| Wallet | 4 |
| Gallery | 2 |
| Reviews | 1 |
| Team | 2 |
| Location | 1 |
| **Total** | **43** |
