# 🗃 State Management

The app uses **Zustand** for global state. Three stores cover all shared state needs.

---

## `authStore` — `src/store/authStore.ts`

Manages the user session, login/logout, and AsyncStorage persistence.

```ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  deviceId: string | null;

  login(phone: string, otp: string): Promise<void>;
  logout(): Promise<void>;
  checkAuth(): Promise<void>;   // hydrates from AsyncStorage on app start
  updateUser(updates: Partial<User>): void;
}
```

**Demo login:** any phone + OTP `123456`  
**Persistence:** user session stored in AsyncStorage key `@auth_user`

---

## `bookingStore` — `src/store/bookingStore.ts`

Holds the in-progress booking across the 4-step wizard.

```ts
interface BookingState {
  salonId: string | null;
  selectedServices: SalonService[];
  selectedStaff: Staff | null;
  selectedDate: string | null;       // ISO date string
  selectedSlot: { startTime: string; endTime: string } | null;

  setSalonId(id: string): void;
  addService(service: SalonService): void;
  removeService(serviceId: string): void;
  setSelectedStaff(staff: Staff | null): void;
  setDateTime(date: string, slot: { startTime: string; endTime: string }): void;
  clearBooking(): void;
  getTotalAmount(): number;          // sum of selected service prices
  getTotalDuration(): number;        // sum of selected service durations in minutes
}
```

**Important:** Call `clearBooking()` when the user lands on `BookingSuccess` or cancels the flow.

---

## `notificationStore` — `src/store/notificationStore.ts`

Manages in-app notifications and the unread badge count.

```ts
interface NotificationState {
  notifications: Notification[];

  unreadCount(): number;             // used for Profile tab badge
  markRead(id: string): void;
  markAllRead(): void;
  deleteNotification(id: string): void;
  clearAll(): void;
  addNotification(n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void;
}
```

The unread count is wired to the Profile tab badge in `MainStack.tsx` via `NotifBadge` component.

---

## Notification Types

```ts
type NotificationType = 'booking' | 'offer' | 'reminder' | 'wallet' | 'loyalty';
```

| Type | Icon | Color |
|------|------|-------|
| `booking` | Calendar | Blue `#EEF2FF` |
| `offer` | Tag | Pink `#FCE7F3` |
| `reminder` | Clock | Yellow `#FEF3C7` |
| `wallet` | Wallet | Green `#D1FAE5` |
| `loyalty` | Star | Yellow `#FEF9C3` |

---

## Usage Pattern

```tsx
// Reading state
const { user, isAuthenticated } = useAuthStore();
const { selectedServices, getTotalAmount } = useBookingStore();
const unreadCount = useNotificationStore((s) => s.unreadCount());

// Actions
const { login, logout } = useAuthStore();
const { addService, clearBooking } = useBookingStore();
const { markAllRead } = useNotificationStore();
```

---

## Why Zustand?

- Zero boilerplate vs Redux
- Works natively with React hooks
- No Provider wrapping needed
- Tiny bundle size (~1KB)
- Supports AsyncStorage persistence via `zustand/middleware`
