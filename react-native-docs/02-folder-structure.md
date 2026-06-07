# 📁 Folder Structure

```
customer-mobile/
├── assets/                          # Static assets (images, icons, splash)
│   ├── salon1.jpg / salon2.jpg / salon3.jpg
│   ├── icon.png / splash.png / adaptive-icon.png
│   └── images/
│
├── react-native-docs/               # ← THIS FOLDER — developer documentation
│
├── documentation/                   # Product & design docs
│   ├── wireframe-documentation.md
│   └── missing-screens-build-prompt.md
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── auth/
│   │   │   ├── GlassContainer.tsx   # Glassmorphism card wrapper
│   │   │   ├── LuxuryButton.tsx     # Animated auth button
│   │   │   ├── LuxuryInput.tsx      # Styled auth input
│   │   │   └── index.ts
│   │   ├── booking/
│   │   │   ├── BookingCard.tsx      # Booking list item card
│   │   │   └── BookingProgress.tsx  # Step indicator (steps 1–4)
│   │   ├── common/
│   │   │   ├── Button.tsx           # Primary CTA button
│   │   │   ├── Card.tsx             # Pressable card wrapper
│   │   │   ├── Input.tsx            # Text input with label + error
│   │   │   └── Skeleton.tsx         # Loading skeleton placeholder
│   │   ├── layout/
│   │   │   └── ScreenHeader.tsx     # Back arrow + title header
│   │   ├── profile/
│   │   │   ├── MenuButton.tsx       # Profile menu row item
│   │   │   ├── ProfileCard.tsx      # User info card
│   │   │   ├── StatsCard.tsx        # Booking stats card
│   │   │   └── index.ts
│   │   └── salon/
│   │       └── SalonCard.tsx        # Salon discovery card
│   │
│   ├── constants/
│   │   ├── colors.ts                # Full color palette (see design-system.md)
│   │   ├── config.ts                # App-wide constants (API URL, timeouts)
│   │   ├── spacing.ts               # 8pt spacing scale
│   │   └── typography.ts            # Font sizes & weights
│   │
│   ├── data/
│   │   └── demo.ts                  # All mock data — salons, services, staff, bookings, etc.
│   │
│   ├── hooks/
│   │   └── useBooking.ts            # Booking utility hook
│   │
│   ├── navigation/
│   │   ├── index.tsx                # RootNavigator — Auth vs Main
│   │   ├── AuthStack.tsx            # Splash → Onboarding → Login → OTP
│   │   ├── MainStack.tsx            # Bottom tab navigator (5 tabs)
│   │   ├── HomeStack.tsx            # Home + full booking wizard
│   │   ├── ServicesStack.tsx        # Services catalogue + detail
│   │   ├── BookingsStack.tsx        # Appointments management
│   │   ├── ShopStack.tsx            # Product shop + cart + checkout
│   │   ├── WalletStack.tsx          # Wallet home + add money + history
│   │   ├── ProfileStack.tsx         # Profile + settings + addresses
│   │   └── linking.ts               # Deep linking configuration
│   │
│   ├── screens/                     # 43 screens total (see screens-reference.md)
│   │   ├── auth/                    # 4 screens
│   │   ├── booking/                 # 6 screens (wizard)
│   │   ├── bookings/                # 4 screens (appointments)
│   │   ├── gallery/                 # 2 screens
│   │   ├── home/                    # 4 screens
│   │   ├── location/                # 1 screen
│   │   ├── profile/                 # 7 screens
│   │   ├── reviews/                 # 1 screen
│   │   ├── services/                # 2 screens
│   │   ├── shop/                    # 6 screens
│   │   ├── team/                    # 2 screens
│   │   └── wallet/                  # 4 screens
│   │
│   ├── services/
│   │   └── storage/
│   │       └── index.ts             # AsyncStorage wrapper
│   │
│   ├── store/
│   │   ├── authStore.ts             # Auth state (Zustand)
│   │   ├── bookingStore.ts          # Active booking state (Zustand)
│   │   └── notificationStore.ts     # Notifications + unread count (Zustand)
│   │
│   ├── theme/
│   │   └── tokens.ts                # Design tokens (luxury gold theme)
│   │
│   ├── types/
│   │   ├── api.ts                   # API request/response types
│   │   ├── models.ts                # Domain models (Salon, Booking, User, etc.)
│   │   └── navigation.ts            # All navigation param lists (typed)
│   │
│   └── utils/
│       └── device.ts                # Device info utilities
│
├── .env.example                     # Environment variable template
├── app.json                         # Expo app configuration
├── babel.config.js                  # Babel + module-resolver config
├── tsconfig.json                    # TypeScript config
├── package.json
├── index.js                         # App entry point
├── App.tsx                          # Root component
└── README.md
```

---

## Key Naming Conventions

| Pattern | Example |
|---------|---------|
| Screen files | `PascalCase` + `Screen.tsx` suffix |
| Component files | `PascalCase.tsx` |
| Store files | `camelCase` + `Store.ts` suffix |
| Constant files | `camelCase.ts` |
| Route names | `PascalCase` strings matching navigator `name` props |
| Stack param lists | `[Name]StackParamList` type |

## Module Alias

`@/` maps to `src/` via `babel.config.js` + `tsconfig.json` path alias.

```ts
import { colors } from '@/constants/colors';     // = src/constants/colors.ts
import { useAuthStore } from '@/store/authStore'; // = src/store/authStore.ts
```
