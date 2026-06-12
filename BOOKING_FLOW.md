# Booking Flows & Architecture

This document provides a comprehensive overview of the Booking module architecture in our Salon mobile application. It covers the folder structures, the creation flow, the management flow, navigation routing, and state management logic.

## 📂 Folder & Tech Structure

The booking feature is deliberately separated into two main directories to cleanly separate concerns between **creating a new booking** and **managing existing bookings**.

```text
src/screens/booking
├── BookingSuccessScreen.tsx
├── BookingSummaryScreen.tsx
├── PaymentScreen.tsx
├── ServiceSelectionScreen.tsx
├── SlotSelectionScreen.tsx
└── StaffSelectionScreen.tsx
src/screens/bookings
├── BookingDetailScreen.tsx
├── BookingListScreen.tsx
├── EReceiptScreen.tsx
├── MyBookingsScreen.tsx
├── RescheduleScreen.tsx
└── WriteReviewScreen.tsx
```

### 1. New Booking Flow (`src/screens/booking/`)
This directory contains screens responsible for the step-by-step creation of a new booking appointment.
- **`ServiceSelectionScreen.tsx`**: Allows users to select multiple salon services (e.g., Haircut, Spa).
- **`StaffSelectionScreen.tsx`**: Allows users to choose a preferred stylist/staff member (or 'Any Staff').
- **`SlotSelectionScreen.tsx`**: Presents a calendar and time slots to pick the appointment time.
- **`BookingSummaryScreen.tsx`**: A review screen detailing the selected services, staff, time, subtotal, discount, and total.
- **`PaymentScreen.tsx`**: Handles payment method selection (Card, UPI, Cash) and finalizes the order.
- **`BookingSuccessScreen.tsx`**: Success confirmation screen displaying the Booking ID and next steps.

### 2. Booking Management Flow (`src/screens/bookings/`)
This directory contains screens responsible for viewing and managing historical or upcoming bookings.
- **`MyBookingsScreen.tsx`**: The main Tab root (Upcoming, Completed, Cancelled).
- **`BookingDetailScreen.tsx`**: In-depth view of a specific booking with full status and timeline details.
- **`RescheduleScreen.tsx`**: Interface for changing the date/time of an upcoming 'pending' or 'confirmed' booking.
- **`WriteReviewScreen.tsx`**: Allows users to leave a rating and review for 'completed' bookings.
- **`EReceiptScreen.tsx`**: A downloadable/shareable digital receipt for completed bookings.
- **`BookingListScreen.tsx`**: An alternative list view.

### 3. State Management (`src/store/bookingStore.ts`)
We use **Zustand** to persist and manage the booking state across the creation flow. This prevents the need for excessive prop-drilling or large navigation parameter payloads.

**Key State Variables:**
- `salonId`, `salonName`, `salonImage`
- `services[]`: Array of selected services.
- `staff`: Selected staff member.
- `date`, `timeSlot`
- `coupon`: Applied discount.
- `specialInstructions`: User notes.

**Getters/Derivations:**
- `getSubtotal()`: Calculates total price of selected services.
- `getDiscount()`: Validates coupon and calculates discount.
- `getTotal()`: `Subtotal - Discount + Premium Charges`.
- `getTotalDuration()`: Accumulates time required for selected services.

---

## 🧭 Navigation & Routing

The application utilizes React Navigation natively. Because the booking flow can be initiated from multiple places (Home, Services, Offers), the booking creation screens are duplicated across several Stacks, whereas the management screens are isolated in their own tab.

### Booking Creation Navigation Flow
The standard progression for creating a new booking is linear:
1. `ServiceSelection`
2. `StaffSelection`
3. `SlotSelection`
4. `BookingSummary`
5. `Payment`
6. `BookingSuccess`

*Note: Depending on entry point, users may skip `ServiceSelection` (e.g., if they click "Book Now" on a specific service).*

### Booking Management Navigation Flow (`BookingsStack.tsx`)
Located inside the `BookingsTab` of the `MainTabParamList`.
- **Root**: `MyBookings`
- **Transitions**:
  - `MyBookings` -> `BookingDetail` (View full info)
  - `MyBookings` -> `Reschedule` (Change appointment)
  - `MyBookings` -> `WriteReview` (Leave feedback)
  - `MyBookings` -> `EReceipt` (View bill)
  - `MyBookings` -> `HomeTab` (Book Again action)

---

## 💡 Best Practices Implemented
- **Zustand Persistence**: Using `AsyncStorage`, if the user closes the app mid-booking, their selected services and slots are retained.
- **Type Safety**: All routing params and store data strictly adhere to the models defined in `src/types/models.ts` and `src/types/navigation.ts`.
- **Separation of Concerns**: Keeping `booking/` (creation) distinct from `bookings/` (management) prevents massive monolith files and convoluted routing logic.

---

# Salon Booking - Feature Recommendations & Business Impact

## 🎯 Feature Categories & Priority

### 🔴 CRITICAL (Must-Have) - Foundation Features
These features directly impact core booking functionality and retention.

#### 1. **Smart Service Bundles/Packages**
```
Feature: Offer pre-designed service combinations at discounted rates
Use Case: "Bridal Package" (Haircut + Facial + Makeup = ₹5000 instead of ₹6000)

Business Impact:
✓ Increase average order value (AOV) by 15-25%
✓ Reduce decision fatigue for customers
✓ Inventory management optimization

Components:
- Bundle editor (admin panel)
- Bundle showcase with savings indicator
- Seasonal bundle rotation
- Bundle recommendations on service selection
```

#### 2. **Smart Scheduling & Auto-Reschedule**
```
Feature: System suggests alternative slots if booked slot becomes unavailable

Business Impact:
✓ Reduce cancellations by 30%
✓ Prevent customer frustration
✓ Maximize staff utilization

Implementation:
- Real-time slot availability sync
- Push notification for unavailable bookings
- Auto-suggest 3 alternative times
- 1-tap rescheduling
```

#### 3. **Booking Confirmations & Reminders**
```
Feature: Multi-channel reminders (SMS, Push, Email)

Reminders:
- Booking confirmation (immediate)
- 24-hour before appointment
- 2-hour before appointment
- Post-service follow-up (feedback request)

Business Impact:
✓ Reduce no-shows by 40-50%
✓ Increase staff utilization
✓ Improve customer experience

Components:
- SMS gateway integration
- Push notification service
- Email templates
- Reminder preference settings
- Re-booking if cancelled
```

#### 4. **Cancellation & Rescheduling Policy**
```
Feature: Clear, transparent cancellation terms

Policy Tiers:
- Free cancellation up to 24 hours before
- ₹100 charge if cancelled 12-24 hours before
- 50% charge if cancelled 2-12 hours before
- Full charge if cancelled within 2 hours

Business Impact:
✓ Reduce last-minute cancellations
✓ Increase revenue protection
✓ Improve staff planning

Implementation:
- Policy display before booking
- Smart refund calculation
- Automatic charge deduction
```

#### 5. **Multi-Staff Assignment & Load Balancing**
```
Feature: Distribute bookings across staff members intelligently

Rules:
- Junior stylist 20% discount
- Senior stylist premium 10-15%
- Balance workload across team
- Highlight staff availability

Business Impact:
✓ Even revenue distribution
✓ Staff retention (fair load)
✓ Customer choice vs. recommendation balance
```

---

### 🟠 HIGH PRIORITY - Revenue & Retention

#### 6. **Loyalty Program / Points System**
```
Feature: Customers earn points per booking, redeem for discounts

Structure:
- 1 point per ₹10 spent
- 100 points = ₹500 discount
- Bonus multiplier (2x points) on specific services
- Birthday bonus (100 points)

Business Impact:
✓ Increase repeat bookings by 25-35%
✓ Improve customer lifetime value
✓ Generate customer data

Screens Needed:
- Loyalty dashboard with points balance
- Points history/transactions
- Redemption confirmation
```

#### 7. **Referral Program**
```
Feature: Refer friends, both get ₹200 discount on next booking

Incentive Structure:
- Referrer: ₹200 discount on next booking
- Referee: ₹300 discount on first booking
- Bonus: Refer 5 people → ₹1000 credit

Business Impact:
✓ Customer acquisition cost reduction by 40%
✓ 3-4x higher lifetime value from referred customers
✓ Organic growth without marketing spend

Components:
- Unique referral code generation
- Share via SMS/WhatsApp/Link
- Redemption tracking
- Referral history/rewards
```

#### 8. **Pre-Booking Consultation/Preferences**
```
Feature: Save customer preferences to avoid repetitive questions

Save:
- Preferred hair color products
- Allergies/sensitivities
- Previous services + feedback
- Preferred stylist notes
- Before/after reference images

Business Impact:
✓ Faster booking process (repeat customers)
✓ Better service quality (personalization)
✓ Higher customer satisfaction

Screens:
- Customer profile edit
- Preferences management
- Service history
- Stylist notes visible at booking
```

#### 9. **Gift Cards / Prepaid Packages**
```
Feature: Digital gift cards and prepaid service packages

Options:
- Fixed amount gift cards (₹500, ₹1000, ₹2000)
- Service-specific packages (5 haircuts, 10 facials)
- Validity period (6 months - 2 years)

Business Impact:
✓ Upfront revenue capture
✓ Increased foot traffic from gift recipients
✓ Higher average order value

Components:
- Gift card store
- Digital delivery (email/SMS)
- Balance tracking
- Expiry management
- Referral discount on gift purchase
```

#### 10. **Subscription Plans / Membership**
```
Feature: Monthly/quarterly subscriptions for recurring services

Plans:
- BASIC: 1 service/month (₹999/month)
- PREMIUM: 2 services/month + 15% discount (₹1999/month)
- VIP: 4 services/month + 25% discount + priority booking (₹3999/month)

Business Impact:
✓ Predictable recurring revenue
✓ Higher customer retention (60-70%)
✓ Staff scheduling optimization

Components:
- Subscription dashboard
- Auto-renewal management
- Plan upgrade/downgrade
- Pause/resume functionality
- Free trial option
```

---

### 🟡 MEDIUM PRIORITY - Experience Enhancement

#### 11. **Real-Time Availability & Live Slot Updates**
```
Feature: WebSocket-based real-time slot availability

Benefits:
- No more "slot just got booked" errors
- Live countdown on limited slots (e.g., "2 slots left for 3 PM")
- Seat map for group bookings

Business Impact:
✓ Conversion rate increase (less friction)
✓ Better customer experience
```

#### 12. **Payment Options Expansion**
```
Current: Card, UPI, Cash

Add:
- BNPL (Buy Now Pay Later)
  - Razorpay/Cashfree integration
  - 0% interest options (3/6 months)
- Digital wallets
  - Apple Pay, Google Pay, Samsung Pay
- EMI options
- Cryptocurrency (future)

Business Impact:
✓ 15-20% increase in completed transactions
✓ Attract younger demographics
✓ Higher AOV for premium services
```

#### 13. **Staff Performance & Ratings**
```
Feature: Rate and review stylists

Components:
- 5-star rating system
- Detailed reviews (e.g., skill, punctuality, hygiene)
- Photo reviews (before/after)
- Verified review badge
- Top-rated staff badge

Business Impact:
✓ Drive quality improvements
✓ Highlight top performers
✓ Build staff accountability
✓ Influence customer choices (data-driven)
```

#### 14. **AI-Powered Service Recommendations**
```
Feature: ML algorithm recommends services based on:
- Booking history
- Service seasonality (summer = haircut, winter = treatments)
- Complementary services
- Staff expertise match
- Customer preferences

Business Impact:
✓ Increase service add-ons by 20-30%
✓ Better personalization
✓ Reduce choice paralysis
```

#### 15. **Waitlist Management**
```
Feature: If no slots available, add to waitlist

Mechanism:
- Customer adds booking to waitlist
- Gets notified if slot opens
- Option to accept slot or skip
- 3 consecutive skips = auto-remove from waitlist

Business Impact:
✓ Capture potential lost sales
✓ Better resource utilization
✓ Customer data collection
```

#### 16. **Group Bookings / Party Bookings**
```
Feature: Book multiple services for group (e.g., bachelorette party)

Components:
- Add 2-10 members to single booking
- Different services per member
- Bulk pricing discounts
- Group payment split option
- Group timeline management

Business Impact:
✓ Higher AOV per transaction
✓ Social sharing (word-of-mouth)
✓ Event-based revenue spike
```

---

### 🟢 NICE-TO-HAVE - Differentiation

#### 17. **Video/Virtual Consultations**
```
Feature: 15-min video call with stylist before booking

Use Cases:
- Hair color consultation
- Skincare advice
- Style guidance
- Allergy/sensitivity assessment

Business Impact:
✓ Reduce service dissatisfaction
✓ Upsell premium services
✓ Premium service offering
```

#### 18. **Before/After Gallery**
```
Feature: Staff portfolio with customer photos (with consent)

Components:
- Gallery per stylist
- Filter by service type
- "I want this look" feature
- Share to Pinterest/Instagram
- Request similar look at booking

Business Impact:
✓ Inspire bookings (visual selling)
✓ Showcase staff skills
✓ Social proof
```

#### 19. **Wishlist / Save for Later**
```
Feature: Save services/packages to explore later

Use Cases:
- Browse but not book now
- Compare with other salons
- Get reminded when discount available
- Group chat sharing (e.g., ask friends opinion)

Business Impact:
✓ Reduce cart abandonment (converted to wishlist)
✓ Retargeting opportunities
✓ Conversion catalyst with timely discounts
```

#### 20. **Salon Blog / Tips & Tricks**
```
Feature: In-app educational content

Content:
- Hair care tips (post-booking care)
- Seasonal trends
- DIY maintenance
- Stylist Q&A
- Appointment aftercare instructions

Business Impact:
✓ Increase app engagement time
✓ Build thought leadership
✓ Drive repeat bookings (educated customers)
✓ SEO/organic reach
```

---

### 🔵 ADVANCED - Operational Excellence

#### 21. **Admin Dashboard Enhancements**
```
Key Metrics:
- Real-time revenue dashboard
- Staff utilization heatmap
- Cancellation trends
- Peak hours analysis
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

Operational:
- Bulk rescheduling for staff unavailability
- Service/package management
- Pricing management
- Queue management (waiting customers)
- Staff commission tracking
```

#### 22. **Inventory Management**
```
Feature: Track service materials/products

Tracks:
- Hair dyes, lotions, oils stock levels
- Auto-reorder alerts
- Usage per service
- Expiry date management
- Cost per service calculation

Business Impact:
✓ Prevent service delays (out of stock)
✓ Better profitability analysis
```

#### 23. **CRM Integration**
```
Feature: Customer relationship management

Tracks:
- Customer history
- Contact preferences
- Birthdays (send offers)
- Life events (wedding = bridal packages)
- At-risk customers (haven't booked in 3 months)
- Win-back campaigns

Business Impact:
✓ Proactive customer retention
✓ Targeted campaigns
✓ Data-driven marketing
```

#### 24. **Multi-Location Support**
```
Feature: Manage multiple salon branches

Capabilities:
- Cross-location booking
- Staff availability across branches
- Centralized inventory
- Branch-specific pricing
- Unified analytics

Business Impact:
✓ Expansion enablement
✓ Shared resources optimization
```

#### 25. **Analytics & Reporting**
```
Reports:
- Revenue reports (daily/weekly/monthly)
- Service popularity analysis
- Staff performance metrics
- Customer segmentation
- Churn analysis
- Marketing ROI tracking

Business Impact:
✓ Data-driven decision making
✓ Identify growth opportunities
✓ Benchmark performance
```

---

## 📊 Feature Prioritization Matrix

| Feature | Priority | Effort | Impact | ROI | Timeline |
|---------|----------|--------|--------|-----|----------|
| Smart Reminders | 🔴 | Low | Very High | Excellent | Week 1-2 |
| Cancellation Policy | 🔴 | Low | High | Excellent | Week 2 |
| Service Bundles | 🔴 | Medium | Very High | Excellent | Week 3-4 |
| Loyalty Program | 🟠 | Medium | Very High | Excellent | Week 4-5 |
| Referral Program | 🟠 | Medium | High | Excellent | Week 5-6 |
| Gift Cards | 🟠 | Medium | High | Good | Week 6-7 |
| Subscriptions | 🟠 | High | Very High | Excellent | Week 7-10 |
| Real-Time Slots | 🟡 | High | Medium | Good | Week 10-12 |
| Payment Options | 🟡 | Medium | High | Good | Week 8-10 |
| Staff Ratings | 🟡 | Low | Medium | Good | Week 6-7 |
| Waitlist | 🟡 | Medium | Medium | Good | Week 11-12 |
| Group Bookings | 🟡 | High | Medium | Fair | Week 12-14 |
| Video Consultations | 🟢 | High | Low | Fair | Post-MVP |
| Gallery/Portfolio | 🟢 | Low | Medium | Good | Week 7 |
| CRM Integration | 🔵 | High | Very High | Excellent | Post-MVP |
| Multi-Location | 🔵 | Very High | High | Excellent | Post-MVP |

---

## 🚀 Recommended Implementation Phases

### **Phase 1: MVP Enhancement (Weeks 1-4)**
- ✅ Smart reminders (SMS/Push)
- ✅ Cancellation policy
- ✅ Service bundles
- ✅ Staff ratings (simple)

### **Phase 2: Monetization (Weeks 5-10)**
- ✅ Loyalty program
- ✅ Referral program
- ✅ Gift cards
- ✅ Payment options expansion
- ✅ Service portfolio/gallery

### **Phase 3: Scale & Retention (Weeks 11-16)**
- ✅ Subscription plans
- ✅ Real-time availability
- ✅ Waitlist management
- ✅ Group bookings

### **Phase 4: Operational Excellence (Post-16 weeks)**
- ✅ CRM integration
- ✅ Advanced analytics
- ✅ Multi-location support
- ✅ Video consultations
- ✅ Inventory management

---

## 💰 Revenue Impact Projection

Assuming base monthly revenue = ₹1,00,000

| Feature | Month | Additional Revenue | Cumulative |
|---------|-------|-------------------|-----------|
| Phase 1 (Reminders + Bundles) | M3 | ₹15,000 (15%) | ₹1,15,000 |
| Phase 2 (Loyalty + Referral) | M6 | ₹25,000 (22%) | ₹1,40,000 |
| Phase 3 (Subscriptions) | M9 | ₹35,000 (25%) | ₹1,75,000 |
| Phase 4 (CRM + Analytics) | M12 | ₹50,000 (28%) | ₹2,25,000 |

**75% revenue growth in 12 months through feature expansion**

---

## 🎯 Next Steps

1. **Validate demand** with target customers (surveys, interviews)
2. **Pick Phase 1 features** based on team capacity
3. **Design detailed flows** for selected features
4. **Create detailed specs** before development
5. **Set up analytics tracking** from day 1

-----------
# Salon Booking - Complete Page-by-Page Flow

## 📱 User Journey Overview

```
Home Tab
   ↓
Service Selection Screen
   ↓
Staff Selection Screen
   ↓
Slot Selection Screen
   ↓
Booking Summary Screen
   ↓
Payment Screen
   ↓
Booking Success Screen
```

---

# 🎯 STEP 1: SERVICE SELECTION SCREEN

## Screen Purpose
Allow users to browse and select one or multiple salon services. This is the foundation of the booking journey.

## Layout Structure

```
┌─────────────────────────────────────┐
│  SERVICE SELECTION                  │ ← Header with back button
├─────────────────────────────────────┤
│  Search Services...                 │ ← Search bar with filter icon
├─────────────────────────────────────┤
│  Filter: Hair | Skin | Nails       │ ← Horizontal category filter
│  View: List | Grid                  │ ← View toggle
├─────────────────────────────────────┤
│                                     │
│  📷 Category: HAIR SERVICES         │ ← Category header
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Haircut                      │  │ ← Service card
│  │ ⭐ 4.8 (245 reviews)        │  │   - Shows image
│  │ 30 min | ₹300               │  │   - Rating & reviews
│  │ 30 min | ₹300               │  │   - Duration & price
│  │ [+ ADD]                     │  │   - Add button
│  └──────────────────────────────┘  │   - Add button
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Hair Coloring                │  │
│  │ ⭐ 4.9 (189 reviews)        │  │
│  │ 90 min | ₹1200              │  │
│  │ [+ ADD]                     │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Hair Spa                     │  │
│  │ ⭐ 4.7 (112 reviews)        │  │
│  │ 60 min | ₹800               │  │
│  │ [+ ADD]                     │  │
│  └──────────────────────────────┘  │
│                                     │
│  📷 Category: SKIN SERVICES         │
│  [More services...]                │
│                                     │
├─────────────────────────────────────┤
│  Selected: 2 services               │ ← Selection summary
│  💰 Total: ₹2100 | ⏱️ 2h 30m       │
│  [NEXT]                            │ ← Proceed button
└─────────────────────────────────────┘
```

## Component Details

### Service Card Component
```typescript
interface ServiceCard {
  id: string;
  image: string;
  name: string;
  rating: number;
  reviewCount: number;
  duration: number; // minutes
  price: number;
  onAdd: () => void;
  isSelected: boolean;
  badge?: string; // e.g., "🔥 Trending", "⭐ Staff Favorite"
}

// Card States:
// 1. Normal (unselected)
// 2. Hover (desktop)
// 3. Selected (highlighted, show remove button)
// 4. Disabled (out of stock)
```

## User Interactions

| Action | Trigger | State Update | Navigation |
|--------|---------|--------------|-----------|
| Select Service | Tap [+ ADD] | Add to `selectedServices[]` | Update total price & duration |
| Remove Service | Tap service card when selected | Remove from `selectedServices[]` | Update totals |
| Search | Type in search bar | Filter services by name | Highlight matches |
| Filter by Category | Tap category tag | Filter services | Show relevant services |
| View Details | Tap service card | Expand card | Show full description, benefits |
| Proceed | Tap [NEXT] | Validate selection | Navigate to Staff Selection |

## State Management (Zustand Store)

```typescript
// Store: bookingCreationStore.ts
interface BookingCreationState {
  salonId: string;
  salonName: string;
  selectedServices: Service[];
  
  // Derived
  subtotal: number; // sum of all service prices
  totalDuration: number; // sum of all durations
  
  // Actions
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
  
  // Validation
  validateServiceSelection: () => { valid: boolean; errors: string[] };
}

// Usage in component:
const { selectedServices, addService, removeService, subtotal } = 
  useBookingCreationStore();
```

## API Calls

```typescript
// Fetch all services for salon
GET /api/salons/{salonId}/services

Response:
{
  services: [
    {
      id: "svc_001",
      salonId: "salon_123",
      name: "Haircut",
      category: "hair",
      description: "Professional haircut with styling",
      duration: 30,
      price: 300,
      image: "https://...",
      rating: 4.8,
      reviewCount: 245,
      isAvailable: true,
      maxCapacity: 5,
      currentBookings: 2
    },
    // ... more services
  ]
}

// Fetch service details (optional - if user taps)
GET /api/services/{serviceId}

Response:
{
  id: "svc_001",
  name: "Haircut",
  description: "...",
  benefits: ["Professional look", "Expert styling", "Hair health"],
  compatibility: {
    canCombineWith: ["Hair Spa", "Coloring"],
    recommendWith: ["Beard Trim"]
  },
  images: ["img1.jpg", "img2.jpg"],
  videos: ["demo.mp4"]
}
```

## Validation Rules

```typescript
const validationRules = {
  serviceSelection: {
    minServices: 1,
    maxServices: 10,
    maxTotalDuration: 480, // 8 hours
    maxTotalPrice: 100000, // ₹100k limit
  },
  incompatibilities: [
    // Some services can't be done together
    { service1: "Haircut", service2: "Hair Coloring", reason: "Requires separate visit" }
  ]
};

// Validate before proceeding
const validateServiceSelection = () => {
  if (selectedServices.length < 1) 
    throw new Error("Select at least 1 service");
  
  if (selectedServices.length > 10) 
    throw new Error("Maximum 10 services per booking");
  
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  if (totalDuration > 480) 
    throw new Error("Services would exceed 8-hour limit");
  
  // Check incompatibilities
  // ...
};
```

## Edge Cases & Error Handling

| Scenario | Error Message | User Action |
|----------|---------------|------------|
| No services available | "No services available right now" | Show retry button |
| Service out of stock | Service card appears grayed out | "Currently unavailable" |
| Service unavailable for dates | Prevent selection | "Not available this week" |
| Network error loading services | "Unable to load services" | Show retry button |
| User has no services selected | "Select at least one service" | Keep on screen |

## Analytics Events to Track

```typescript
analytics.logEvent('service_selection_viewed', {
  salonId: salonId,
  timestamp: new Date(),
  serviceCount: services.length
});

analytics.logEvent('service_added', {
  salonId: salonId,
  serviceId: service.id,
  serviceName: service.name,
  price: service.price
});

analytics.logEvent('service_removed', {
  salonId: salonId,
  serviceId: service.id
});

analytics.logEvent('service_selection_completed', {
  salonId: salonId,
  selectedCount: selectedServices.length,
  totalPrice: subtotal,
  totalDuration: totalDuration,
  timestamp: new Date()
});
```

---

# 👤 STEP 2: STAFF SELECTION SCREEN

## Screen Purpose
Allow users to choose a preferred stylist/staff member or let system assign "Any Staff" for potentially faster booking.

## Layout Structure

```
┌─────────────────────────────────────┐
│  SELECT STYLIST                     │ ← Header with back button
├─────────────────────────────────────┤
│  Services: Haircut, Hair Spa        │ ← Show selected services
│  💰 ₹1100 | ⏱️ 1h 30m              │
├─────────────────────────────────────┤
│  Toggle: Any Staff | Choose Stylist │ ← Quick toggle
├─────────────────────────────────────┤
│                                     │
│  📌 RECOMMENDED STYLISTS            │ ← Section header
│  (Based on service expertise)       │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Priya Singh        ✨ TOP-RATED│  │ ← Staff card
│  │ ⭐ 4.9 (324 reviews)        │  │   - Photo (circular)
│  │ 🎯 Hair Specialist          │  │   - Name & title
│  │ 📍 8 yrs experience         │  │   - Rating
│  │ ✓ Available: 5 slots today  │  │   - Expertise tags
│  │ 💲 Base Rate: ₹300 (+10%)   │  │   - Experience
│  │ [SELECT]                    │  │   - Availability
│  └──────────────────────────────┘  │   - Price modifier
│                                     │   - Select button
│  ┌──────────────────────────────┐  │
│  │ Anita Patel                 │  │
│  │ ⭐ 4.7 (198 reviews)        │  │
│  │ 🎯 General Services         │  │
│  │ 📍 5 yrs experience         │  │
│  │ ✓ Available: 3 slots today  │  │
│  │ 💲 Base Rate: ₹300          │  │
│  │ [SELECT]                    │  │
│  └──────────────────────────────┘  │
│                                     │
│  📌 OTHER STYLISTS                  │
│  (Show all available staff)         │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Neha Sharma                 │  │
│  │ ⭐ 4.5 (87 reviews)         │  │
│  │ 🎯 Specialist               │  │
│  │ [SELECT]                    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ ⚡ Any Available Staff       │  │ ← Default option
│  │ Get faster booking times!   │  │   - Fastest option
│  │ System will assign best fit  │  │   - Auto-select benefit
│  │ 💲 Base Rate: ₹300          │  │
│  │ [SELECT]                    │  │
│  └──────────────────────────────┘  │
│                                     │
├─────────────────────────────────────┤
│  Selected: Priya Singh              │ ← Selection summary
│  [NEXT]                            │
└─────────────────────────────────────┘
```

## Component Details

### Staff Card Component
```typescript
interface StaffCard {
  id: string;
  name: string;
  photo: string;
  title: string; // e.g., "Senior Stylist"
  bio: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  specialties: string[]; // e.g., ["Hair Coloring", "Bridal"]
  priceModifier: number; // e.g., 1.1 for +10%
  availableSlots: number;
  badges: string[]; // e.g., ["TOP-RATED", "TRENDING", "AWARD WINNER"]
  isRecommended: boolean;
  onSelect: () => void;
  isSelected: boolean;
}

// Staff Badge Types:
// 1. TOP-RATED (4.8+ rating)
// 2. TRENDING (high bookings)
// 3. NEW (recently joined)
// 4. SPECIALIST (expert in service)
// 5. AWARD-WINNER (recognized)
```

### Sorting & Filtering Logic

```typescript
// Default: Sort by recommendation algorithm
const recommendStaff = (
  services: Service[],
  staff: Staff[]
): Staff[] => {
  return staff
    .filter(s => serviceMatches(s, services))
    .sort((a, b) => {
      // Primary: Specialization match score
      const aSpecScore = calculateSpecializationMatch(a, services);
      const bSpecScore = calculateSpecializationMatch(b, services);
      if (aSpecScore !== bSpecScore) return bSpecScore - aSpecScore;
      
      // Secondary: Rating
      if (a.rating !== b.rating) return b.rating - a.rating;
      
      // Tertiary: Available slots
      return b.availableSlots - a.availableSlots;
    });
};

const calculateSpecializationMatch = (staff: Staff, services: Service[]): number => {
  let score = 0;
  services.forEach(service => {
    if (staff.specialties.includes(service.category)) score += 10;
    if (staff.previouslyDoneService(service.id)) score += 5;
  });
  return score;
};
```

## User Interactions

| Action | Trigger | State Update | Navigation |
|--------|---------|--------------|-----------|
| Select Staff | Tap [SELECT] on card | Set `staff` in store | Update price (add modifier) |
| View Staff Profile | Tap staff photo/name | Expand staff details | Show portfolio, reviews, bio |
| Filter by Specialty | Tap specialty tag | Filter staff list | Show matching staff |
| Sort Options | Tap sort button | Change staff order | Re-sort list |
| Toggle Any Staff | Tap [Any Available Staff] | Clear specific staff | Use fastest booking |
| Proceed | Tap [NEXT] | Validate selection | Navigate to Slot Selection |

## State Management

```typescript
interface BookingCreationState {
  selectedStaff: Staff | null; // null = "Any Staff"
  staffPriceModifier: number; // 1.0 = no change, 1.1 = +10%
  
  // Derived
  staffName: string;
  staffId: string | null;
  
  // Actions
  selectStaff: (staff: Staff) => void;
  selectAnyStaff: () => void;
  clearStaffSelection: () => void;
  
  // Validation
  validateStaffSelection: () => { valid: boolean; errors: string[] };
}

// Update subtotal with staff modifier
const getSubtotal = () => {
  const baseSubtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  return baseSubtotal * staffPriceModifier;
};
```

## API Calls

```typescript
// Fetch all staff for salon
GET /api/salons/{salonId}/staff

Response:
{
  staff: [
    {
      id: "staff_001",
      salonId: "salon_123",
      name: "Priya Singh",
      title: "Senior Stylist",
      bio: "10+ years in hair styling",
      photo: "https://...",
      rating: 4.9,
      reviewCount: 324,
      yearsExperience: 10,
      specialties: ["Hair Coloring", "Bridal", "Hair Spa"],
      priceModifier: 1.1, // +10%
      badges: ["TOP-RATED", "TRENDING"],
      availableSlotsThisWeek: 12
    },
    // ... more staff
  ]
}

// Get staff profile details
GET /api/staff/{staffId}

Response:
{
  id: "staff_001",
  name: "Priya Singh",
  bio: "...",
  portfolio: [
    {
      image: "before.jpg",
      afterImage: "after.jpg",
      serviceType: "Hair Coloring",
      customerReview: "Loved it!",
      rating: 5
    }
  ],
  reviews: [
    {
      customerName: "Anjali",
      rating: 5,
      text: "Priya is amazing!",
      date: "2024-01-15"
    }
  ],
  workingHours: {
    monday: "10:00-18:00",
    // ...
  }
}

// Get staff availability for selected services
GET /api/staff/{staffId}/availability?services={svc_001,svc_002}

Response:
{
  staffId: "staff_001",
  services: ["svc_001", "svc_002"],
  totalDuration: 90,
  availableSlots: 8,
  nextAvailable: "2024-01-20 10:00",
  slots: [
    "2024-01-20 10:00",
    "2024-01-20 11:30",
    // ...
  ]
}
```

## Validation Rules

```typescript
const validationRules = {
  staffSelection: {
    canSelectStaff: true, // Allow choosing staff
    canSelectAnyStaff: true, // Allow "Any Staff"
    minAvailableSlots: 1, // Staff must have at least 1 slot
  }
};

const validateStaffSelection = () => {
  // Staff selection is optional
  // User can proceed with "Any Staff"
  return { valid: true, errors: [] };
};
```

## Filtering & Sorting Options

```typescript
interface StaffFilterOptions {
  sortBy: 'recommended' | 'rating' | 'availability' | 'price';
  filterBySpecialty: string | null;
  showOnlyTopRated: boolean; // 4.7+
  showOnlyAvailableToday: boolean;
}

// Apply filters
const filterStaff = (
  staff: Staff[],
  filters: StaffFilterOptions
): Staff[] => {
  let filtered = [...staff];
  
  if (filters.filterBySpecialty) {
    filtered = filtered.filter(s => 
      s.specialties.includes(filters.filterBySpecialty)
    );
  }
  
  if (filters.showOnlyTopRated) {
    filtered = filtered.filter(s => s.rating >= 4.7);
  }
  
  if (filters.showOnlyAvailableToday) {
    filtered = filtered.filter(s => s.availableSlotsToday > 0);
  }
  
  // Sort
  switch (filters.sortBy) {
    case 'recommended':
      return recommendStaff(filtered, selectedServices);
    case 'rating':
      return filtered.sort((a, b) => b.rating - a.rating);
    case 'availability':
      return filtered.sort((a, b) => b.availableSlots - a.availableSlots);
    case 'price':
      return filtered.sort((a, b) => 
        (a.price * a.priceModifier) - (b.price * b.priceModifier)
      );
  }
};
```

## Analytics Events

```typescript
analytics.logEvent('staff_selection_viewed', {
  salonId: salonId,
  recommendedCount: recommendedStaff.length,
  totalStaffCount: allStaff.length
});

analytics.logEvent('staff_selected', {
  salonId: salonId,
  staffId: staff.id,
  staffName: staff.name,
  priceModifier: staff.priceModifier,
  isTopRated: staff.rating >= 4.7
});

analytics.logEvent('any_staff_selected', {
  salonId: salonId
});

analytics.logEvent('staff_profile_viewed', {
  salonId: salonId,
  staffId: staff.id
});
```

---

# 📅 STEP 3: SLOT SELECTION SCREEN

## Screen Purpose
Display available time slots in calendar view and allow users to select their preferred appointment time.

## Layout Structure

```
┌─────────────────────────────────────┐
│  SELECT DATE & TIME                 │ ← Header
├─────────────────────────────────────┤
│  Stylist: Priya Singh | ⏱️ 1h 30m  │ ← Selected details
│  Services: 2 items | 💰 ₹1210      │
├─────────────────────────────────────┤
│                                     │
│  CALENDAR VIEW                      │ ← Month selector
│  [◀ January 2024 ▶]                │
│                                     │
│  Mo Tu We Th Fr Sa Su              │
│  1  2  3  4  5  6  7              │
│  8  9  10 11 12 13 14            │ ← Dates (unavailable grayed)
│  15 16 17 18 19 20 21            │   (Today highlighted)
│  22 23 24 25 26 27 28            │   (Selected highlighted)
│  29 30 31                          │
│                                     │
│  Selected: January 20              │ ← Selected date display
│  (Saturday)                        │
│                                     │
├─────────────────────────────────────┤
│  AVAILABLE TIME SLOTS               │ ← Time slots for selected date
│                                     │
│  🟢 MORNING (6 slots available)    │
│  ┌─────────┬─────────┬─────────┐  │
│  │ 10:00   │ 10:30   │ 11:00   │  │ ← Slot buttons
│  │ (1 slot)│ (2 slot)│ (3 slot)│  │
│  └─────────┴─────────┴─────────┘  │
│                                     │
│  🟡 AFTERNOON (4 slots available)  │
│  ┌─────────┬─────────┐              │
│  │ 14:00   │ 15:00   │              │
│  └─────────┴─────────┘              │
│                                     │
│  🔴 EVENING (Fully Booked)         │
│  ┌─────────────────────────────┐   │
│  │ All slots booked for today  │   │
│  │ [Select another date]       │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  Selected: 20 Jan, 10:00 AM        │ ← Selection summary
│  [NEXT]                            │
└─────────────────────────────────────┘
```

## Advanced Features

### Real-Time Availability Indicator
```
Slot Colors:
🟢 GREEN  - Plenty available (4+ slots)
🟡 YELLOW - Limited (1-3 slots)
🔴 RED    - Fully booked
⚫ GRAY   - Unavailable (after work hours, holiday)

# Countdown Warning (if ≤1 slot left)
[10:00] ⚠️ Only 1 slot left!
```

### Time Zone & Duration Display
```
Slot Information:
[10:00 - 11:30]  Duration: 1h 30m
(Staff automatically marked as unavailable after 11:30)
```

## Component Details

### Calendar Component
```typescript
interface CalendarProps {
  minDate: Date;
  maxDate: Date; // Usually 90 days from now
  selectedDate: Date | null;
  disabledDates: Date[]; // Holidays, closed days
  onDateSelect: (date: Date) => void;
  slotsAvailable: { [dateString]: number }; // Count per day
}

// Disabled dates include:
// - Past dates
// - Holidays
// - Salon closed days
// - Days when no staff is available
```

### Time Slot Component
```typescript
interface TimeSlotProps {
  id: string;
  startTime: string; // "10:00"
  endTime: string;   // "11:30"
  duration: number;  // 90 minutes
  availableCount: number;
  maxCapacity: number;
  status: 'available' | 'limited' | 'booked' | 'unavailable';
  staffAssigned: Staff[];
  notes?: string; // e.g., "Last slot"
  onSelect: () => void;
  isSelected: boolean;
}
```

## User Interactions

| Action | Trigger | State Update | Navigation |
|--------|---------|--------------|-----------|
| Change Month | Tap [◀] or [▶] | Update calendar view | Show new month |
| Select Date | Tap date in calendar | Set `selectedDate` | Load slots for that date |
| Select Time Slot | Tap time slot | Set `timeSlot` & `appointmentTime` | Update summary |
| View Slot Details | Long press slot | Show expanded info | Display staff, instructions |
| Change Date | Tap selected date | Clear time slot | Show new calendar |
| Proceed | Tap [NEXT] | Validate selection | Navigate to Summary |
| Add to Waitlist | If no slots, tap waitlist button | Record in backend | Show confirmation |

## State Management

```typescript
interface BookingCreationState {
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  appointmentStartTime: Date | null; // Calculated from date + slot
  appointmentEndTime: Date | null;   // Calculated from startTime + totalDuration
  
  // Actions
  setSelectedDate: (date: Date) => void;
  setSelectedTimeSlot: (slot: TimeSlot) => void;
  clearDateTimeSelection: () => void;
  
  // Validation
  validateDateTimeSelection: () => { valid: boolean; errors: string[] };
}

// Calculate appointment times
const getAppointmentTimes = () => {
  const startTime = new Date(selectedDate);
  const [hours, minutes] = selectedTimeSlot.startTime.split(':');
  startTime.setHours(parseInt(hours), parseInt(minutes), 0);
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + totalDuration);
  
  return { startTime, endTime };
};
```

## API Calls

```typescript
// Get available dates with slot counts
GET /api/salons/{salonId}/availability/dates?
  staffId={staffId}&
  services={svc_001,svc_002}&
  fromDate=2024-01-20&
  toDate=2024-04-20

Response:
{
  staffId: "staff_001",
  serviceDuration: 90,
  availableDates: [
    { date: "2024-01-20", totalSlots: 8, bookedSlots: 2 },
    { date: "2024-01-21", totalSlots: 0 }, // Fully booked
    { date: "2024-01-22", totalSlots: 5 },
    // ... 90 days
  ],
  holidays: ["2024-01-26"], // Republic Day
  staffUnavailableDates: ["2024-02-14"] // Staff leave
}

// Get slots for specific date
GET /api/salons/{salonId}/availability/slots?
  date=2024-01-20&
  staffId=staff_001&
  services={svc_001,svc_002}

Response:
{
  date: "2024-01-20",
  staffId: "staff_001",
  totalDuration: 90,
  slots: [
    {
      id: "slot_001",
      startTime: "10:00",
      endTime: "11:30",
      available: 3,
      maxCapacity: 5,
      staffAssigned: ["staff_001"],
      notes: "Limited availability"
    },
    {
      id: "slot_002",
      startTime: "12:00",
      endTime: "13:30",
      available: 0,
      maxCapacity: 5,
      staffAssigned: ["staff_001"],
      notes: "Fully booked"
    },
    {
      id: "slot_003",
      startTime: "14:00",
      endTime: "15:30",
      available: 5,
      maxCapacity: 5,
      staffAssigned: ["staff_001"]
    }
  ]
}

// Register for waitlist (if no slots)
POST /api/salons/{salonId}/waitlist

Body:
{
  customerId: "cust_123",
  salonId: "salon_123",
  staffId: "staff_001",
  services: ["svc_001", "svc_002"],
  preferredDate: "2024-01-20",
  preferredTimeRange: "10:00-12:00"
}

Response:
{
  waitlistId: "wl_001",
  position: 3,
  estimatedWaitTime: "2-3 days",
  notificationChannels: ["sms", "push"]
}
```

## Validation Rules

```typescript
const validationRules = {
  dateTimeSelection: {
    minAdvanceBooking: 2, // hours before appointment
    maxAdvanceBooking: 90, // days
    bufferBetweenBookings: 0, // hours (for same staff)
  }
};

const validateDateTimeSelection = () => {
  const now = new Date();
  const appointmentTime = getAppointmentStartTime();
  
  const hoursUntilAppointment = 
    (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilAppointment < 2) {
    return {
      valid: false,
      errors: ["Appointment must be at least 2 hours from now"]
    };
  }
  
  if (hoursUntilAppointment > 90 * 24) {
    return {
      valid: false,
      errors: ["Can only book up to 90 days in advance"]
    };
  }
  
  return { valid: true, errors: [] };
};
```

## Edge Cases & Error Handling

| Scenario | Error Message | User Action |
|----------|---------------|------------|
| Slot unavailable | "This slot just got booked" | Suggest other slots |
| Staff unavailable | "Your selected staff isn't available" | Choose other staff |
| No slots available | "No slots available for this date" | Show waitlist option |
| Network error | "Unable to load slots" | Show retry button |
| Slot expires | "Slot expired. Please select again" | Auto-refresh slots |
| Too soon | "Must book at least 2 hours in advance" | Show valid dates |

## Analytics Events

```typescript
analytics.logEvent('slot_selection_viewed', {
  salonId: salonId,
  staffId: staffId,
  totalDurationRequired: totalDuration,
  availableDaysCount: availableDates.length
});

analytics.logEvent('date_selected', {
  salonId: salonId,
  selectedDate: selectedDate.toISOString(),
  slotsAvailableForDate: slotsCount
});

analytics.logEvent('time_slot_selected', {
  salonId: salonId,
  slotId: timeSlot.id,
  startTime: timeSlot.startTime,
  availabilityStatus: timeSlot.available > 0 ? 'available' : 'limited'
});

analytics.logEvent('slot_selection_completed', {
  salonId: salonId,
  appointmentDate: selectedDate.toISOString(),
  appointmentTime: timeSlot.startTime,
  staffId: staffId
});
```

---

# 📋 STEP 4: BOOKING SUMMARY SCREEN

## Screen Purpose
Display a comprehensive review of all booking details before payment. Allow final edits if needed.

## Layout Structure

```
┌─────────────────────────────────────┐
│  BOOKING SUMMARY                    │ ← Header
├─────────────────────────────────────┤
│                                     │
│  📍 SALON DETAILS                   │
│  ┌─────────────────────────────────┐│
│  │ Glow Salon                     │ │
│  │ 📍 123 Main Street, Downtown   │ │
│  │ ⭐ 4.8 (1250 reviews)          │ │
│  │ 🕐 Opens in 2h 30m             │ │
│  │ [📞] [📍] [🌐]                │ │
│  └─────────────────────────────────┘│
│                                     │
│  💆 SERVICES BOOKED                 │
│  ┌─────────────────────────────────┐│
│  │ 1. Haircut                     │ │
│  │    Duration: 30 min | ₹300     │ │
│  │    [✎ Edit] [✕ Remove]        │ │
│  │                                │ │
│  │ 2. Hair Spa                    │ │
│  │    Duration: 60 min | ₹800     │ │
│  │    [✎ Edit] [✕ Remove]        │ │
│  └─────────────────────────────────┘│
│                                     │
│  👤 STYLIST ASSIGNED                │
│  ┌─────────────────────────────────┐│
│  │ Priya Singh                    │ │
│  │ ⭐ 4.9 (324 reviews)           │ │
│  │ 🎯 Hair Specialist (+10%)      │ │
│  │ [View Profile] [Change]        │ │
│  └─────────────────────────────────┘│
│                                     │
│  📅 APPOINTMENT DATE & TIME          │
│  ┌─────────────────────────────────┐│
│  │ Saturday, January 20, 2024      │ │
│  │ 10:00 AM - 11:30 AM            │ │
│  │ Duration: 1 hour 30 minutes     │ │
│  │ [Change Date/Time]              │ │
│  └─────────────────────────────────┘│
│                                     │
│  📝 SPECIAL INSTRUCTIONS             │
│  ┌─────────────────────────────────┐│
│  │ [Add notes for stylist...]      │ │ ← Optional text field
│  │ • Preferred hair texture       │ │
│  │ • Color preferences            │ │
│  │ • Allergies/sensitivities      │ │
│  │ • Reference images             │ │
│  └─────────────────────────────────┘│
│                                     │
│  💰 PRICE BREAKDOWN                 │
│  ┌─────────────────────────────────┐│
│  │ Haircut                  ₹300   │ │
│  │ Hair Spa                 ₹800   │ │
│  │ ─────────────────────────────── │ │
│  │ Subtotal                ₹1100   │ │
│  │                                │ │
│  │ Staff Premium (+10%)      +₹110  │ │
│  │ GST (18%)                  +₹218  │ │
│  │ ─────────────────────────────── │ │
│  │ Total                    ₹1428   │ │
│  │                                │ │
│  │ You save: ₹0 (No coupon applied)│ │
│  │ [Apply Coupon Code]             │ │
│  └─────────────────────────────────┘│
│                                     │
│  🎁 LOYALTY POINTS                  │
│  ┌─────────────────────────────────┐│
│  │ Earn 71 points from this booking│ │ ← Points calculation
│  │ (20% bonus: You're a VIP member)│ │
│  │ Points balance: 450             │ │
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│  [Back]              [PROCEED TO PAY]│ ← Action buttons
└─────────────────────────────────────┘
```

## Detailed Price Breakdown

```typescript
interface PriceCalculation {
  items: {
    service1: { name: "Haircut", basePrice: 300, quantity: 1 },
    service2: { name: "Hair Spa", basePrice: 800, quantity: 1 }
  };
  subtotal: 1100; // Sum of all services
  
  adjustments: {
    staffPremium: { name: "Senior Stylist (+10%)", amount: +110 },
    bundleDiscount: { name: "Bundle Savings", amount: 0 },
    couponDiscount: { name: "SAVE20", amount: 0 },
    loyaltyDiscount: { name: "Loyalty Points", amount: 0 }
  };
  
  taxes: {
    gst: { rate: 0.18, amount: 198 }
  };
  
  total: 1428; // subtotal + adjustments + taxes
  
  payable: 1428; // Final amount after all calculations
  
  loyaltyEarned: {
    basePoints: 71, // 20% of total
    bonusPoints: 15, // VIP bonus
    total: 86
  };
}
```

## Component Details

### Editable Summary Section
```typescript
interface EditableServiceItem {
  service: Service;
  onEdit: () => void;
  onRemove: () => void;
}

// When user taps [✎ Edit]:
// - Navigate back to ServiceSelectionScreen
// - Pre-fill with current selection
// - Allow adding/removing services
// - Update summary on return

// When user taps [✕ Remove]:
// - Show confirmation dialog
// - Remove from selectedServices[]
// - Recalculate totals
```

### Coupon Code Input
```typescript
interface CouponInput {
  code: string;
  isValid: boolean;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minAmount: number;
  maxDiscount: number;
  expiryDate: Date;
  applicableServices: string[]; // Empty = applicable to all
}

// Coupon validation flow:
// 1. User enters code
// 2. Real-time validation via API
// 3. Show discount preview
// 4. Apply button
// 5. Show updated total
```

## User Interactions

| Action | Trigger | Effect | Updates |
|--------|---------|--------|---------|
| Edit Services | Tap [✎ Edit] | Navigate to Service Selection | Pre-fill current selections |
| Remove Service | Tap [✕ Remove] | Show confirmation | Recalculate totals |
| Change Stylist | Tap [Change] | Navigate to Staff Selection | Update price modifier |
| Change Date/Time | Tap button | Navigate to Slot Selection | Update appointment time |
| Add Instructions | Type in field | Update state | Save to store |
| Apply Coupon | Enter code + tap | Validate & apply | Update discount & total |
| Proceed to Pay | Tap button | Validate all details | Navigate to Payment |

## State Management

```typescript
interface BookingCreationState {
  // ... existing fields ...
  specialInstructions: string;
  coupon: CouponCode | null;
  
  // Calculated fields
  subtotal: number;
  staffPremium: number;
  discounts: { [key: string]: number };
  taxes: { [key: string]: number };
  total: number;
  
  // Loyalty
  pointsEarned: number;
  
  // Actions
  setSpecialInstructions: (text: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  recalculateTotal: () => void;
  
  // Validation
  validateBookingSummary: () => { valid: boolean; errors: string[] };
  buildBookingPayload: () => BookingPayload;
}

// Calculate all prices
const recalculateTotal = () => {
  const subtotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const staffPremium = subtotal * (staffPriceModifier - 1);
  
  const couponDiscount = coupon 
    ? calculateCouponDiscount(coupon, subtotal)
    : 0;
  
  const beforeTax = subtotal + staffPremium - couponDiscount;
  const taxes = beforeTax * TAX_RATE;
  
  const total = beforeTax + taxes;
  
  const loyaltyPoints = Math.floor(total * 0.1); // 10% of total
  
  return { subtotal, staffPremium, couponDiscount, taxes, total, loyaltyPoints };
};
```

## API Calls

```typescript
// Validate coupon code
POST /api/coupons/validate

Body:
{
  code: "SAVE20",
  salonId: "salon_123",
  customerId: "cust_123",
  amount: 1100,
  applicableServices: ["svc_001", "svc_002"]
}

Response:
{
  valid: true,
  code: "SAVE20",
  discountType: "percentage",
  discountValue: 20,
  maxDiscount: 500,
  applicableDiscount: 220, // 20% of ₹1100 but max ₹500
  message: "20% off - Valid till Dec 31, 2024",
  remainingUses: 2
}

// Get loyalty points balance
GET /api/customers/{customerId}/loyalty

Response:
{
  customerId: "cust_123",
  totalPoints: 450,
  pointsValue: "₹2250", // 5 points = ₹1
  validPoints: 450,
  expiredPoints: 0,
  nextExpiry: "2025-01-15",
  memberTier: "VIP",
  pointsMultiplier: 1.2
}

// Check for available referrals/promos
GET /api/customers/{customerId}/available-promos?salonId={salonId}

Response:
{
  activePromos: [
    {
      type: "referral",
      amount: 200,
      description: "Referral bonus - Get ₹200 off"
    },
    {
      type: "birthday",
      amount: 300,
      description: "Birthday bonus - Get ₹300 off (expires in 5 days)"
    }
  ]
}
```

## Validation Rules

```typescript
const validationRules = {
  bookingSummary: {
    minServices: 1,
    maxServices: 10,
    maxSpecialInstructionsLength: 500,
    maxApplicableCoupons: 1,
  }
};

const validateBookingSummary = () => {
  const errors = [];
  
  if (!selectedServices || selectedServices.length < 1) {
    errors.push("Select at least one service");
  }
  
  if (!selectedDate || !selectedTimeSlot) {
    errors.push("Select a date and time");
  }
  
  if (appointmentTime < (now + 2 hours)) {
    errors.push("Appointment must be at least 2 hours from now");
  }
  
  if (specialInstructions.length > 500) {
    errors.push("Special instructions exceeds 500 characters");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
```

## Analytics Events

```typescript
analytics.logEvent('booking_summary_viewed', {
  salonId: salonId,
  serviceCount: selectedServices.length,
  subtotal: subtotal,
  total: total
});

analytics.logEvent('coupon_applied', {
  salonId: salonId,
  couponCode: coupon.code,
  discountAmount: discountAmount,
  couponType: coupon.discountType
});

analytics.logEvent('coupon_removed', {
  salonId: salonId,
  couponCode: coupon.code
});

analytics.logEvent('booking_summary_completed', {
  salonId: salonId,
  selectedServices: selectedServices.map(s => s.id),
  staffId: selectedStaff?.id || 'any',
  totalAmount: total,
  hasSpecialInstructions: specialInstructions.length > 0,
  hasCoupon: coupon !== null,
  loyaltyPointsApplied: loyaltyDiscountApplied
});
```

---

# 💳 STEP 5: PAYMENT SCREEN

## Screen Purpose
Process payment through multiple payment methods with security and error handling.

## Layout Structure

```
┌─────────────────────────────────────┐
│  PAYMENT METHOD                     │ ← Header
├─────────────────────────────────────┤
│  Amount: ₹1,428                     │ ← Payment amount
│  Salon: Glow Salon                  │
│  Date: Sat, 20 Jan 2024, 10:00 AM  │
├─────────────────────────────────────┤
│                                     │
│  SELECT PAYMENT METHOD              │
│                                     │
│  ◉ Credit/Debit Card                │ ← Radio button selected
│  ┌─────────────────────────────────┐│
│  │ Card ending in 4242             │ │
│  │ Exp: 12/25                      │ │
│  │ [+ Add New Card]                │ │
│  │ [3D Secure - Secure Payment]   │ │
│  └─────────────────────────────────┘│
│                                     │
│  ○ Google Pay / Apple Pay           │
│  ┌─────────────────────────────────┐│
│  │ [Use Saved Cards from Wallet]   │ │
│  └─────────────────────────────────┘│
│                                     │
│  ○ UPI                              │
│  ┌─────────────────────────────────┐│
│  │ yourname@upi                    │ │
│  │ [Change UPI ID]                 │ │
│  │ [Authorize Payment]             │ │
│  └─────────────────────────────────┘│
│                                     │
│  ○ BNPL (Buy Now Pay Later)         │
│  ┌─────────────────────────────────┐│
│  │ Razorpay Checkout (3x, 6x)     │ │
│  │ ₹478 × 3 months (0% interest)  │ │
│  │ [View Terms]                    │ │
│  └─────────────────────────────────┘│
│                                     │
│  ○ Cash at Salon                    │
│  ┌─────────────────────────────────┐│
│  │ Pay cash at salon when          │ │
│  │ appointment arrives             │ │
│  │ Booking locked with deposit:    │ │
│  │ ₹300 due now                    │ │
│  │ [Pay Online Deposit]            │ │
│  └─────────────────────────────────┘│
│                                     │
│  💳 SECURE PAYMENT BADGES           │
│  🔒 SSL Encrypted                   │
│  ✓ Verified by Visa                 │
│  ✓ All major cards accepted         │
│                                     │
├─────────────────────────────────────┤
│  [Back]         [CONFIRM & PAY]    │ ← Action buttons
└─────────────────────────────────────┘
```

## Payment Method Details

### Card Payment Flow
```typescript
interface CardPaymentState {
  savedCards: SavedCard[];
  selectedCard: SavedCard | null;
  newCard: CardDetails | null;
  
  // 3D Secure
  secure3D: boolean;
  require3D: boolean; // Based on risk assessment
  
  // Tokenization
  cardToken: string | null; // Never store raw card
  
  state: 'input' | 'validation' | 'processing' | 'complete' | 'failed';
}

interface SavedCard {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'rupay';
  expiry: string;
  name: string;
  isDefault: boolean;
  isExpired: boolean;
}

interface CardDetails {
  number: string; // Only for tokenization
  cvv: string;    // Only for tokenization
  expiry: string;
  name: string;
  saveForFuture: boolean;
}
```

### UPI Payment Flow
```typescript
interface UPIPaymentState {
  upiId: string;
  savedUPIIds: string[];
  state: 'input' | 'awaiting_auth' | 'processing' | 'complete' | 'failed';
  
  // Timeout handling
  transactionId: string;
  timeoutSeconds: 120;
}

// Flow:
// 1. User enters/selects UPI ID
// 2. System initiates UPI deep link
// 3. Opens user's UPI app (Google Pay, PhonePe, etc.)
// 4. User authorizes payment in app
// 5. System polls for confirmation
// 6. Timeout = 2 minutes
```

### BNPL (Buy Now Pay Later) Flow
```typescript
interface BNPLOption {
  provider: 'razorpay' | 'cashfree';
  tenures: number[]; // [3, 6] months
  interestRate: 0; // 0% for this offer
  monthlyAmount: number;
  terms: string;
}

// Razorpay Subscriptions API:
// - Create subscription for multiple EMIs
// - First EMI charged immediately
// - Next EMIs on schedule
// - Auto-retry if failed
```

### Cash Payment Flow
```typescript
interface CashPaymentState {
  depositRequired: boolean;
  depositAmount: number; // Usually 20-30% of total
  remainingBalance: number;
  bookingConfirmed: boolean;
  
  // Payment confirmation
  confirmationCode: string;
  paymentDueAt: 'appointment_start' | 'appointment_end';
}

// Flow:
// 1. User selects "Cash at Salon"
// 2. Show deposit requirement (if any)
// 3. User pays deposit online
// 4. Booking confirmed
// 5. Balance due at salon on day of appointment
```

## Component Details

### Payment Method Selector
```typescript
interface PaymentMethodOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  badges: string[]; // "0% Interest", "Instant", "Secure"
  details: ReactNode; // Custom component for each method
  isAvailable: boolean;
  minAmount?: number;
  maxAmount?: number;
  isDefault: boolean;
}
```

### Order Summary Widget
```typescript
interface OrderSummaryWidget {
  bookingDetails: {
    salon: string;
    services: string[];
    staffName: string;
    dateTime: string;
    duration: string;
  };
  priceSummary: {
    subtotal: number;
    taxes: number;
    discount: number;
    total: number;
  };
  loyaltyInfo: {
    pointsEarning: number;
    cashback?: number;
  };
}
```

## User Interactions

| Action | Trigger | Effect | Validation |
|--------|---------|--------|-----------|
| Select Method | Tap radio button | Show method-specific UI | Check availability |
| Select Saved Card | Tap card option | Pre-fill details | Check expiry |
| Add New Card | Tap button | Expand card input form | Real-time validation |
| Save for Future | Toggle checkbox | Flag in store | On successful payment |
| Authorize Payment | Tap [CONFIRM] | Initiate payment | Pre-check validation |
| Enter UPI ID | Type | Real-time validation | Format validation |
| Apply BNPL | Select tenure | Show EMI breakdown | Check eligibility |
| Pay Deposit | Tap button | Process payment | Amount validation |

## State Management

```typescript
interface PaymentState {
  selectedMethod: 'card' | 'upi' | 'wallet' | 'bnpl' | 'cash';
  
  // Card-specific
  selectedCard?: SavedCard;
  newCard?: CardDetails;
  requires3D: boolean;
  
  // UPI-specific
  upiId?: string;
  
  // BNPL-specific
  bnplProvider?: string;
  bnplTenure?: number;
  
  // Cash-specific
  depositPaymentMethod?: string;
  depositAmount?: number;
  
  // Global payment state
  isProcessing: boolean;
  error: PaymentError | null;
  
  // Actions
  selectPaymentMethod: (method: string) => void;
  validatePaymentDetails: () => Promise<boolean>;
  processPayment: () => Promise<PaymentResult>;
  retryPayment: () => Promise<PaymentResult>;
}

// Payment validation flow
const validatePaymentDetails = async (): Promise<boolean> => {
  try {
    switch (selectedMethod) {
      case 'card':
        return validateCardDetails(newCard || selectedCard);
      case 'upi':
        return validateUPIId(upiId);
      case 'bnpl':
        return checkBNPLEligibility();
      case 'cash':
        return true; // Always valid
    }
  } catch (error) {
    setError(error);
    return false;
  }
};
```

## API Calls

```typescript
// Create payment order
POST /api/payments/create-order

Body:
{
  bookingId: null, // Pre-payment (before booking)
  customerId: "cust_123",
  amount: 1428,
  currency: "INR",
  paymentMethod: "card",
  metadata: {
    salonId: "salon_123",
    services: ["svc_001", "svc_002"],
    staffId: "staff_001",
    appointmentDateTime: "2024-01-20T10:00:00Z"
  }
}

Response:
{
  orderId: "order_123",
  amount: 1428,
  paymentGateway: "razorpay",
  orderId: "razorpay_order_id",
  key: "razorpay_public_key",
  notes: { /* metadata */ }
}

// For Card Payment: Initialize Razorpay
POST /api/payments/card/tokenize

Body:
{
  orderId: "order_123",
  card: {
    number: "4242...",
    cvv: "123",
    expiry: "12/25",
    name: "John Doe"
  },
  save: true
}

Response:
{
  token: "token_abc123", // For future use
  requiresAuthorization: true,
  redirectUrl: "https://razorpay.com/3d-secure/..."
}

// For UPI Payment: Initiate UPI Link
POST /api/payments/upi/initiate

Body:
{
  orderId: "order_123",
  upiId: "user@upi",
  timeout: 120
}

Response:
{
  transactionId: "txn_123",
  deepLink: "upi://pay?pa=merchant@upi&...",
  status: "awaiting_authorization",
  expiresAt: "2024-01-20T10:10:00Z"
}

// Poll for UPI payment status
GET /api/payments/upi/status?transactionId={transactionId}

Response:
{
  transactionId: "txn_123",
  status: "authorized" | "failed" | "timeout",
  amount: 1428,
  errorCode?: "REJECTED" | "TIMEOUT" | "INSUFFICIENT_BALANCE"
}

// For BNPL: Create Subscription
POST /api/payments/bnpl/subscribe

Body:
{
  orderId: "order_123",
  provider: "razorpay",
  tenure: 3, // months
  interestRate: 0
}

Response:
{
  subscriptionId: "sub_123",
  monthlyEMI: 476,
  firstPaymentAmount: 476,
  schedule: [
    { dueDate: "2024-02-20", amount: 476 },
    { dueDate: "2024-03-20", amount: 476 },
    { dueDate: "2024-04-20", amount: 476 }
  ],
  authorizationUrl: "..."
}

// For Cash: Create Deposit Order
POST /api/payments/cash/create-deposit

Body:
{
  bookingData: { /* full booking data */ },
  depositPercentage: 30,
  totalAmount: 1428
}

Response:
{
  depositAmount: 428,
  remainingBalance: 1000,
  depositOrderId: "deposit_123",
  paymentUrl: "..." // For deposit payment
}

// Confirm booking after payment
POST /api/bookings/create

Body:
{
  salonId: "salon_123",
  customerId: "cust_123",
  services: ["svc_001", "svc_002"],
  staffId: "staff_001",
  appointmentDateTime: "2024-01-20T10:00:00Z",
  paymentOrderId: "order_123",
  paymentMethod: "card",
  paymentStatus: "completed",
  specialInstructions: "...",
  couponCode: "SAVE20",
  totalAmount: 1428
}

Response:
{
  bookingId: "booking_123",
  bookingCode: "BK-20240120-1001",
  status: "confirmed",
  appointmentTime: "2024-01-20T10:00:00Z",
  confirmationDetails: {
    salon: { /* details */ },
    services: [],
    staff: { /* details */ },
    totalAmount: 1428,
    paymentStatus: "completed"
  },
  receiptUrl: "https://...",
  nextSteps: [
    "You will receive an SMS reminder 24 hours before",
    "Arrive 5 minutes early",
    "Contact salon if rescheduling needed"
  ]
}
```

## Payment Error Handling & Retry Logic

```typescript
interface PaymentError {
  code: string;
  message: string;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
}

const paymentErrors = {
  // Retryable errors
  'NETWORK_ERROR': {
    message: 'Network error. Please try again.',
    retryable: true,
    maxRetries: 3
  },
  'TIMEOUT': {
    message: 'Request timed out. Retrying...',
    retryable: true,
    maxRetries: 2
  },
  'GATEWAY_ERROR': {
    message: 'Payment gateway is temporarily unavailable.',
    retryable: true,
    maxRetries: 1
  },
  
  // Non-retryable errors
  'INSUFFICIENT_BALANCE': {
    message: 'Insufficient balance. Please try another payment method.',
    retryable: false
  },
  'INVALID_CARD': {
    message: 'Card details are invalid. Please check and try again.',
    retryable: false
  },
  'CARD_DECLINED': {
    message: 'Card declined. Contact your bank.',
    retryable: false
  },
  'AUTHENTICATION_FAILED': {
    message: '3D Secure authentication failed.',
    retryable: false
  },
  'USER_CANCELLED': {
    message: 'Payment cancelled by user.',
    retryable: true, // Can retry with different method
    maxRetries: 1
  }
};

// Retry with exponential backoff
const retryPayment = async (error: PaymentError) => {
  if (!error.retryable || error.retryCount >= error.maxRetries) {
    showErrorAndSuggestAlternative(error);
    return;
  }
  
  const backoffMs = Math.pow(2, error.retryCount) * 1000; // 1s, 2s, 4s
  await sleep(backoffMs);
  
  error.retryCount++;
  return processPayment();
};
```

## Analytics Events

```typescript
analytics.logEvent('payment_screen_viewed', {
  salonId: salonId,
  amount: amount,
  timestamp: new Date()
});

analytics.logEvent('payment_method_selected', {
  salonId: salonId,
  method: selectedMethod,
  amount: amount
});

analytics.logEvent('payment_initiated', {
  salonId: salonId,
  method: selectedMethod,
  amount: amount,
  orderId: orderId
});

analytics.logEvent('payment_completed', {
  salonId: salonId,
  method: selectedMethod,
  amount: amount,
  orderId: orderId,
  bookingId: bookingId,
  transactionId: transactionId,
  duration_ms: paymentDuration
});

analytics.logEvent('payment_failed', {
  salonId: salonId,
  method: selectedMethod,
  amount: amount,
  orderId: orderId,
  errorCode: error.code,
  errorMessage: error.message,
  retryCount: retryCount
});

analytics.logEvent('payment_retry', {
  salonId: salonId,
  orderId: orderId,
  retryAttempt: retryCount,
  previousErrorCode: previousError.code
});
```

---

# ✅ STEP 6: BOOKING SUCCESS SCREEN

## Screen Purpose
Confirm successful booking and provide essential information for the customer.

## Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│           🎉 SUCCESS! 🎉            │
│                                     │ ← Celebratory header
│  Booking Confirmed!                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  📌 BOOKING REFERENCE                │
│  ┌─────────────────────────────────┐│
│  │ Booking ID: BK-20240120-1001    │ │ ← Reference for support
│  │ Confirmation Code: ABC123       │ │
│  │ [📋 Copy] [📤 Share]           │ │
│  └─────────────────────────────────┘│
│                                     │
│  ✅ BOOKING CONFIRMED                │
│  Salon: Glow Salon                  │
│  📍 123 Main Street, Downtown       │
│  📅 Saturday, January 20, 2024      │
│  🕐 10:00 AM - 11:30 AM            │
│  👤 Stylist: Priya Singh            │
│  💆 Services: Haircut, Hair Spa     │
│  💰 Amount Paid: ₹1,428             │
│                                     │
│  📱 APPOINTMENT REMINDERS             │
│  ┌─────────────────────────────────┐│
│  │ ✓ SMS sent to +91-XXXXXXXXXX   │ │ ← Confirmation sent
│  │ ✓ Email sent to user@email.com  │ │
│  │ ⏱️  You'll get a reminder at:    │ │
│  │    • 24 hours before (2024-01-19) │
│  │    • 2 hours before              │ │
│  │ [Manage Notifications]           │ │
│  └─────────────────────────────────┘│
│                                     │
│  📋 NEXT STEPS                       │
│  1. Arrive 5 minutes early to salon │
│  2. Check our address & directions  │
│  3. Bring any reference images      │
│  4. Ready to relax! ✨              │
│                                     │
│  ❓ NEED HELP?                       │
│  ┌─────────────────────────────────┐│
│  │ [📞 Call Salon]                 │ │
│  │ [💬 Chat Support]               │ │
│  │ [📧 Email Us]                   │ │
│  │ [❓ FAQ]                         │ │
│  └─────────────────────────────────┘│
│                                     │
│  💝 LOYALTY REWARD                   │
│  ┌─────────────────────────────────┐│
│  │ You earned 143 loyalty points!  │ │ ← Points earned
│  │ Points balance: 593              │ │
│  │ Next milestone: 1000 points      │ │
│  │ (Unlock ₹500 credit!)            │ │
│  │ [View Loyalty Dashboard]         │ │
│  └─────────────────────────────────┘│
│                                     │
│  🎁 SPECIAL OFFER                    │
│  ┌─────────────────────────────────┐│
│  │ Refer a friend & get ₹200 off!  │ │ ← Referral incentive
│  │ Your referral code: USR123      │ │
│  │ [Share with Friends]             │ │
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│ [📥 Download Receipt]               │ ← Action buttons
│ [👉 Browse More Services] [Home]    │
└─────────────────────────────────────┘
```

## Receipt Section

```typescript
interface ReceiptDetails {
  bookingId: string;
  bookingCode: string; // User-friendly code
  status: 'confirmed';
  
  salon: {
    name: string;
    address: string;
    phone: string;
    mapLink: string;
  };
  
  appointment: {
    date: Date;
    startTime: string;
    endTime: string;
    duration: string;
  };
  
  services: {
    id: string;
    name: string;
    duration: number;
    price: number;
  }[];
  
  staff: {
    name: string;
    rating: number;
    profileImage: string;
  };
  
  payment: {
    method: 'card' | 'upi' | 'bnpl' | 'cash';
    amount: number;
    transactionId: string;
    status: 'completed' | 'pending' | 'scheduled';
    receiptUrl: string;
  };
  
  cancellationPolicy: {
    canCancelUntil: Date; // 2024-01-19 23:59:59
    refundableTill: Date;
    cancellationCharge: number;
    terms: string;
  };
}
```

## Component Details

### Confirmation Badge
```typescript
interface ConfirmationBadge {
  bookingId: string;
  onCopy: () => void;
  onShare: () => void;
  onDownload: () => void;
  
  actions: [
    { icon: 'copy', label: 'Copy Code', action: copy },
    { icon: 'share', label: 'Share', action: share },
    { icon: 'download', label: 'Download PDF', action: download }
  ]
}
```

### Timeline/Next Steps Widget
```typescript
interface NextStepsWidget {
  steps: {
    number: number;
    title: string;
    description: string;
    icon: string;
    actionLink?: string;
  }[];
  
  exampleSteps: [
    { number: 1, title: "Confirmation Sent", description: "Check your email & SMS", icon: "✓" },
    { number: 2, title: "24-Hour Reminder", description: "We'll remind you tomorrow", icon: "📅" },
    { number: 3, title: "Arrive Early", description: "Come 5 minutes before 10 AM", icon: "🏪" },
    { number: 4, title: "Enjoy Service", description: "Relax with our experts", icon: "✨" }
  ]
}
```

## User Interactions

| Action | Trigger | Effect | Navigation |
|--------|---------|--------|-----------|
| Copy Code | Tap [📋 Copy] | Copy booking code to clipboard | Show "Copied!" toast |
| Share Booking | Tap [📤 Share] | Open share sheet (SMS, WhatsApp, Email) | Share booking details |
| View Directions | Tap salon address | Open Google Maps | Navigate to salon |
| Call Salon | Tap [📞 Call Salon] | Open phone dialer | Call salon |
| Chat Support | Tap [💬 Chat] | Open in-app support chat | Support conversation |
| Download Receipt | Tap button | Generate & download PDF receipt | Save to device |
| View Loyalty | Tap button | Navigate to loyalty dashboard | Loyalty screen |
| Share Referral | Tap [Share with Friends] | Share referral code | Share sheet |
| Browse Services | Tap button | Navigate to services | Service listing |
| Go Home | Tap [Home] | Navigate to home tab | Home screen |

## State Management

```typescript
interface BookingSuccessState {
  booking: Booking;
  paymentDetails: PaymentDetails;
  receiptUrl: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  referralCode: string;
  
  // Tracking
  hasDownloadedReceipt: boolean;
  hasSharedBooking: boolean;
  
  // Actions
  downloadReceipt: () => Promise<void>;
  shareBooking: (platform: string) => void;
  viewSalonDetails: () => void;
  goHome: () => void;
}
```

## API Calls

```typescript
// Get booking confirmation details
GET /api/bookings/{bookingId}

Response:
{
  bookingId: "booking_123",
  bookingCode: "BK-20240120-1001",
  status: "confirmed",
  confirmationTime: "2024-01-17T10:30:00Z",
  
  salon: {
    id: "salon_123",
    name: "Glow Salon",
    address: "123 Main Street, Downtown",
    phone: "+91-XXXXXXXXXX",
    mapCoordinates: { lat: 23.1815, lng: 79.9864 },
    openingHours: "10:00 AM - 8:00 PM"
  },
  
  appointment: {
    scheduledTime: "2024-01-20T10:00:00Z",
    duration: 90,
    serviceCategories: ["hair", "spa"]
  },
  
  services: [
    { id: "svc_001", name: "Haircut", duration: 30, price: 300 },
    { id: "svc_002", name: "Hair Spa", duration: 60, price: 800 }
  ],
  
  staff: {
    id: "staff_001",
    name: "Priya Singh",
    rating: 4.9,
    profileImage: "https://..."
  },
  
  payment: {
    method: "card",
    amount: 1428,
    transactionId: "txn_abc123",
    status: "completed",
    receiptUrl: "https://..."
  },
  
  cancellation: {
    canCancelUntil: "2024-01-19T23:59:59Z",
    cancellationCharge: 200,
    refundPolicy: "Full refund up to 24 hours before appointment"
  },
  
  reminders: {
    emailSent: true,
    smsSent: true,
    nextReminder: "2024-01-19T10:00:00Z"
  }
}

// Get loyalty points earned
GET /api/customers/{customerId}/loyalty/latest-transaction

Response:
{
  transaction: {
    type: "booking_completed",
    pointsEarned: 143,
    multiplerApplied: 1.2, // VIP bonus
    basePoints: 119,
    bonusPoints: 24
  },
  currentBalance: 593,
  nextMilestone: {
    points: 1000,
    reward: "₹500 credit",
    remaining: 407
  }
}

// Generate downloadable receipt
POST /api/bookings/{bookingId}/receipt/generate

Body:
{
  format: 'pdf',
  includeQRCode: true,
  includeMap: true
}

Response:
{
  receiptUrl: "https://...",
  expiresIn: 7, // days
  size: "500KB"
}

// Send confirmation email
POST /api/emails/send-confirmation

Body:
{
  bookingId: "booking_123",
  customerId: "cust_123",
  emailTemplateType: "booking_confirmation",
  includeReminders: true
}

Response:
{
  emailSent: true,
  sentTo: "user@email.com",
  timestamp: "2024-01-17T10:30:00Z"
}
```

## Success Events Tracking

```typescript
// Log successful completion
analytics.logEvent('booking_completed', {
  salonId: salonId,
  bookingId: bookingId,
  services: selectedServices.map(s => s.id),
  staffId: staffId,
  totalAmount: amount,
  paymentMethod: paymentMethod,
  timeToComplete: durationMs,
  completionStep: 'payment_success'
});

analytics.logEvent('booking_success_screen_viewed', {
  bookingId: bookingId,
  salonId: salonId,
  timestamp: new Date(),
  loyaltyPointsEarned: loyaltyPoints
});

analytics.logEvent('booking_receipt_downloaded', {
  bookingId: bookingId,
  format: 'pdf',
  timestamp: new Date()
});

analytics.logEvent('booking_shared', {
  bookingId: bookingId,
  platform: 'whatsapp' | 'sms' | 'email',
  timestamp: new Date()
});

// Track user proceeding to next action
analytics.logEvent('booking_next_action', {
  bookingId: bookingId,
  action: 'browse_more_services' | 'go_home' | 'contact_salon',
  timestamp: new Date()
});

// Session completion
analytics.logEvent('booking_session_completed', {
  salonId: salonId,
  sessionDurationMs: totalSessionDuration,
  stepsCompleted: 6,
  conversions: {
    bookingCreated: true,
    paymentSuccess: true,
    loyaltyPointsEarned: true
  },
  timestamp: new Date()
});
```

## Email Template Structure

```html
<!-- Email: Booking Confirmation -->
Subject: Booking Confirmed! BK-20240120-1001

Dear [Customer Name],

Your booking with Glow Salon is confirmed! 🎉

📌 BOOKING DETAILS
Booking ID: BK-20240120-1001
Date: Saturday, January 20, 2024
Time: 10:00 AM - 11:30 AM
Location: 123 Main Street, Downtown

💆 SERVICES
• Haircut (30 min) - ₹300
• Hair Spa (60 min) - ₹800

👤 STYLIST
Priya Singh (4.9★, 324 reviews)

💰 PAYMENT STATUS
✓ Paid: ₹1,428 (Card)

📱 APPOINTMENT REMINDERS
✓ SMS reminder: 24 hours before
✓ SMS reminder: 2 hours before

[Directions] [Cancel/Reschedule] [Receipt]

Thank you for choosing Glow Salon!

Best regards,
Glow Salon Team
```

---

## 📊 Complete Booking Flow Summary

```
Booking Creation (6 screens):
1. Service Selection → Select 1+ services
                   → Update subtotal & duration
                   
2. Staff Selection  → Choose stylist or "Any Staff"
                   → Update price modifier
                   
3. Slot Selection   → Pick date & time
                   → Validate availability
                   → Handle real-time updates
                   
4. Booking Summary  → Review all details
                   → Add special instructions
                   → Apply coupon codes
                   
5. Payment         → Choose payment method
                   → Handle payment gateway
                   → Retry logic for failures
                   
6. Success         → Confirmation & receipt
                   → Loyalty points earned
                   → Share & download options
```

## 🔗 Navigation Flow

```
Home Tab
   ↓
ServiceSelection ← Edit from Summary
   ↓
StaffSelection ← Change from Summary
   ↓
SlotSelection ← Change from Summary
   ↓
BookingSummary ← Edit/Change any selection
   ↓
Payment ← Retry on failure
   ↓
BookingSuccess
   ↓
Home / Book Again / Browse Services
```

## ⚡ Key Features by Screen

| Screen | Key Features | Optional Features |
|--------|-------------|-------------------|
| Service Selection | Search, Filter, Add/Remove, Image, Rating | Video, Reviews, Bundles |
| Staff Selection | Recommendations, Filter, Specialty, Price Modifier | Portfolio, Reviews, Video Call |
| Slot Selection | Calendar, Time Grid, Real-time Updates, Waitlist | Timezone, Holidays, Location |
| Summary | Price Breakdown, Coupon, Instructions, Loyalty | Gift Cards, Subscriptions |
| Payment | Multiple Methods, Saved Cards, Error Handling, Retry | BNPL, Wallets, Installments |
| Success | Confirmation, Receipt, Share, Loyalty, Referral | Feedback, Reschedule, Next Booking |

---

**This complete flow provides excellent user experience, handles all edge cases, and maximizes conversions through features like loyalty programs, referrals, and multiple payment options.**
