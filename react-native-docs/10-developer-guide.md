# 👨‍💻 Developer Guide — Patterns & Conventions

---

## Adding a New Screen

1. Create the file in the correct `src/screens/<flow>/` folder
2. Add the route to the param list in `src/types/navigation.ts`
3. Register the screen in the appropriate stack navigator in `src/navigation/`
4. Add an entry point (button/link) in the previous screen

### Screen Template

```tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/colors';
import { YourStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<YourStackParamList, 'YourScreen'>;

export default function YourScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Screen Title" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        {/* Content */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
});
```

---

## Press Feedback Animation

Every interactive element should have scale feedback:

```tsx
import { Animated, Pressable } from 'react-native';

const scaleAnim = useRef(new Animated.Value(1)).current;

const onPressIn = () =>
  Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, tension: 160 }).start();
const onPressOut = () =>
  Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 160 }).start();

<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
  <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={handlePress}>
    {/* content */}
  </Pressable>
</Animated.View>
```

---

## Using Shared Components

```tsx
// Button
import { Button } from '@/components/common/Button';
<Button title="Book Now" onPress={handleBook} fullWidth loading={isLoading} />

// Input
import { Input } from '@/components/common/Input';
<Input
  label="Full Name"
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
  error={errors.name}
/>

// Card (pressable)
import { Card } from '@/components/common/Card';
<Card onPress={() => navigation.navigate('Detail', { id })} style={styles.card}>
  {/* card content */}
</Card>

// ScreenHeader
import { ScreenHeader } from '@/components/layout/ScreenHeader';
<ScreenHeader title="My Screen" onBack={() => navigation.goBack()} />

// Booking step progress
import { BookingProgress } from '@/components/booking/BookingProgress';
<BookingProgress currentStep={1} totalSteps={4} />
```

---

## FlatList Best Practices

For any list longer than 5 items, use `FlatList` (not `.map()`):

```tsx
const renderItem = useCallback(({ item }: { item: MyType }) => (
  <MyItemComponent item={item} />
), []);

const keyExtractor = useCallback((item: MyType) => item.id, []);

<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.list}
/>
```

---

## Form Screens

All form screens must use `KeyboardAvoidingView`:

```tsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView>
    {/* form fields */}
  </ScrollView>
</KeyboardAvoidingView>
```

---

## Cross-Tab Navigation

```tsx
// From within HomeStack → navigate to BookingsTab → BookingDetail
navigation.getParent()?.navigate('BookingsTab', {
  screen: 'BookingDetail',
  params: { id: bookingId },
});

// Reset navigation stack (e.g. after BookingSuccess)
navigation.getParent()?.navigate('BookingsTab', { screen: 'BookingList' });
```

---

## StyleSheet Rules

- Always use `StyleSheet.create({})` at the bottom of each file — never inline styles for repeated patterns
- Use `colors.*` tokens — no hardcoded hex values in component files
- Name styles descriptively: `styles.cardTitle`, not `styles.text3`

---

## TypeScript Rules

- No `any` types in new files (except route params where the model isn't yet typed)
- All `navigation.navigate()` calls must use typed route names
- All store actions must have typed signatures
- Run `npm run type-check` before committing

---

## Coding Conventions

| Convention | Example |
|-----------|---------|
| Component names | `PascalCase` |
| Hook names | `useXxx` |
| Store names | `useXxxStore` |
| Constants | `UPPER_SNAKE_CASE` for true constants, `camelCase` for config objects |
| File names | Match the default export name |
| Route names | Match the screen component name minus `Screen` suffix |
