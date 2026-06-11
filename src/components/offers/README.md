# Special Offers Screen (SpecialForYou) - Production Grade Implementation

## Overview

This is a premium, production-grade React Native UI component system for displaying special salon/spa offers. The implementation uses:

- **React Native** with TypeScript (strict mode)
- **React Native Reanimated v3** for smooth animations
- **Expo** for cross-platform development
- **Modular, reusable components** following SOLID principles
- **Accessibility-first design** with proper ARIA labels and semantic roles
- **Pixel-perfect spacing** matching design specifications

## Architecture

### File Structure

```
src/
├── components/offers/          # Reusable offer components
│   ├── OfferCard.tsx          # Main offer card with animations
│   ├── DecorativeWave.tsx     # SVG wave divider (organic curve)
│   ├── DecorativeDots.tsx     # SVG dot pattern background
│   ├── PercentBadge.tsx       # Discount percentage badge
│   └── index.ts               # Barrel export
├── screens/home/
│   └── SpecialForYouScreen.tsx # Main screen with FlatList
└── navigation/
    └── OffersStack.tsx        # Navigation stack (already configured)
```

## Components

### OfferCard Component

**File:** `src/components/offers/OfferCard.tsx`

A memoized, reusable offer card component with the following features:

#### Specifications
- **Dimensions:** 100% width × 170px height
- **Border Radius:** 28px
- **Layout:** Flex row (55% left, 45% right)

#### Left Section (55%)
- **Badge:** Small pill-shaped category label
  - Background: White
  - Border Radius: 16px
  - Padding: 12px horizontal, 6px vertical
  - Font: 12px, 600 weight, #555 color

- **Title:** "Get Special Offer"
  - Font: 24px, 700 weight
  - Color: #222222
  - Line Height: 30px
  - Margin Top: 16px

- **Discount Display:** "Up to [NUMBER]%"
  - Label: 18px, 500 weight, #444444
  - Number: 52px, 800 weight, #111111
  - Line Height: 58px

- **Claim Button:** Rounded pill button
  - Background: #0E6663 (teal)
  - Dimensions: 110px × 46px
  - Border Radius: 23px
  - Font: 18px, 700 weight, white
  - Animation: Scale 0.96 on press with spring

#### Right Section (45%)
- Full-height image with `cover` resize mode
- Border Radius: 28px (top-right and bottom-right)

#### Decorative Elements
- **Wave Divider:** SVG organic curve between text and image
  - White fill with opacity gradient
  - Teal stroke (#0E6663) at 0.25 opacity
  - Creates smooth luxury aesthetic

- **Percent Badge:** Floating circular badge
  - Background: #F9A826 (gold/orange)
  - Dimensions: 20px × 20px
  - Display: "%" text (10px, 700 weight, white)
  - Position: Bottom-right of discount number

#### Shadows
- Shadow Color: #000000
- Shadow Opacity: 0.05
- Shadow Radius: 12
- Elevation: 3 (Android)

#### Animations
- **Entrance:** Fade in + slide up (via parent screen)
- **Button Press:** Scale animation
  - Press: Scale to 0.96
  - Release: Spring back to 1.0
  - Spring Config: damping=10, mass=1

#### Accessibility
- `accessibilityLabel`: "Special offer: [badge], [discount]% discount"
- `accessibilityHint`: "Double tap to claim offer"
- `accessibilityRole`: "button"
- Minimum touch area: 48×48 (button meets 44×44 minimum)
- Dynamic font scaling support with `maxFontSizeMultiplier`

#### Props

```typescript
interface OfferCardProps {
  id: string;                  // Unique offer identifier
  badge: string;               // Category label (e.g., "Limited Deals Today")
  discount: number;            // Discount percentage (e.g., 20)
  image: ImageSourcePropType;  // Image source
  onPress?: () => void;        // Claim button callback
}
```

#### Usage

```typescript
<OfferCard
  id="offer-1"
  badge="Limited Deals Today"
  discount={20}
  image={require('@assets/images/salon.webp')}
  onPress={() => handleClaim('offer-1')}
/>
```

### DecorativeWave Component

**File:** `src/components/offers/DecorativeWave.tsx`

SVG-based decorative wave divider that creates an organic curve between the text and image sections of the offer card.

#### Properties
- Creates a smooth, curved transition
- White gradient fill
- Teal accent stroke with optional opacity
- Position: Absolutely positioned on the right side of the card

#### Usage
Used internally by `OfferCard` - no direct usage needed.

### DecorativeDots Component

**File:** `src/components/offers/DecorativeDots.tsx`

Subtle SVG dot pattern for background decoration.

#### Props
```typescript
interface DecorativeDotsProps {
  width: number;              // Pattern width
  height: number;             // Pattern height
  position: 'top' | 'bottom-left';  // Placement position
}
```

#### Properties
- Opacity: 0.12 (very subtle)
- Color: #0E6663 (teal, matches brand)
- Spacing: 18px between dots
- Dot Size: 6px radius

### PercentBadge Component

**File:** `src/components/offers/PercentBadge.tsx`

Small circular badge displaying the "%" symbol.

#### Specifications
- Background: #F9A826 (gold)
- Dimensions: 20px × 20px
- Border Radius: 10px (circle)
- Text: "%" (10px, 700 weight, white)
- Position: Floating bottom-right of discount number

## Main Screen: SpecialForYouScreen

**File:** `src/screens/home/SpecialForYouScreen.tsx`

The primary screen component displaying a scrollable list of offers.

### Screen Layout

#### Header Section
- **Back Button:** 48×48 circular outlined button
  - Border: 1px solid #E5E5E5
  - Background: White
  - Icon: ArrowLeft from lucide-react-native
  - Subtle shadow
  - Tappable area: 44×44 minimum (accessible)

- **Title:** "SpecialForYou"
  - Font: 28px, 700 weight
  - Color: #222222
  - Letter Spacing: -0.3
  - Centered

- **Header Height:** 80px
- **Padding:** 24px horizontal, 12px top, 16px bottom

#### Decorative Background
- **Top Center:** Dot pattern (120×120, 12% opacity)
- Provides subtle luxury aesthetic
- Non-interactive (`pointerEvents: 'none'`)

#### Offers List (FlatList)
- **Spacing Between Cards:** 20px (margin bottom)
- **Horizontal Padding:** 20px (on cards)
- **Bottom Padding:** 40px (list safe area)
- **Scroll:** Enabled with bounce animation
- **Scroll Indicators:** Hidden for clean look

### Data Structure

```typescript
const OFFERS_DATA: Offer[] = [
  {
    id: '1',
    badge: 'Limited Deals Today',
    discount: 20,
    image: salonImage1,
  },
  {
    id: '2',
    badge: "Today's Offers",
    discount: 40,
    image: salonImage2,
  },
  {
    id: '3',
    badge: 'Exclusive Offers',
    discount: 30,
    image: spaImage1,
  },
  {
    id: '4',
    badge: 'Wedding Season Offers',
    discount: 10,
    image: bridalImage1,
  },
];
```

### Animations

#### Screen Entrance
- **Duration:** 400ms
- **Effect:** Fade in + slide up 20px
- **Applied to:** Entire screen container

#### Card Entrance
- **Duration:** 500ms per card
- **Stagger:** 100ms delay between cards
- **Effect:** Fade in + slide up 40px
- **Applied to:** Individual offer cards in sequence

### Accessibility Features

1. **Semantic Structure**
   - Header role: "header"
   - Card role: "button"
   - List role: "list"

2. **Labels & Hints**
   - Back button: "Go back" + "Navigates to previous screen"
   - Offer cards: "Special offer: [badge], [discount]% discount" + "Double tap to claim offer"
   - List: "Special offers list" + "Scrollable list of special salon offers"

3. **Dynamic Font Scaling**
   - Header title: `maxFontSizeMultiplier={1.3}`
   - Supports accessibility text size preferences
   - Maintains responsive layout

4. **Touch Targets**
   - All buttons: Minimum 44×44 (iOS standard)
   - Back button: 48×48 (exceeds minimum)
   - Claim button: 110×46 (exceeds minimum)

### Navigation Integration

The screen is already integrated into the app's navigation stack:

```typescript
// OffersStack.tsx
export type OffersStackParamList = {
  OffersList: undefined;
  SpecialForYou: undefined;  // ← This screen
  // ... other routes
};

// MainStack uses OffersStack
<Tab.Screen name="OffersTab" component={OffersStack} />
```

To navigate to this screen:

```typescript
// From any screen
navigation.navigate('OffersTab', { screen: 'SpecialForYou' });
```

## Colors & Design System

### Color Palette

| Name | Value | Usage |
|------|-------|-------|
| Primary Teal | #0E6663 | Claim button, wave accent, dot pattern |
| Accent Gold | #F9A826 | Percent badge |
| Background | #F7F7F7 / #FAFAFA | Screen background |
| Surface White | #FFFFFF | Cards, badges |
| Text Primary | #222222 | Titles, headings |
| Text Secondary | #444444 / #555555 | Labels, descriptions |
| Border | #E5E5E5 | Button borders |

### Spacing

Using the project's spacing constants:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Typography

- **28px, 700:** Screen title
- **24px, 700:** Card title
- **18px, 700:** Claim button
- **18px, 500:** Discount label
- **52px, 800:** Discount number
- **12px, 600:** Badge text

## Performance Optimizations

1. **Component Memoization**
   - `OfferCard` uses `React.memo` with custom comparison
   - Prevents unnecessary re-renders

2. **Callback Memoization**
   - `useCallback` for all event handlers
   - Dependencies properly specified

3. **Animated Values**
   - Shared values for screen and card animations
   - Efficient reanimated architecture

4. **FlatList Optimization**
   - Proper `keyExtractor` (returns unique `id`)
   - `renderItem` is memoized
   - `scrollEnabled` allows native scrolling

5. **TypeScript Strict Mode**
   - No `any` types
   - Full type safety
   - Better IDE support and error detection

## Testing Recommendations

### Manual Testing Checklist

- [ ] Back button navigation works
- [ ] Claim button animations are smooth
- [ ] FlatList scrolling is performant
- [ ] Images load correctly
- [ ] Decorative elements (wave, dots) render properly
- [ ] Touch targets meet minimum 44×44 size
- [ ] Text scaling respects accessibility settings
- [ ] Screen transitions are smooth
- [ ] Animations perform at 60fps (no jank)

### Device Testing

- [ ] iOS (iPhone 13, 15, iPad)
- [ ] Android (Pixel 6, Samsung S22, others)
- [ ] Portrait and landscape orientations
- [ ] Various screen sizes (4.7", 5.5", 6.1", 6.7")

## Browser & Web Support

The component is built with React Native, primarily for mobile. Web support via `react-native-web` is available but may require responsive adjustments for larger screens.

## Dependencies

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-reanimated": "^3.10.0",
  "react-native-svg": "15.12.1",
  "lucide-react-native": "^1.17.0"
}
```

## Future Enhancements

1. **Analytics Tracking** - Track offer claims and views
2. **Offer Details Modal** - Show detailed offer information
3. **Share Functionality** - Allow users to share offers
4. **Filtering/Sorting** - Filter by category or discount
5. **Wishlist** - Save favorite offers
6. **Real-time Updates** - WebSocket integration for live offer updates
7. **A/B Testing** - Test different card designs and layouts
8. **Haptic Feedback** - Vibration on button press
9. **Persistent State** - Cache offers locally
10. **Analytics Dashboard** - Track conversion metrics

## Troubleshooting

### Images Not Loading
- Ensure image paths are correct
- Check image file exists in assets
- Verify require() statements

### Animations Janky
- Check device performance
- Verify Reanimated is properly installed
- Run on native device (not simulator for best performance)
- Profile with React Native Performance Monitor

### Layout Issues
- Verify flex proportions (55% + 45% = 100%)
- Check padding and margin values
- Use React Native debugger to inspect layout

### TypeScript Errors
- Run `npm run type-check`
- Verify all imports use correct paths
- Check strict mode compliance

## Contributing

When modifying these components:

1. Maintain TypeScript strict mode compliance
2. Keep components reusable and modular
3. Add proper accessibility labels
4. Update JSDoc comments
5. Test on multiple devices
6. Profile animations for performance

---

**Created:** 2026-06-08  
**Last Updated:** 2026-06-08  
**Status:** Production Ready ✅
