# 🌐 API Integration

The app ships in **full demo mode** — no backend required. All data comes from `src/data/demo.ts`.

---

## Switching to Live API

1. Set `API_URL` in `.env` (default: `http://localhost:5000/api/v1`)
2. Replace demo data calls in each screen with Axios calls
3. Update `authStore.login()` to call real OTP endpoints

---

## Environment Variables (`.env`)

```env
API_URL=http://localhost:5000/api/v1
API_TIMEOUT=30000

RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx

GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:android:xxxxxxxxxxxxx

NODE_ENV=development
```

---

## Expected Backend Endpoints

### Auth
```
POST  /auth/send-otp          { phone }
POST  /auth/verify-otp        { phone, otp }
```

### Salons
```
GET   /salons
GET   /salons/:id
GET   /salons/:id/services
GET   /salons/:id/staff
GET   /salons/:id/slots        ?date=&staffId=
```

### Bookings
```
POST  /bookings
GET   /bookings
GET   /bookings/:id
PATCH /bookings/:id/cancel
PATCH /bookings/:id/reschedule
POST  /bookings/:id/review
```

### Products & Orders
```
GET   /products
GET   /products/:id
POST  /orders
GET   /orders/:id/track
```

### Wallet
```
GET   /wallet
POST  /wallet/add              { amount, paymentMethod }
GET   /wallet/transactions     ?type=&page=&limit=
```

### Notifications
```
GET   /notifications
PATCH /notifications/:id/read
```

### Profile
```
GET   /profile
PATCH /profile
POST  /profile/addresses
PATCH /profile/addresses/:id
```

---

## Axios Setup (when ready)

Create `src/lib/api.ts`:

```ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## Payment Integration (Razorpay)

The `PaymentScreen` is pre-structured for Razorpay. When ready:

1. Install `react-native-razorpay`
2. Set `RAZORPAY_KEY` in `.env`
3. Replace the mock payment handler in `PaymentScreen.tsx` with:

```ts
import RazorpayCheckout from 'react-native-razorpay';

const options = {
  description: 'Salon Booking',
  currency: 'INR',
  key: process.env.RAZORPAY_KEY,
  amount: totalAmount * 100,  // paise
  name: 'Hair Ahmedabad',
  order_id: serverOrderId,    // from POST /orders
  prefill: { contact: user.phone, email: user.email },
  theme: { color: '#FF5C8A' },
};

RazorpayCheckout.open(options)
  .then((data) => { /* navigate to BookingSuccess */ })
  .catch((error) => { /* show error */ });
```
