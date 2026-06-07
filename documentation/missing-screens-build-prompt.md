# 🧑‍💻 Senior React Native Developer Prompt
## Build Missing Screens — SalonBooking Customer App

---

## 📌 Role & Context

You are a **senior React Native developer with 15+ years of production experience** in mobile
architecture, UI/UX engineering, TypeScript, Expo, and React Navigation. You are working on an
**already existing, partially built** React Native salon booking app called `salon-customer-app`.

> **Do NOT start from scratch. Do NOT reinvent the design system. Do NOT change any existing
> screen. Your only job is to build the 10 missing screens listed below, connect them to the
> existing navigation, and make every transition, state, and edge case work flawlessly.**

---

## 🏗️ Project Stack (already in use — match exactly)

| Layer | Technology |
|---|---|
| Framework | React Native `0.81.5` + Expo `~54.0.0` |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation v6 — Stack + Bottom Tabs |
| Animations | React Native Reanimated 2 + core `Animated` API |
| State | Zustand (`authStore`, `bookingStore`, `notificationStore`) |
| Styling | StyleSheet — NO external CSS libraries |
| Icons | `@expo/vector-icons` (Ionicons set) |
| Maps | `react-native-maps` |
| Safe Area | `react-native-safe-area-context` |

---

## 🎨 Design System — Follow Exactly, No Exceptions

### Brand Colors
```ts
const COLORS = {
  primary:       '#FF5C8A',   // Salon Pink — CTAs, active states, gradients
  primaryDark:   '#FF3366',   // Gradient end, pressed state
  primaryLight:  '#FFF0F5',   // Tinted backgrounds, chips
  success:       '#10B981',
  warning:       '#F59E0B',
  error:         '#EF4444',
  info:          '#3B82F6',
  background:    '#F7F8FC',   // Screen background
  surface:       '#FFFFFF',   // Cards, sheets
  textPrimary:   '#0F172A',
  textSecondary: '#64748B',
  textTertiary:  '#94A3B8',
  border:        '#E2E8F0',
}
```

### Typography
```ts
// Screen titles: fontSize 26–28, fontWeight '800'
// Section titles: fontSize 17–18, fontWeight '800'
// Card titles: fontSize 15–16, fontWeight '700'
// Body: fontSize 14–15, fontWeight '400'–'600'
// Labels/meta: fontSize 11–13, fontWeight '500'–'700'
// Badges/tags: fontSize 10–12, fontWeight '800'
```

### UI Patterns
```ts
// Card border radius: 18–22
// Button border radius: 14–20
// Card shadow: elevation 2–4, shadowOpacity 0.04–0.08
// Press feedback: scale 0.96 spring animation on every Pressable
// Success check animation: Animated.spring scale 0 → 1, tension 55
// FAB pulse: Animated.loop scale 1 → 1.08 → 1, 900ms
```

### Shared Components Available (import and reuse — do NOT recreate)
```
src/components/common/Button.tsx         ← primary CTA button
src/components/common/Card.tsx           ← pressable card wrapper
src/components/common/Input.tsx          ← text input
src/components/layout/ScreenHeader.tsx   ← back arrow + title header
src/components/booking/BookingProgress.tsx ← step indicator (steps 1–4)
src/components/booking/BookingCard.tsx   ← booking list item
src/components/profile/ProfileCard.tsx
src/components/profile/MenuButton.tsx
```

---

## 📂 Existing Navigation Structure (do NOT modify — only add to it)

```
RootNavigator
├── AuthStack
│   ├── Splash, Onboarding, Login, OTPVerification
│
└── MainStack ── BottomTabs
    ├── HomeTab → HomeStack
    │   ├── Home, Search, SalonList, SalonDetail
    │   ├── Reviews, Gallery → ImageViewer
    │   ├── Team → ArtistProfile
    │   ├── Location
    │   └── BookingWizard (nested stack)
    │       ├── ServiceSelection → StaffSelection
    │       → SlotSelection → BookingSummary
    │       → Payment → BookingSuccess  ← [MISSING: add here]
    │
    ├── ServicesTab → ServicesStack
    │   └── ServicesCatalogue → ServiceDetail
    │
    ├── BookingsTab → BookingsStack
    │   ├── BookingList → BookingDetail
    │   ├── Reschedule
    │   └── WriteReview  ← [MISSING: add here]
    │
    ├── ShopTab → ShopStack
    │   ├── ProductList → ProductDetail
    │   ├── Cart → Checkout → OrderConfirmed
    │   └── OrderTracking  ← [MISSING: add here]
    │
    └── ProfileTab → ProfileStack
        ├── Profile → EditProfile
        ├── Addresses → AddAddress  ← [MISSING: add here]
        ├── Settings
        ├── Notifications  ← [MISSING: add here]
        ├── Help  ← [MISSING: add here]
        └── WalletStack
            ├── WalletHome
            ├── AddMoney  ← [MISSING: add here]
            ├── TransactionHistory  ← [MISSING: add here]
            └── Referral  ← [MISSING: add here]
```

---

## 📋 Execution Plan — Phased Build

> Read this plan fully. Build in order. Do not skip phases. Do not mix phases.
> After each phase, confirm the screens render, navigate correctly, and show no
> TypeScript errors before starting the next phase.

---

## ✅ PHASE 1 — Critical Journey Completions (P0)
> These 3 screens complete broken user journeys. Nothing else should be built before these.

---

### Screen 14 — `BookingSuccessScreen.tsx`
**Path:** `src/screens/booking/BookingSuccessScreen.tsx`
**Route:** `BookingSuccess` (last step of BookingWizard nested stack)
**Navigates from:** `PaymentScreen` on successful payment
**Navigates to:** `BookingList` tab (via `navigation.reset` — user cannot go back to payment)

**UI Requirements:**
- Full-screen white background with safe area
- Top section (60% of screen):
  - Large animated green checkmark circle — use `Animated.spring` scale `0 → 1`, tension 55,
    friction 6. Circle is `#10B981`, check icon is white, diameter 100px
  - Below check: heading `"Booking Confirmed!"` — fontSize 26, fontWeight '800', color `#0F172A`
  - Sub-text: `"Your appointment has been successfully booked"` — fontSize 15, color `#64748B`
  - Booking ID chip: pill-shaped badge showing `Booking #SL-XXXXXX` — background `#FFF0F5`,
    text `#FF5C8A`, fontWeight '700', fontSize 13, border radius 99, padding 6px 16px
- Middle section — appointment summary card (Card component, border radius 20, elevation 3):
  - Row: 📅 Date — e.g. "Saturday, 14 June 2024"
  - Row: ⏰ Time — e.g. "10:00 AM"
  - Row: 💆 Service — e.g. "Haircut + Color"
  - Row: 👩 Artist — e.g. "Anjali Sharma"
  - Row: 📍 Location — e.g. "Main Branch, CG Road"
  - Each row: icon (Ionicons, 18px, `#FF5C8A`) + label (color `#64748B`) + value (color `#0F172A`,
    fontWeight '600') — all in a horizontal flex row, borderBottom between rows
- Stagger-animate each row: `fadeIn + translateY(20 → 0)` with 120ms delay between rows
- Bottom section (sticky, above safe area):
  - Primary button: `"View My Bookings"` → navigates to `BookingList` tab, resets wizard stack
  - Secondary link: `"Back to Home"` → navigates to `Home` tab
  - Add to Calendar link (optional, grey text)
- No back arrow. No bottom tab bar visible (full immersive success screen).

**State / Data:**
- Receive `bookingId`, `serviceNames`, `staffName`, `date`, `timeSlot`, `salonName` as
  route params from `PaymentScreen`
- Clear `bookingStore` state after screen mounts

---

### Screen 18 — `WriteReviewScreen.tsx`
**Path:** `src/screens/bookings/WriteReviewScreen.tsx`
**Route:** `WriteReview`
**Navigates from:** `BookingDetail` screen (only for bookings with status `"completed"`)
**Navigates to:** Back to `BookingDetail` on submit

**UI Requirements:**
- `ScreenHeader` component at top: back arrow + title `"Write a Review"`
- Background: `#F7F8FC`
- Scrollable content:
  - Service & artist summary card (non-editable, shows what they're reviewing):
    - Artist circular avatar (48px) + name + service name + date — all in a Card component
  - Overall rating section:
    - Label: `"Rate your experience"` — fontSize 17, fontWeight '800'
    - 5 large interactive star icons — Ionicons `star` / `star-outline`, size 44px
    - Active stars: `#F59E0B` (warning yellow). On tap, fill stars 1 through selected index.
    - Below stars: dynamic label text that changes per rating:
      - 1 star: `"Poor"` (red), 2: `"Fair"` (orange), 3: `"Good"` (yellow),
        4: `"Very Good"` (teal), 5: `"Excellent!"` (green)
    - Each star gets a `scale: 0.8 → 1.2 → 1` spring bounce animation on selection
  - Rating category rows (3 items, horizontal):
    - `"Cleanliness"`, `"Staff Behavior"`, `"Value for Money"` — each has its own 5-star row
      (smaller stars, size 20px)
  - Written review section:
    - Label: `"Share your experience (optional)"`
    - Multi-line `Input` component, minHeight 120px, maxLength 500
    - Character counter bottom-right: `"0 / 500"`, color `#94A3B8`
  - Photo attachment row:
    - Label: `"Add Photos (optional)"`
    - `+` button opens image picker (mock/placeholder — no real upload needed)
    - Show selected image thumbnails (60×60px, rounded 8px) in a horizontal row
- Bottom sticky bar:
  - Disabled state: `"Submit Review"` button greyed if overall rating is 0
  - Enabled: `#FF5C8A` primary button once at least 1 star is selected
  - On submit: show inline loading spinner for 1s, then `navigation.goBack()` with a success toast
- API call on submit: `POST /bookings/:id/review` with `{ rating, comment, categories }`

**Validation:**
- Overall star rating required (1–5) before submit button activates
- Comment is optional
- Show error toast if API fails

---

### Screen 26 — `OrderTrackingScreen.tsx`
**Path:** `src/screens/shop/OrderTrackingScreen.tsx`
**Route:** `OrderTracking`
**Navigates from:** `OrderConfirmed` screen ("Track Your Order" button) or `BookingList`
**Navigates to:** Back only

**UI Requirements:**
- Header: gradient background `['#FF5C8A', '#FF3366']` (use `expo-linear-gradient`),
  contains back arrow (white) + title `"Track Order"` (white, fontWeight '800') +
  order number subtitle (white, fontSize 13, opacity 0.85)
- ETA chip inside header: pill badge `"Arriving in ~30 mins"` — white bg, `#FF5C8A` text
- Map placeholder section (height 200px): grey rounded card with map pin icon centered +
  text `"Live map tracking coming soon"` — use `react-native-maps` MapView if available,
  otherwise show styled placeholder. Show delivery partner's approximate location pin.
- Delivery partner card (Card component, elevation 3):
  - Left: circular avatar placeholder (48px) + name `"Rajesh K."` + vehicle `"Two-wheeler"`
  - Right: two icon buttons side by side — 📞 Call (green circle) + 💬 Message (blue circle)
  - Both buttons: 44px circular, elevation 2, press scale 0.96 animation
- Order timeline (animated 5-step vertical stepper):
  - Step 1: ✅ `"Order Placed"` + timestamp
  - Step 2: ✅ `"Payment Confirmed"` + timestamp
  - Step 3: ✅ `"Being Packed"` + timestamp (in progress — pulsing dot)
  - Step 4: ⏳ `"Out for Delivery"` (upcoming — grey)
  - Step 5: ⏳ `"Delivered"` (upcoming — grey)
  - Completed steps: `#10B981` filled circle + green vertical line connector
  - Active step: pulsing `#FF5C8A` dot animation (`Animated.loop`, scale 1 → 1.3 → 1)
  - Upcoming steps: `#E2E8F0` circle + grey line
  - Stagger-animate all steps on mount: `fadeIn + slideLeft` with 150ms delay between steps
- Delivery address card: 📍 icon + label `"Delivering to"` + full address text
- Order items summary (collapsed accordion, expand on tap):
  - Shows count: `"2 items · ₹1,798"` with chevron
  - Expanded: list of item name + qty + price per item
  - Bottom: subtotal, delivery fee, discount, total
- Help section at bottom: `"Need Help?"` link → navigates to `Help` screen
- API call on mount: `GET /orders/:id/track` — use mock data if API unavailable

---

## ✅ PHASE 2 — Profile & Navigation Gap Fixes (P1)

> Build these 5 screens after Phase 1 is complete and tested.

---

### Screen 32 — `NotificationsScreen.tsx`
**Path:** `src/screens/profile/NotificationsScreen.tsx`
**Route:** `Notifications`
**Navigates from:** Bell icon in `ProfileScreen` header (badge count from `notificationStore`)
**Navigates to:** Relevant screen on notification tap (e.g. booking detail, offer screen)

**UI Requirements:**
- `ScreenHeader`: back arrow + title `"Notifications"` + right action `"Mark all read"` (text
  button, `#FF5C8A`, only shown when unread count > 0)
- Empty state: centered bell icon (Ionicons, 64px, `#E2E8F0`) + `"No notifications yet"` heading +
  sub-text `"We'll notify you about bookings, offers, and updates"` — shown when list is empty
- Notification list grouped by date section headers (`"Today"`, `"Yesterday"`, `"Earlier"`):
  - Each notification item (Pressable, scale 0.98 on press):
    - Left: icon circle (44px) — different color/icon per type:
      - Booking reminder: 📅 blue circle (`#EFF6FF`)
      - Offer/promo: 🏷 pink circle (`#FFF0F5`)
      - Booking confirmed: ✅ green circle (`#F0FDF4`)
      - Payment: 💳 purple circle
      - System: ℹ️ grey circle
    - Center: notification title (fontWeight '700' if unread, '400' if read) + body text
      (2 lines max, ellipsis) + timestamp (fontSize 12, color `#94A3B8`)
    - Right: blue dot (8px) for unread, nothing for read
    - Background: `#FFFBFC` for unread, `#F7F8FC` for read
    - Swipe-to-delete gesture (optional): `react-native-gesture-handler` swipeable
  - Tap navigates to relevant screen based on `notification.type` and `notification.linkId`
- On mount: call `notificationStore.markAllRead()` after 2s delay (auto mark as seen)
- API: `GET /notifications` on mount, `PATCH /notifications/:id/read` on tap

---

### Screen 33 — `HelpScreen.tsx`
**Path:** `src/screens/profile/HelpScreen.tsx`
**Route:** `Help`
**Navigates from:** `ProfileScreen` "Help & Support" menu item
**Navigates to:** External links (WhatsApp, email, call) via `Linking.openURL`

**UI Requirements:**
- `ScreenHeader`: back arrow + title `"Help & Support"`
- Search bar at top: `"Search FAQs..."` — filters FAQ items in real time
- FAQ section (accordion list) — `"Frequently Asked Questions"`:
  - At least 8 pre-written FAQ items covering:
    - How to book an appointment
    - How to cancel or reschedule
    - Refund policy
    - Wallet top-up and usage
    - How to use promo codes
    - Salon location and working hours
    - How to change profile details
    - App technical issues
  - Each FAQ item is a Pressable row: question text + chevron icon
  - On tap: expand/collapse animated panel (height 0 → auto, `LayoutAnimation.easeInEaseOut`)
    showing the answer text (fontSize 14, color `#64748B`, lineHeight 22)
  - Active FAQ: chevron rotates 180°, question text becomes `#FF5C8A`
  - Only one FAQ open at a time (accordion behaviour — close previous on new tap)
- Contact us section (below FAQs):
  - Section title: `"Still need help?"`
  - Three contact option cards in a row (equal width):
    - 💬 WhatsApp: opens `https://wa.me/919876543210`
    - 📧 Email: opens `mailto:hello@salonname.com`
    - 📞 Call: opens `tel:+919876543210`
  - Each card: icon (44px circle, `#FFF0F5` bg, `#FF5C8A` icon) + label below
- Working hours card (bottom of scroll):
  - Title: `"Salon Hours"`
  - Mon–Sat: 9:00 AM – 8:00 PM
  - Sunday: 10:00 AM – 6:00 PM
  - Show today's hours highlighted in `#FF5C8A`

---

### Screen 30 — `AddAddressScreen.tsx`
**Path:** `src/screens/profile/AddAddressScreen.tsx`
**Route:** `AddAddress`
**Navigates from:** `AddressesScreen` (`+` FAB button or "Edit" on existing address)
**Navigates to:** Back to `AddressesScreen` on save
**Params:** Optional `address` object (if editing existing — pre-fill all fields)

**UI Requirements:**
- `ScreenHeader`: back arrow + title `"Add Address"` (or `"Edit Address"` if editing)
- Scrollable form using `Input` shared component:
  - Full Name field (required) — pre-fill from user profile
  - Phone Number field (required, numeric keyboard) — pre-fill from user profile
  - Pincode field (required, numeric, maxLength 6) — on blur, auto-fetch city/state
  - Address Line 1 field (required) — house/flat/building
  - Address Line 2 field (optional) — street/area/landmark
  - City field (required, auto-filled from pincode lookup)
  - State field (required, auto-filled from pincode lookup)
  - Address type selector — horizontal pill toggles: `[Home] [Work] [Other]`
    - Active pill: `#FF5C8A` background, white text
    - Inactive pill: `#F7F8FC` background, `#64748B` text, `#E2E8F0` border
  - "Set as Default Address" toggle switch (`Switch` component, track color `#FF5C8A`)
- Validation:
  - Required fields highlighted in red border + error message below if empty on save
  - Pincode must be exactly 6 digits
  - Phone must be exactly 10 digits
- Bottom sticky save button:
  - `"Save Address"` — `#FF5C8A` primary button, full width, borderRadius 16
  - Shows loading spinner while saving
  - On success: navigate back with success toast `"Address saved!"`
- API: `POST /profile/addresses` (new) or `PATCH /profile/addresses/:id` (edit)

---

## ✅ PHASE 3 — Wallet Flow Completion (P1 + P2)

> Build these 3 screens after Phase 2 is complete. The Wallet flow is accessed via
> `ProfileScreen → WalletStack`. These screens must share a unified wallet design language.

---

### Screen 35 — `AddMoneyScreen.tsx`
**Path:** `src/screens/wallet/AddMoneyScreen.tsx`
**Route:** `AddMoney`
**Navigates from:** `WalletHomeScreen` "Add Money" button
**Navigates to:** Back to `WalletHomeScreen` on success (with updated balance)

**UI Requirements:**
- `ScreenHeader`: back arrow + title `"Add Money"`
- Current balance display (top card, `#FF5C8A` gradient background):
  - Label: `"Current Balance"` (white, fontSize 13)
  - Amount: `"₹984"` (white, fontSize 32, fontWeight '800')
- Quick amount chips row: `[₹100] [₹200] [₹500] [₹1000] [₹2000]`
  - Selecting a chip auto-fills the amount input
  - Active chip: `#FF5C8A` bg, white text. Inactive: white bg, `#64748B` text, `#E2E8F0` border
- Custom amount input:
  - Label: `"Or enter custom amount"`
  - `₹` prefix inside input field
  - Numeric keyboard, maxLength 5
  - Min ₹10, Max ₹50,000 — show inline error if out of range
- Payment method selection (radio list):
  - UPI (GPay / PhonePe / Paytm) — radio option with logos
  - Debit / Credit Card — radio with card icon
  - Net Banking — radio with bank icon
  - Each option: radio circle (selected: `#FF5C8A` filled, unselected: `#E2E8F0` border) +
    icon + label — horizontal row, Card component, elevation 1
- Promo/offer banner (optional): `"Add ₹500 and get ₹50 cashback!"` — small `#FFF0F5` card
- Bottom sticky button: `"Add ₹[amount] to Wallet"` — updates dynamically as amount changes
  - Disabled (grey) if amount is 0 or invalid
  - On tap: show processing spinner 1.5s → success animation → navigate back with new balance
- API: `POST /wallet/add` with `{ amount, paymentMethod }`

---

### Screen 36 — `TransactionHistoryScreen.tsx`
**Path:** `src/screens/wallet/TransactionHistoryScreen.tsx`
**Route:** `TransactionHistory`
**Navigates from:** `WalletHomeScreen` "View History" button
**Navigates to:** No further navigation (terminal screen)

**UI Requirements:**
- `ScreenHeader`: back arrow + title `"Transaction History"`
- Filter tab bar below header: `[All] [Credit] [Debit]`
  - Active tab: `#FF5C8A` underline + `#FF5C8A` text. Inactive: `#64748B`
  - Switching tab filters the list in real time (no API call — filter local data)
- Summary chips row (3 chips, card background):
  - `"Total Credit ₹X,XXX"` — green text
  - `"Total Debit ₹X,XXX"` — red text
  - `"Net Balance ₹XXX"` — primary text
- Transaction list grouped by month section headers (`"June 2024"`, `"May 2024"` etc.):
  - Each transaction item:
    - Left icon circle (44px):
      - Credit (money added): ⬇ green circle (`#F0FDF4`, `#10B981` icon)
      - Debit (booking payment): ⬆ red circle (`#FEF2F2`, `#EF4444` icon)
      - Cashback: 🎁 pink circle
      - Referral bonus: 👥 purple circle
    - Center: transaction title (e.g. `"Booking Payment"`, `"Wallet Top-up"`) +
      sub-text (e.g. `"Booking #SL-001"` or `"Via UPI"`) + date + time
    - Right: amount — green `"+₹500"` for credit, red `"-₹799"` for debit, fontWeight '700'
  - Empty state per filter: `"No transactions"` with icon
- Infinite scroll / pagination: load 20 items at a time, `onEndReached` loads next page
- Pull-to-refresh (`RefreshControl`)
- API: `GET /wallet/transactions?type=all&page=1&limit=20`

---

### Screen 37 — `ReferralScreen.tsx`
**Path:** `src/screens/wallet/ReferralScreen.tsx`
**Route:** `Referral`
**Navigates from:** `WalletHomeScreen` "Refer & Earn" card
**Navigates to:** No further navigation — share sheet via `Share.share()`

**UI Requirements:**
- `ScreenHeader`: back arrow + title `"Refer & Earn"`
- Hero section (gradient background `['#FF5C8A', '#FF3366']`, rounded bottom corners 24px):
  - Gift icon (Ionicons `gift-outline`, 64px, white)
  - Heading: `"Earn ₹100 for every friend you refer!"` (white, fontSize 22, fontWeight '800',
    centered, maxWidth 260px)
  - Sub-text: `"Your friend gets ₹50 on first booking too"` (white, opacity 0.85, fontSize 14)
- How it works section (3 horizontal steps):
  - Step 1: Share icon + `"Share your code"`
  - Step 2: Friend icon + `"Friend signs up"`
  - Step 3: Wallet icon + `"You earn ₹100"`
  - Each step: circle number badge (`#FF5C8A`) + icon + label — card with elevation 2
- Referral code card (Card, elevation 3, dashed border `#FF5C8A`):
  - Label: `"Your Referral Code"` (fontSize 13, `#64748B`)
  - Code: `"PRIYA100"` (fontSize 28, fontWeight '800', `#FF5C8A`, letter-spacing 4)
  - Copy button (right): Ionicons `copy-outline`, tap copies to clipboard + shows
    `"Copied!"` toast for 2s, icon changes to `checkmark` briefly
- Share button: `"Share with Friends"` — `#FF5C8A` primary button, full width, opens
  `Share.share({ message: 'Use my code PRIYA100 and get ₹50 off your first salon booking! ...' })`
- Referral history section:
  - Section title: `"Your Referrals"` + count badge (e.g. `"3"`)
  - List of referred friends:
    - Avatar (initials circle) + name + date joined + status chip:
      - `"Pending"` (yellow chip, friend signed up but not booked yet)
      - `"Earned ₹100"` (green chip, friend completed first booking)
  - Empty state: `"No referrals yet"` with share illustration
- Terms in small text at bottom: `"Terms & Conditions apply. Referral bonus credited within 24hrs."`

---

## ✅ PHASE 4 — Navigation Wiring & Type Safety

> After all screens are built, do the following wiring tasks. Do NOT skip.

### 4.1 — Register all new routes in navigation types file
```ts
// src/navigation/types.ts — add these to the correct stack param lists:

// BookingStackParamList:
BookingSuccess: {
  bookingId: string;
  serviceNames: string[];
  staffName: string;
  date: string;
  timeSlot: string;
  salonName: string;
};

// BookingsStackParamList:
WriteReview: {
  bookingId: string;
  serviceName: string;
  staffName: string;
  staffAvatar?: string;
  completedDate: string;
};

// ShopStackParamList:
OrderTracking: {
  orderId: string;
};

// ProfileStackParamList:
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
};
Notifications: undefined;
Help: undefined;

// WalletStackParamList:
AddMoney: undefined;
TransactionHistory: undefined;
Referral: undefined;
```

### 4.2 — Register screens in navigator files
Add each new screen to its stack navigator `<Stack.Screen>` list. Match `name` exactly to the
route name used in `navigation.navigate()` calls throughout the existing codebase.

### 4.3 — Wire entry points (confirm these touch points exist in existing screens)
| New Screen | Entry Point | Existing File |
|---|---|---|
| `BookingSuccess` | Called from `PaymentScreen` after `POST /bookings` returns 200 | `src/screens/booking/PaymentScreen.tsx` |
| `WriteReview` | "Write Review" button in `BookingDetail` (only if status `=== 'completed'`) | `src/screens/bookings/BookingDetailScreen.tsx` |
| `OrderTracking` | "Track Your Order" button in `OrderConfirmed` | `src/screens/shop/OrderConfirmedScreen.tsx` |
| `AddAddress` | FAB `+` button in `AddressesScreen` + "Edit" swipe action | `src/screens/profile/AddressesScreen.tsx` |
| `Notifications` | Bell icon + badge in `ProfileScreen` header | `src/screens/profile/ProfileScreen.tsx` |
| `Help` | "Help & Support" `MenuButton` in `ProfileScreen` | `src/screens/profile/ProfileScreen.tsx` |
| `AddMoney` | "Add Money" button in `WalletHomeScreen` | `src/screens/wallet/WalletHomeScreen.tsx` |
| `TransactionHistory` | "View History" button in `WalletHomeScreen` | `src/screens/wallet/WalletHomeScreen.tsx` |
| `Referral` | "Refer & Earn" card in `WalletHomeScreen` | `src/screens/wallet/WalletHomeScreen.tsx` |

### 4.4 — Update `notificationStore`
Confirm `notificationStore.ts` has:
- `unreadCount: number` — used for badge on Profile tab icon
- `notifications: Notification[]`
- `markAllRead()` action
- `markOneRead(id: string)` action
If any are missing, add them.

### 4.5 — Update `notificationStore` badge wiring
In the bottom tab navigator, the Profile tab icon must show a red badge when
`notificationStore.unreadCount > 0`. Verify this is wired. If not, add it:
```tsx
tabBarBadge: unreadCount > 0 ? unreadCount : undefined
```

---

## ✅ PHASE 5 — Quality Assurance Checklist

> Run through every item before marking the task complete.

### Navigation
- [ ] Every new screen navigates back correctly (hardware back + header back arrow)
- [ ] `BookingSuccess` resets the wizard stack (user cannot press back to `Payment`)
- [ ] `WriteReview` submit navigates back to `BookingDetail` — not to `BookingList`
- [ ] `OrderTracking` deep-links correctly from `OrderConfirmed`
- [ ] Notification tap routes to correct screen based on `notification.type`

### UI / Design
- [ ] All new screens use `#F7F8FC` as screen background (matches existing screens)
- [ ] All new screens use `ScreenHeader` shared component (not custom headers)
- [ ] All cards use border radius 18–22 and elevation 2–4 (matches existing cards)
- [ ] All primary buttons are `#FF5C8A` with borderRadius 14–20
- [ ] Safe area insets respected on all new screens (`useSafeAreaInsets()`)
- [ ] Keyboard `ScrollView` / `KeyboardAvoidingView` used on all form screens
  (`AddAddressScreen`, `WriteReviewScreen`, `AddMoneyScreen`)
- [ ] Every `Pressable` has `scale: 0.96` press feedback animation

### State & Data
- [ ] `BookingSuccess` clears `bookingStore` on mount
- [ ] `notificationStore.unreadCount` badge updates when `NotificationsScreen` is visited
- [ ] `AddAddress` pre-fills fields correctly when editing an existing address
- [ ] `TransactionHistory` filter tabs filter local data (no extra API calls per filter)
- [ ] `WriteReview` submit button disabled until rating ≥ 1 star

### TypeScript
- [ ] Zero TypeScript errors (`npx tsc --noEmit` passes)
- [ ] All route params are typed in `src/navigation/types.ts`
- [ ] No use of `any` type in new files
- [ ] All Zustand store actions have typed signatures

### Performance
- [ ] `FlatList` used (not `map`) for all lists longer than 5 items
  (`TransactionHistory`, `Notifications`, `HelpScreen FAQ`)
- [ ] `useCallback` on `FlatList` `renderItem` and `keyExtractor`
- [ ] `BookingSuccess` animations cleaned up on `useEffect` return
- [ ] No inline anonymous functions passed as props in render

---

## 📦 Demo / Mock Data to Use

```ts
// Booking Success
bookingId: 'SL-20240614-001'
serviceNames: ['Haircut', 'Color Treatment']
staffName: 'Anjali Sharma'
date: 'Saturday, 14 June 2024'
timeSlot: '10:00 AM'
salonName: 'Hair Ahmedabad – Main Branch'

// Order Tracking
orderId: 'ORD-20240614-088'
partnerName: 'Rajesh K.'
etaMinutes: 28
currentStep: 2 (0-indexed, so "Being Packed" is active)

// Notifications (mock array of 6)
[
  { id:'1', type:'booking', title:'Appointment Tomorrow', body:'Your haircut is at 10AM', read:false, time:'2h ago' },
  { id:'2', type:'offer',   title:'Weekend Special 20% Off', body:'Book any service this weekend', read:false, time:'5h ago' },
  { id:'3', type:'booking', title:'Booking Confirmed', body:'Facial on 14 June confirmed', read:true, time:'1d ago' },
  { id:'4', type:'payment', title:'Payment Received', body:'₹799 paid for Haircut', read:true, time:'2d ago' },
  { id:'5', type:'system',  title:'New Branch Opening', body:'Visit our new Bopal branch', read:true, time:'3d ago' },
  { id:'6', type:'offer',   title:'Refer & Earn ₹100', body:'Invite friends and earn wallet cash', read:true, time:'4d ago' },
]

// Wallet Transactions (mock 10 items)
[
  { id:'1', type:'credit', title:'Wallet Top-up', sub:'Via UPI', amount:500,  date:'14 Jun 2024, 10:30 AM' },
  { id:'2', type:'debit',  title:'Booking Payment', sub:'Booking #SL-001', amount:799, date:'14 Jun 2024, 10:00 AM' },
  { id:'3', type:'credit', title:'Referral Bonus', sub:'Riya joined', amount:100, date:'12 Jun 2024, 3:00 PM' },
  { id:'4', type:'debit',  title:'Product Purchase', sub:'Order #ORD-088', amount:899, date:'10 Jun 2024, 5:15 PM' },
  { id:'5', type:'credit', title:'Cashback', sub:'Weekend offer', amount:50,  date:'8 Jun 2024, 12:00 PM' },
]
```

---

## ⚠️ Hard Rules — Never Violate

1. **Never modify any existing screen file** — only add new files and update navigators/types
2. **Never install new packages** without checking if equivalent already exists in `package.json`
3. **Always use shared components** (`Button`, `Card`, `Input`, `ScreenHeader`) — do not
   rebuild these from scratch in new screen files
4. **Always use the exact color tokens** defined above — no hardcoded colors outside this spec
5. **Always add TypeScript types** for every route param — never use `any` or untyped params
6. **Never use inline styles for repeated patterns** — extract to a `styles` object at the
   bottom of each file using `StyleSheet.create({})`
7. **Test navigation in both directions** — navigate to and navigate back from every new screen

---

*Prompt version: 1.0 · Project: salon-customer-app · Screens to build: 10 · Phases: 5*
*Design reference: Salon UI Design image (dark teal + white, ~40 screens visible)*
*SCREENS.md total: 43 · Created: 33 · Remaining: 10*
