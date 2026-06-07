# 📦 Data Models & Types

All domain models are in `src/types/models.ts`. All navigation param lists are in `src/types/navigation.ts`.

---

## Core Domain Models

### `User`
```ts
interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  loyaltyPoints: number;
  walletBalance: number;
}
```

### `Salon`
```ts
interface Salon {
  id: string;
  name: string;
  description: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  rating: number;
  reviewCount: number;
  distance?: string;
  isOpen: boolean;
  images: string[];
  services: SalonService[];
  staff: Staff[];
}
```

### `SalonService`
```ts
interface SalonService {
  id: string;
  name: string;
  category: 'hair' | 'skin' | 'body' | 'nails' | 'makeup' | 'massage';
  price: number;
  duration: number;   // minutes
  description?: string;
  image?: string;
  isFeatured?: boolean;
}
```

### `Staff`
```ts
interface Staff {
  id: string;
  name: string;
  role: string;
  specialization: string;
  rating: number;
  clientCount: number;
  avatar?: string;
  isAvailable: boolean;
  experience?: string;
}
```

### `Booking`
```ts
interface Booking {
  id: string;
  salonId: string;
  userId: string;
  serviceNames: string[];
  staffName?: string;
  bookingDate: string;      // ISO date string
  startTime: string;        // 'HH:MM AM/PM'
  endTime: string;
  totalAmount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
}
```

### `WalletTransaction`
```ts
interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND';
  amount: number;
  description: string;
  referenceId?: string;
  createdAt: string;        // ISO datetime string
}
```

### `Notification`
```ts
interface Notification {
  id: string;
  type: 'booking' | 'offer' | 'reminder' | 'wallet' | 'loyalty';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;        // ISO datetime string
  data?: {
    bookingId?: string;
    productId?: string;
    offerId?: string;
  };
}
```

### `Product`
```ts
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description?: string;
  sizes?: string[];
  inStock: boolean;
}
```

### `Address`
```ts
interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}
```

---

## Navigation Param Lists

```ts
// src/types/navigation.ts

type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  OTPVerification: { phone: string };
};

type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  SalonList: Record<string, never>;
  SalonDetail: { id: string };
  ServiceDetail: { service: any };
  ServiceSelection: { salonId: string };
  StaffSelection: { salonId: string };
  SlotSelection: { salonId: string; staffId?: string | null };
  BookingSummary: { salonId: string; staffId?: string | null; date: string; time: string };
  Payment: { bookingData: any };
  BookingSuccess: { bookingId: string };
  Reviews: undefined;
  Gallery: undefined;
  ImageViewer: { imageUri: string };
  Team: undefined;
  ArtistProfile: { artist: any };
  Location: undefined;
};

type BookingsStackParamList = {
  BookingList: undefined;
  BookingDetail: { id: string };
  Reschedule: { bookingId: string };
  WriteReview: { bookingId: string };
};

type WalletStackParamList = {
  WalletHome: undefined;
  AddMoney: undefined;
  TransactionHistory: undefined;
  Referral: undefined;
};

type ShopStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: any; id?: string };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmed: { orderId: string };
  OrderTracking: { orderId: string };
};

type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: {
    address?: {
      id: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      type: 'home' | 'work' | 'other';
      isDefault: boolean;
    };
  } | undefined;
  Settings: undefined;
  Notifications: undefined;
  Help: undefined;
};
```

---

## Demo Data

All demo data lives in `src/data/demo.ts`. Exported constants:

| Constant | Type | Description |
|----------|------|-------------|
| `DEMO_USER` | `User` | Default user — Priya Sharma |
| `DEMO_SALONS` | `Salon[]` | 3 salons |
| `DEMO_SERVICES` | `SalonService[]` | 15+ services across 6 categories |
| `DEMO_STAFF` | `Staff[]` | 4 stylists |
| `DEMO_BOOKINGS` | `Booking[]` | 6 bookings (mix of statuses) |
| `DEMO_NOTIFICATIONS` | `Notification[]` | 6 notifications |
| `DEMO_TRANSACTIONS` | `WalletTransaction[]` | 8 transactions |
| `DEMO_WALLET` | `{ balance: number; points: number }` | Wallet state |
| `DEMO_PRODUCTS` | `Product[]` | 12 salon products |
