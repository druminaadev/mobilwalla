# 🎨 Design System

All design tokens are defined in `src/constants/colors.ts`, `src/constants/typography.ts`, and `src/constants/spacing.ts`.

---

## Brand Colors (`src/constants/colors.ts`)

```ts
colors.primary       = '#FF5C8A'   // Salon Pink — CTAs, active states, gradients
colors.primaryDark   = '#FF3366'   // Gradient end, pressed state
colors.primaryLight  = '#FFF0F5'   // Tinted backgrounds, chips, badges

colors.success       = '#10B981'   // Confirmed, available
colors.successLight  = '#D1FAE5'
colors.warning       = '#F59E0B'   // Ratings, morning slots
colors.warningLight  = '#FEF3C7'
colors.error         = '#EF4444'   // Cancel, errors, debit amounts
colors.errorLight    = '#FEE2E2'
colors.info          = '#0EA5E9'   // Info badges
colors.infoLight     = '#E0F2FE'

colors.background    = '#F8FAFC'   // Screen background
colors.surface       = '#FFFFFF'   // Cards, modals
colors.border        = '#E2E8F0'   // Dividers, card borders

colors.textPrimary   = '#0F172A'   // Headings, key values
colors.textSecondary = '#64748B'   // Subtext, descriptions
colors.textTertiary  = '#94A3B8'   // Placeholders, meta, timestamps

colors.secondary     = '#8B5CF6'   // Purple — notifications, loyalty
colors.secondaryLight= '#EDE9FE'
```

---

## Typography Scale

| Role | Size | Weight | Letter Spacing |
|------|------|--------|---------------|
| Screen title | 26–28px | 800 | -0.4 to -0.5 |
| Section title | 17–18px | 800 | -0.3 |
| Card title | 15–16px | 700 | 0 |
| Body | 14–15px | 400–600 | 0 |
| Label / meta | 11–13px | 500–700 | 0–0.5 |
| Badge / tag | 10–12px | 700–800 | 0.5 |

---

## Spacing (8pt Grid)

```ts
spacing.xs   = 4
spacing.sm   = 8
spacing.md   = 16
spacing.lg   = 24
spacing.xl   = 32
spacing.xxl  = 48
```

---

## Component Specs

### Cards
```ts
borderRadius: 18–22
elevation: 2–4
shadowColor: '#000'
shadowOffset: { width: 0, height: 2–4 }
shadowOpacity: 0.04–0.08
shadowRadius: 8–12
backgroundColor: '#FFFFFF'
```

### Buttons
```ts
borderRadius: 14–20
Primary:    backgroundColor '#FF5C8A', color 'white', fontWeight '800'
Secondary:  backgroundColor '#F1F5F9', color '#64748B', fontWeight '700'
Danger:     backgroundColor '#EF4444', color 'white'
```

### Inputs
```ts
borderWidth: 1.5–2
borderColor: colors.border (inactive) → colors.primary (focused)
borderRadius: 14
padding: 14–16
fontSize: 15
```

---

## Animation Patterns

| Pattern | Spec |
|---------|------|
| Press feedback | `scale: 0.96` spring on every Pressable |
| Success check | `Animated.spring` scale `0 → 1`, tension 55, friction 7 |
| FAB pulse | `Animated.loop` scale `1 → 1.08 → 1`, 900ms |
| Screen entry | `fadeIn + translateY(20 → 0)`, 400ms |
| Stagger rows | 120ms delay between rows |
| Spring config | `tension: 160, friction: 18` for tab transitions |

---

## Service Category Colors

| Category | Background | Icon Color |
|----------|-----------|------------|
| Hair | `#EDE9FE` | `#8B5CF6` |
| Skin / Facial | `#FCE7F3` | `#EC4899` |
| Body / Spa | `#CCFBF1` | `#14B8A6` |
| Nails | `#FEF9C3` | `#F59E0B` |
| Makeup | `#FEE2E2` | `#EF4444` |
| Massage | `#D1FAE5` | `#10B981` |

---

## Gradient Usages

| Where | Colors |
|-------|--------|
| Primary CTAs, hero headers | `['#FF5C8A', '#FF3366']` |
| Wallet balance card | `['#FF5C8A', '#FF9F43']` |
| Booking Success background accent | `['#FF5C8A', '#FF3366']` |
| Order Tracking header | `['#FF5C8A', '#FF3366']` |

All gradients use `expo-linear-gradient`.

---

## Shared Components Quick Reference

| Component | Import | Use For |
|-----------|--------|---------|
| `Button` | `@/components/common/Button` | All primary CTAs |
| `Card` | `@/components/common/Card` | Pressable card wrappers |
| `Input` | `@/components/common/Input` | All form inputs |
| `ScreenHeader` | `@/components/layout/ScreenHeader` | Back arrow + title on every inner screen |
| `BookingProgress` | `@/components/booking/BookingProgress` | 4-step booking wizard progress |
| `BookingCard` | `@/components/booking/BookingCard` | Appointment list items |
| `SalonCard` | `@/components/salon/SalonCard` | Salon discovery cards |
| `Skeleton` | `@/components/common/Skeleton` | Loading placeholders |
