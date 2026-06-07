# 📦 Build & Deployment

---

## Development

```bash
npm start          # Start Expo dev server (Expo Go)
npm run android    # Open on Android emulator
npm run ios        # Open on iOS simulator (macOS only)
npm run web        # Open in browser
npm run clear      # Clear Metro cache and restart
```

### Demo Credentials
| Field | Value |
|-------|-------|
| Phone | Any number (e.g. `9876543210`) |
| OTP | `123456` |

---

## EAS Build (Production APK / IPA)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project (first time only)
eas build:configure

# Build Android APK/AAB
eas build --platform android

# Build iOS IPA
eas build --platform ios

# Build both
eas build --platform all
```

### Build Profiles (`eas.json`)

| Profile | Use Case |
|---------|----------|
| `development` | Local dev with dev client |
| `preview` | Internal testing APK |
| `production` | App Store / Play Store release |

---

## App Store / Play Store Submission

```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios
```

---

## App Config (`app.json`)

| Key | Value |
|-----|-------|
| Bundle ID (iOS) | `com.salonapp.customer` |
| Package (Android) | `com.salonapp.customer` |
| Version | `1.0.0` |
| Build Number | `1` |
| Orientation | Portrait only |
| iOS permissions | Location, Camera, Photos, FaceID |
| Android permissions | Location, Camera, Storage, Biometric |

---

## Code Quality

```bash
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix lint issues
npm run type-check    # TypeScript check (no emit)
npm test              # Run Jest tests
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Module not found` errors | `npm run clear` |
| Animations choppy | Test on real device, not simulator |
| OTP not working | Use `123456` in demo mode |
| App stuck on splash | `npm run clear && npm start` |
| Android build fails | Ensure Android SDK configured in Android Studio |
| iOS build fails | Ensure Xcode Command Line Tools installed |
| Type errors after navigation changes | `npm run type-check` |
| AsyncStorage data stale | Call `logout()` from Profile screen to clear session |
| Metro bundler port conflict | `npx kill-port 8081 && npm start` |
