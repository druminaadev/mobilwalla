# 🗺 Navigation Architecture

All navigation uses **React Navigation v6** with Native Stack + Bottom Tabs.

---

## Navigator Tree

```
RootNavigator  (src/navigation/index.tsx)
│
├── AuthStack                              — unauthenticated users
│   ├── Splash
│   ├── Onboarding
│   ├── Login
│   └── OTPVerification  { phone: string }
│
└── MainStack ── BottomTabNavigator        — authenticated users
    │
    ├── HomeTab → HomeStack
    │   ├── Home
    │   ├── Search
    │   ├── SalonList
    │   ├── SalonDetail       { id: string }
    │   ├── ServiceDetail     { service: any }
    │   ├── Reviews
    │   ├── Gallery
    │   │   └── ImageViewer   { imageUri: string }
    │   ├── Team
    │   │   └── ArtistProfile { artist: any }
    │   ├── Location
    │   └── Booking Wizard (nested in HomeStack)
    │       ├── ServiceSelection  { salonId }
    │       ├── StaffSelection    { salonId }
    │       ├── SlotSelection     { salonId, staffId? }
    │       ├── BookingSummary    { salonId, staffId?, date, time }
    │       ├── Payment           { bookingData }
    │       └── BookingSuccess    { bookingId }
    │
    ├── ServicesTab → ServicesStack
    │   ├── ServicesCatalogue
    │   ├── ServiceDetail     { service: any }
    │   └── ServiceBooking    { salonId, preSelectedServiceId? }
    │
    ├── BookingsTab → BookingsStack
    │   ├── BookingList
    │   ├── BookingDetail     { id: string }
    │   ├── Reschedule        { bookingId: string }
    │   └── WriteReview       { bookingId: string }
    │
    ├── ShopTab → ShopStack
    │   ├── ProductList
    │   ├── ProductDetail     { product: any, id?: string }
    │   ├── Cart
    │   ├── Checkout
    │   ├── OrderConfirmed    { orderId: string }
    │   └── OrderTracking     { orderId: string }
    │
    └── ProfileTab → ProfileStack
        ├── Profile
        ├── EditProfile
        ├── Addresses
        ├── AddAddress        { address?: AddressObject }
        ├── Settings
        ├── Notifications
        ├── Help
        └── (WalletStack — accessed via Profile menu navigate)
            ├── WalletHome
            ├── AddMoney
            ├── TransactionHistory
            └── Referral
```

---

## Bottom Tabs

| Tab | Label | Icon | Stack |
|-----|-------|------|-------|
| 1 | Home | `Home` | `HomeStack` |
| 2 | Services | `LayoutGrid` | `ServicesStack` |
| 3 | Bookings | `Calendar` | `BookingsStack` |
| 4 | Shop | `ShoppingBag` | `ShopStack` |
| 5 | Profile | `User` + badge | `ProfileStack` |

Active tint: `#FF5C8A`. Profile tab shows red unread notification badge from `notificationStore`.

---

## Navigation Types

All param lists are in `src/types/navigation.ts`. Every `navigation.navigate()` call is fully typed.

```ts
// Example — navigate from HomeStack to BookingSuccess
navigation.navigate('BookingSuccess', { bookingId: 'SL-001' });

// Example — navigate across tabs from inside HomeStack
navigation.getParent()?.navigate('BookingsTab', { screen: 'BookingList' });
```

---

## Auth Guard

`src/navigation/index.tsx` reads `authStore.isAuthenticated` and renders either `AuthStack` or `MainStack`. On app start, `authStore.checkAuth()` hydrates from AsyncStorage before the navigator mounts.

---

## Deep Linking

Config in `src/navigation/linking.ts`. Supported schemes:
```
salonapp://booking/:id
salonapp://product/:id
salonapp://wallet
```

---

## Common Navigation Patterns

### Reset stack after success screen
```ts
// BookingSuccess — user cannot go back to Payment
navigation.getParent()?.navigate('BookingsTab', { screen: 'BookingList' });
```

### Navigate back with result
```ts
// WriteReview → back to BookingDetail
navigation.goBack();
```

### Cross-tab navigation
```ts
// From any screen to BookingsTab
navigation.getParent()?.navigate('BookingsTab', {
  screen: 'BookingDetail',
  params: { id: bookingId },
});
```
