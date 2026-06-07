# 📱 APK Build Guide - SalonBooking Customer App

## Quick Build (Recommended)

### Option 1: Using Build Script
```bash
./build-apk.sh
```

### Option 2: Manual Build Commands

#### Step 1: Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

#### Step 3: Configure the project (first time only)
```bash
eas build:configure
```

#### Step 4: Build APK

**For Testing (Preview Build):**
```bash
eas build --platform android --profile preview
```

**For Production:**
```bash
eas build --platform android --profile production
```

---

## 🏗️ Build Profiles

### 1. Preview Build
- **Purpose:** Testing and internal distribution
- **Output:** APK file
- **Login Required:** No (free tier)
- **Best for:** Quick testing, sharing with team

### 2. Production Build
- **Purpose:** Play Store submission or final release
- **Output:** APK or AAB file
- **Best for:** Official releases

---

## 📦 Local Build (Alternative Method)

If you want to build locally without using Expo's cloud:

### Prerequisites:
1. Android Studio installed
2. Android SDK configured
3. Java JDK 17 or higher

### Commands:
```bash
# Install dependencies
npm install

# Build locally (requires Android Studio setup)
eas build --platform android --profile preview --local
```

---

## 🚀 Step-by-Step First Time Setup

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Create/Login to Expo Account
```bash
eas login
# Or create account: eas register
```

### 3. Configure Project
```bash
eas build:configure
```
This will:
- Link your project to Expo
- Generate a project ID
- Update app.json

### 4. Build APK
```bash
# For testing
eas build --platform android --profile preview

# For production
eas build --platform android --profile production
```

### 5. Download APK
After build completes:
- You'll get a download link in terminal
- Or visit: https://expo.dev/accounts/[your-account]/projects/salon-booking-customer/builds
- Download the APK and install on Android device

---

## 📱 Installing APK on Device

### Method 1: Direct Install
1. Download APK to your Android device
2. Open the APK file
3. Allow "Install from Unknown Sources" if prompted
4. Install and open the app

### Method 2: ADB Install
```bash
# Connect device via USB with USB debugging enabled
adb install path/to/your-app.apk
```

---

## 🔧 Troubleshooting

### Error: "eas: command not found"
**Solution:**
```bash
npm install -g eas-cli
```

### Error: "Not logged in"
**Solution:**
```bash
eas login
```

### Error: "No project ID"
**Solution:**
```bash
eas build:configure
```

### Build Failed
**Common fixes:**
1. Update dependencies: `npm install`
2. Clear cache: `npm run clear`
3. Check app.json configuration
4. Ensure valid package name in android.package

---

## 📋 Build Checklist

Before building, ensure:
- [ ] All dependencies installed: `npm install`
- [ ] App builds locally: `npm start`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No lint errors: `npm run lint`
- [ ] Version updated in app.json
- [ ] Android package name is correct
- [ ] Icons and splash screen present

---

## 🎯 Build Output

After successful build, you'll get:
- **APK file** (typically 40-60 MB)
- **Download link** (expires in 90 days)
- **Build logs** (for debugging if needed)

---

## 🔄 Updating Your App

To release a new version:

1. Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "android": {
      "versionCode": 2
    }
  }
}
```

2. Build new APK:
```bash
eas build --platform android --profile production
```

---

## 📊 Build Time

Expected build times:
- **Preview:** 10-15 minutes
- **Production:** 15-20 minutes
- **Local:** 5-10 minutes (requires setup)

---

## 💡 Tips

1. **First build takes longer** - subsequent builds are faster
2. **Use preview profile for testing** - it's faster and free
3. **Local builds are fastest** - but require Android Studio setup
4. **Keep build logs** - helpful for debugging
5. **Test on real device** - simulators may behave differently

---

## 🆘 Need Help?

1. Check Expo docs: https://docs.expo.dev/build/setup/
2. Check build logs in Expo dashboard
3. Verify all prerequisites are met
4. Check the Troubleshooting section above

---

## 📱 Current App Configuration

- **App Name:** SalonBooking
- **Package:** com.salonapp.customer
- **Version:** 1.0.0
- **Version Code:** 1
- **Minimum SDK:** As per Expo defaults
- **Target SDK:** As per Expo defaults

---

## 🎉 Quick Start

```bash
# One command to build (after initial setup)
eas build --platform android --profile preview
```

That's it! Wait for the build to complete and download your APK.
